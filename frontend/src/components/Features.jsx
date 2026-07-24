import "./Features.css";

function Features() {
    return (
        <section className="features" id="features">

            <h2>Why Choose CrackInt?</h2>

            <div className="feature-grid">

                <div className="feature-card">
                    <h3>🤖 AI Feedback</h3>
                    <p>Receive instant AI-powered feedback after every interview.</p>
                </div>

                <div className="feature-card">
                    <h3>🎤 Voice Interview</h3>
                    <p>Practice interviews with realistic voice interaction.</p>
                </div>

                <div className="feature-card">
                    <h3>💼 Multiple Roles</h3>
                    <p>Prepare for Frontend, Backend, Full Stack and more.</p>
                </div>

            </div>

        </section>
    );
}

export default Features;