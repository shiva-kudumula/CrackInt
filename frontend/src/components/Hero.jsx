import "./Hero.css";
import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero">

      <div className="hero-left">

        <p className="badge">
          ⭐ AI-Powered Interview Platform
        </p>

        <h1 className="hero-title">
            Crack Your Next <span className="keep-together"> Tech Interview</span> 
        </h1>

        <p className="description">
          Practice realistic mock interviews with AI-powered feedback
          and land your dream software job with confidence.
        </p>

        <div className="hero-buttons">
            <button
                className="primary-btn"
                onClick={() => navigate("/login")}
            >
                Start Interview
            </button>
          <button
                className="secondary-btn"
                onClick={() =>
                    document.getElementById("features").scrollIntoView({
                        behavior: "smooth"
                    })
                }
            >
                Learn More
              </button>
        </div>

        <div className="hero-highlights">
          <span>✓ AI Feedback</span>
          <span>✓ Voice Interview</span>
          <span>✓ Multiple Roles</span>
        </div>

      </div>


    </section>
  );
}

export default Hero;