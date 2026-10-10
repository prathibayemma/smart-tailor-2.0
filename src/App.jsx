
import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState("");
  const [skinTone, setSkinTone] = useState("Not sure");
  const [bodyType, setBodyType] = useState("Not sure");
  const [pinterestLink, setPinterestLink] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCustomization, setShowCustomization] = useState(false);
  const [dressColor, setDressColor] = useState("Emerald Green");
  const [neckline, setNeckline] = useState("V-neck");
  const [sleeves, setSleeves] = useState("Three-quarter sleeves");

function handleImage(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.type)) {
    setError("Please upload a JPG, PNG, WEBP, or GIF image.");
    event.target.value = "";
    return;
  }

  if (file.size > 6 * 1024 * 1024) {
    setError("Please choose an image smaller than 6 MB.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    setImage(reader.result);
    setImageData(reader.result);
    setError("");
    setRecommendations("");
  };

  reader.onerror = () => {
    setError("Could not read the image. Please try another file.");
  };

  reader.readAsDataURL(file);
}
function removeImage() {
  setImage(null);
  setImageData("");
  setError("");
  setRecommendations("");

  const input = document.getElementById("dress-image");
  if (input) {
    input.value = "";
  }
}


  async function getRecommendations() {
    setLoading(true);
    setError("");
    setRecommendations("");

    try {
      const response = fetch("https://smart-tailor-backend-63gv.onrender.com/api/recommendations"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skinTone,
            bodyType,
            imageData: imageData || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The AI request failed.");
      }

      setRecommendations(data.recommendations);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Could not reach the AI backend. Make sure the server on port 3000 is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadDesignNotes() {
    const details = `SMART TAILOR 2.0 - DESIGN NOTES

AI RECOMMENDATIONS
${recommendations}

USER PREFERENCES
Skin undertone: ${skinTone}
Body-shape category: ${bodyType}

CUSTOM DESIGN
Colour: ${dressColor}
Neckline: ${neckline}
Sleeves: ${sleeves}

Discuss fabric, measurements, fit, and construction with your tailor.
These notes are a starting brief, not a finished sewing pattern.`;

    const blob = new Blob([details], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "smart-tailor-design.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="app">
      <nav className="navbar">
        <div className="brand">
          ✦ Smart Tailor <span>2.0</span>
        </div>
        <a href="#studio">Design Studio</a>
      </nav>

      <section className="hero">
        <p className="eyebrow">YOUR STYLE, YOUR STORY</p>
        <h1>
          Dream it. Design it.
          <br />
          <span>Get it stitched.</span>
        </h1>
        <p className="intro">
          Turn your favourite outfit inspiration into a personalised
          design you can take to your tailor.
        </p>
      </section>

      <section className="studio" id="studio">
        <div className="section-heading">
          <p className="eyebrow">LET'S BEGIN</p>
          <h2>Your design studio</h2>
          <p>
            Upload an outfit and get AI-powered ideas for your custom design.
          </p>
        </div>

        <div className="form-grid">
          <div className="panel">
            <h3>01. Your inspiration</h3>
            <p>Upload an outfit photo to help the AI understand your style.</p>

<label className="upload-box">
  {image ? (
    <img src={image} alt="Your dress inspiration preview" />
  ) : (
    <>
      <span className="upload-icon">＋</span>
      <strong>Choose your outfit image</strong>
      <span>Click here to browse your files</span>
      <span>JPG, PNG, WEBP or GIF · Max 6 MB</span>
    </>
  )}

  <input
    id="dress-image"
    type="file"
    accept="image/jpeg,image/png,image/webp,image/gif"
    onChange={handleImage}
  />
</label>

{image && (
  <button
    type="button"
    className="secondary-button"
    onClick={removeImage}
  >
    Remove image ×
  </button>
)}

 

            <label className="field-label" htmlFor="pinterest">
              Pinterest link (optional)
            </label>
            <input
              id="pinterest"
              type="url"
              value={pinterestLink}
              onChange={(event) => setPinterestLink(event.target.value)}
              placeholder="https://pinterest.com/..."
            />
            <p className="hint">
              For now, upload the image itself for visual AI analysis.
              Pasting a link alone does not send that image to the AI.
            </p>
          </div>

          <div className="panel">
            <h3>02. Your preferences</h3>
            <p>These preferences help guide the AI's suggestions.</p>

            <label className="field-label" htmlFor="skin">
              Skin undertone
            </label>
            <select
              id="skin"
              value={skinTone}
              onChange={(event) => setSkinTone(event.target.value)}
            >
              <option>Not sure</option>
              <option>Warm</option>
              <option>Cool</option>
              <option>Neutral</option>
            </select>

            <label className="field-label" htmlFor="body">
              Preferred body-shape category
            </label>
            <select
              id="body"
              value={bodyType}
              onChange={(event) => setBodyType(event.target.value)}
            >
              <option>Not sure</option>
              <option>Hourglass</option>
              <option>Pear</option>
              <option>Apple</option>
              <option>Rectangle</option>
              <option>Inverted triangle</option>
            </select>

            <p className="hint">
              You can leave these as "Not sure." Your preferences are
              guides, not rules about what you should wear.
            </p>

            <button
              className="primary-button"
              onClick={getRecommendations}
              disabled={loading}
            >
              {loading ? "AI is designing your ideas..." : "Explore my style ↗"}
            </button>
          </div>
        </div>

        {error && (
          <div className="results">
            <h3>Something needs attention</h3>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="results">
            <p className="eyebrow">SMART TAILOR AI</p>
            <h2>Exploring your style...</h2>
            <p>
              The AI is preparing colour suggestions and custom dress ideas.
              This may take a few moments.
            </p>
          </div>
        )}

        {recommendations && (
          <section className="results">
            <p className="eyebrow">YOUR PERSONAL STYLE IDEAS</p>
            <h2>Your AI recommendations</h2>
            <div className="ai-response">{recommendations}</div>

            <button
              className="secondary-button"
              onClick={() => setShowCustomization(!showCustomization)}
            >
              {showCustomization
                ? "Hide customisation"
                : "Customise my design (optional)"}
            </button>

            {showCustomization && (
              <div className="customization">
                <h3>Make it your own</h3>

                <label className="field-label" htmlFor="color">
                  Dress colour
                </label>
                <select
                  id="color"
                  value={dressColor}
                  onChange={(event) => setDressColor(event.target.value)}
                >
                  <option>Emerald Green</option>
                  <option>Royal Blue</option>
                  <option>Burgundy</option>
                  <option>Lavender</option>
                  <option>Black</option>
                  <option>Ivory</option>
                  <option>Coral</option>
                </select>

                <label className="field-label" htmlFor="neckline">
                  Neckline
                </label>
                <select
                  id="neckline"
                  value={neckline}
                  onChange={(event) => setNeckline(event.target.value)}
                >
                  <option>V-neck</option>
                  <option>Round neck</option>
                  <option>Boat neck</option>
                  <option>Square neck</option>
                  <option>Sweetheart neck</option>
                </select>

                <label className="field-label" htmlFor="sleeves">
                  Sleeves
                </label>
                <select
                  id="sleeves"
                  value={sleeves}
                  onChange={(event) => setSleeves(event.target.value)}
                >
                  <option>Three-quarter sleeves</option>
                  <option>Full sleeves</option>
                  <option>Short sleeves</option>
                  <option>Sleeveless</option>
                  <option>Puff sleeves</option>
                </select>

                <div className="design-summary">
                  <h4>Your current design</h4>
                  <p>Colour: {dressColor}</p>
                  <p>Neckline: {neckline}</p>
                  <p>Sleeves: {sleeves}</p>
                </div>

                <button
                  className="primary-button"
                  onClick={downloadDesignNotes}
                >
                  Download design notes ↓
                </button>
              </div>
            )}

            {!showCustomization && (
              <button
                className="primary-button"
                onClick={downloadDesignNotes}
              >
                Download AI recommendations ↓
              </button>
            )}
          </section>
        )}
      </section>

      <footer>
        <div className="brand">✦ Smart Tailor 2.0</div>
        <p>Made for your imagination. Designed for your tailor.</p>
      </footer>
    </main>
  );
}

export default App;