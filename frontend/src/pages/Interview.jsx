import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AuthNavbar from "../components/AuthNavbar";
import axios from "axios";
import "./Interview.css";

const joinTranscript = (current, next) => {
    const cleaned = next.trim();
    if (!cleaned) return current;
    if (!current) return cleaned;
    return /\s$/.test(current) ? `${current}${cleaned}` : `${current} ${cleaned}`;
};

const downsampleToPcm16 = (samples, inputRate, outputRate = 16000) => {
    const ratio = inputRate / outputRate;
    const outputLength = Math.round(samples.length / ratio);
    const output = new Int16Array(outputLength);

    for (let outputIndex = 0; outputIndex < outputLength; outputIndex += 1) {
        const start = Math.floor(outputIndex * ratio);
        const end = Math.min(Math.floor((outputIndex + 1) * ratio), samples.length);
        let sum = 0;
        for (let inputIndex = start; inputIndex < end; inputIndex += 1) sum += samples[inputIndex];
        const sample = sum / Math.max(1, end - start);
        output[outputIndex] = Math.max(-1, Math.min(1, sample)) * 0x7fff;
    }

    return output.buffer;
};

function Interview() {
    const location = useLocation();
    const navigate = useNavigate();
    const interviewState = location.state;
    const [questions, setQuestions] = useState(interviewState?.questions ?? []);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [speechError, setSpeechError] = useState("");
    const [speechStatus, setSpeechStatus] = useState("");

    const socketRef = useRef(null);
    const audioContextRef = useRef(null);
    const audioProcessorRef = useRef(null);
    const microphoneStreamRef = useRef(null);
    const shouldListenRef = useRef(false);
    const currentQuestionRef = useRef(0);
    const finalizedAnswerRef = useRef("");
    const streamingTokenRef = useRef(null);
    const tokenRequestRef = useRef(null);

    const role = interviewState?.role;
    const difficulty = interviewState?.difficulty;
    const interviewId = interviewState?.interviewId;
    const questionText = questions[currentQuestion]?.question;

    const getStreamingToken = async () => {
        const cachedToken = streamingTokenRef.current;
        if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;

        if (!tokenRequestRef.current) {
            tokenRequestRef.current = axios.get("http://localhost:5000/speech-token")
                .then((response) => {
                    const token = response.data.token;
                    // The backend token can be redeemed for 60 seconds. Leave a small buffer.
                    streamingTokenRef.current = { token, expiresAt: Date.now() + 50_000 };
                    return token;
                })
                .finally(() => {
                    tokenRequestRef.current = null;
                });
        }

        return tokenRequestRef.current;
    };

    useEffect(() => {
        if (!interviewState) navigate("/interview-setup", { replace: true });
    }, [interviewState, navigate]);

    useEffect(() => {
        currentQuestionRef.current = currentQuestion;
    }, [currentQuestion]);

    useEffect(() => {
        if (!questionText) return undefined;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(questionText));
        getStreamingToken().catch(() => {
            // The start action shows a useful error if the key or backend is unavailable.
        });
        return () => window.speechSynthesis.cancel();
    }, [questionText]);

    const updateAnswer = (answer, questionIndex = currentQuestionRef.current) => {
        setQuestions((previousQuestions) => previousQuestions.map((question, index) => (
            index === questionIndex ? { ...question, userAnswer: answer } : question
        )));
    };

    const cleanUpAudio = () => {
        audioProcessorRef.current?.disconnect();
        audioContextRef.current?.close();
        microphoneStreamRef.current?.getTracks().forEach((track) => track.stop());
        audioProcessorRef.current = null;
        audioContextRef.current = null;
        microphoneStreamRef.current = null;
    };

    useEffect(() => () => {
        shouldListenRef.current = false;
        cleanUpAudio();
        socketRef.current?.close();
    }, []);

    const stopRecording = () => {
        shouldListenRef.current = false;
        const socket = socketRef.current;
        if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: "Terminate" }));
        socket?.close();
        socketRef.current = null;
        cleanUpAudio();
        setIsRecording(false);
        setSpeechStatus("");
    };

    const startRecording = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            setSpeechError("This browser cannot access your microphone. Please use Chrome or Edge over HTTPS or localhost.");
            return;
        }

        const questionIndex = currentQuestionRef.current;
        window.speechSynthesis.cancel();
        shouldListenRef.current = true;
        finalizedAnswerRef.current = questions[questionIndex]?.userAnswer ?? "";
        setSpeechError("");
        setSpeechStatus("Connecting to live transcription…");

        try {
            const [token, stream] = await Promise.all([
                getStreamingToken(),
                navigator.mediaDevices.getUserMedia({
                    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
                }),
            ]);

            if (!shouldListenRef.current) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }

            microphoneStreamRef.current = stream;
            // A temporary token is single-use, so never reuse it for the next recording.
            streamingTokenRef.current = null;
            const params = new URLSearchParams({
                token,
                // This model only transcribes English; it will not code-switch.
                speech_model: "universal-streaming-english",
                encoding: "pcm_s16le",
                sample_rate: "16000",
                // Keep raw words while the candidate is speaking; this avoids
                // a full stop being added every time there is a short pause.
                format_turns: "false",
            });
            const socket = new WebSocket(`wss://streaming.assemblyai.com/v3/ws?${params}`);
            socketRef.current = socket;
            socket.binaryType = "arraybuffer";

            socket.onopen = () => {
                if (!shouldListenRef.current) return socket.close();
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const processor = audioContext.createScriptProcessor(4096, 1, 1);

                processor.onaudioprocess = (event) => {
                    if (socket.readyState !== WebSocket.OPEN) return;
                    const pcm = downsampleToPcm16(event.inputBuffer.getChannelData(0), audioContext.sampleRate);
                    socket.send(pcm);
                };

                source.connect(processor);
                processor.connect(audioContext.destination);
                audioContextRef.current = audioContext;
                audioProcessorRef.current = processor;
                setIsRecording(true);
                setSpeechStatus("Listening… words will appear as you speak.");
            };

            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type !== "Turn" || !message.transcript) return;

                if (message.end_of_turn) {
                    finalizedAnswerRef.current = joinTranscript(finalizedAnswerRef.current, message.transcript);
                    updateAnswer(finalizedAnswerRef.current, questionIndex);
                } else {
                    updateAnswer(joinTranscript(finalizedAnswerRef.current, message.transcript), questionIndex);
                }
                setSpeechStatus("Transcribing live…");
            };

            socket.onerror = () => {
                setSpeechError("Live transcription connection failed. Check that the AssemblyAI key is configured in the backend.");
            };

            socket.onclose = () => {
                if (shouldListenRef.current) {
                    setSpeechError("Live transcription session ended unexpectedly. Please try again.");
                    cleanUpAudio();
                    setIsRecording(false);
                    setSpeechStatus("");
                }
            };
        } catch (error) {
            shouldListenRef.current = false;
            cleanUpAudio();
            setSpeechStatus("");
            setSpeechError("Could not start live transcription. Allow microphone access and add ASSEMBLYAI_API_KEY to backend/.env.");
            console.error("Could not start live transcription:", error);
        }
    };

    const changeQuestion = (nextQuestion) => {
        if (isRecording) stopRecording();
        setCurrentQuestion(nextQuestion);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/submit-interview",
                { interviewId, questions },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
            );
            navigate("/interview-result", { state: { interview: response.data.interview } });
        } catch (error) {
            console.error("Unable to submit interview:", error);
        }
    };

    if (!interviewState || !questions.length) return null;

    return (
        <div>
            <AuthNavbar />
            <div className="interview-container">
                <h1>Interview</h1>
                <div className="interview-info">
                    <p><strong>Role:</strong> {role}</p>
                    <p><strong>Difficulty:</strong> {difficulty}</p>
                    <p><strong>Questions:</strong> {questions.length}</p>
                </div>
                <div className="question-card">
                    <h2>Question {currentQuestion + 1}</h2>
                    <div className="question-header">
                        <p>{questionText}</p>
                        <button className="speak-btn" type="button" aria-label="Read question aloud" onClick={() => {
                            window.speechSynthesis.cancel();
                            window.speechSynthesis.speak(new SpeechSynthesisUtterance(questionText));
                        }}>🔊</button>
                    </div>
                </div>
                <textarea rows="8" cols="80" value={questions[currentQuestion].userAnswer ?? ""} aria-label="Your answer" onChange={(event) => {
                    finalizedAnswerRef.current = event.target.value;
                    updateAnswer(event.target.value);
                }} />
                {speechError && <p className="speech-error" role="alert">{speechError}</p>}
                {speechStatus && <p className="speech-status" role="status">{speechStatus}</p>}
                <button className="answer-btn" type="button" onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? "🛑 Stop" : "🎤 Speak"}
                </button>
                <div className="button-container">
                    {currentQuestion > 0 && <button className="answer-btn" type="button" onClick={() => changeQuestion(currentQuestion - 1)}>Previous</button>}
                    {currentQuestion < questions.length - 1 && <button className="answer-btn" type="button" onClick={() => changeQuestion(currentQuestion + 1)}>Next</button>}
                    {currentQuestion === questions.length - 1 && <button className="answer-btn" type="button" onClick={handleSubmit}>Submit</button>}
                </div>
            </div>
        </div>
    );
}

export default Interview;
