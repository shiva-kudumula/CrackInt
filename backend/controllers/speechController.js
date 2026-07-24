const axios = require("axios");

const createStreamingToken = async (request, response) => {
    if (!process.env.ASSEMBLYAI_API_KEY) {
        return response.status(503).json({ message: "ASSEMBLYAI_API_KEY is not configured." });
    }

    try {
        const result = await axios.get("https://streaming.assemblyai.com/v3/token", {
            headers: { Authorization: process.env.ASSEMBLYAI_API_KEY },
            params: { expires_in_seconds: 60, max_session_duration_seconds: 1800 },
        });
        return response.json({ token: result.data.token });
    } catch (error) {
        console.error("AssemblyAI token request failed:", error.response?.data || error.message);
        return response.status(502).json({ message: "Could not create an AssemblyAI streaming token." });
    }
};

module.exports = {
    createStreamingToken,
};
