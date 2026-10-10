import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Allow your React frontend to connect
app.use(cors({
  origin: [
    "http://localhost:5175",
    "https://smart-tailor-2-0.onrender.com"
  ]
}));
app.use(express.json({ limit: "10mb" }));

// Test the backend
app.get("/", (req, res) => {
  res.send("Smart Tailor 2.0 backend is running!");
});

// Generate fashion recommendations without an API
app.post("/api/recommendations", (req, res) => {
  const { skinTone, bodyType, imageData } = req.body;

  let colours;
  let colourReason;

  // Choose colours based on the selected undertone
  if (skinTone === "Warm") {
    colours = ["Olive Green", "Coral", "Mustard Yellow"];
    colourReason =
      "These warm, earthy shades are options you could explore.";
  } else if (skinTone === "Cool") {
    colours = ["Royal Blue", "Lavender", "Emerald Green"];
    colourReason =
      "These cool and jewel-toned shades are options you could explore.";
  } else if (skinTone === "Neutral") {
    colours = ["Teal", "Dusty Rose", "Soft Green"];
    colourReason =
      "These versatile shades are options you could explore.";
  } else {
    colours = ["Navy Blue", "Teal", "Dusty Rose"];
    colourReason =
      "These versatile shades are a good starting point.";
  }

  let silhouettes;

  // Choose dress styles based on an optional preference
  if (bodyType === "Pear") {
    silhouettes = [
      "A-line dress",
      "Fit-and-flare dress"
    ];
  } else if (bodyType === "Apple") {
    silhouettes = [
      "Empire-waist dress",
      "Flowing A-line dress"
    ];
  } else if (bodyType === "Hourglass") {
    silhouettes = [
      "Wrap dress",
      "Tailored dress with a defined waist"
    ];
  } else if (bodyType === "Rectangle") {
    silhouettes = [
      "Belted dress",
      "Dress with gathered details"
    ];
  } else {
    silhouettes = [
      "A-line dress",
      "Straight-cut dress"
    ];
  }

  let imageNote;

  if (imageData) {
    imageNote =
      "You uploaded an inspiration image. Show it to your tailor as a reference. This demo does not automatically analyse the image.";
  } else {
    imageNote =
      "No image uploaded. You can still use these recommendations as a starting point.";
  }

  // Build the result using ordinary strings
  // This avoids template-string and backtick errors.
  let recommendations = "";

  recommendations += "YOUR SMART TAILOR STYLE RECOMMENDATIONS\n\n";

  recommendations += "1. COLOUR IDEAS\n";
  recommendations += "- " + colours[0] + "\n";
  recommendations += "- " + colours[1] + "\n";
  recommendations += "- " + colours[2] + "\n\n";

  recommendations += "Why these colours?\n";
  recommendations += colourReason + "\n\n";

  recommendations += "2. DRESS STYLE IDEAS\n";
  recommendations += "- " + silhouettes[0] + "\n";
  recommendations += "- " + silhouettes[1] + "\n\n";

  recommendations +=
    "Choose the style that makes you feel comfortable and confident.\n\n";

  recommendations += "3. NECKLINE AND SLEEVES\n";
  recommendations += "- Neckline: Square, V-shaped or sweetheart.\n";
  recommendations += "- Sleeves: Short, puff or three-quarter sleeves.\n\n";

  recommendations += "4. FABRIC SUGGESTIONS\n";
  recommendations += "- Cotton for everyday comfort.\n";
  recommendations += "- Crepe for a smooth drape.\n";
  recommendations += "- Georgette for a flowing appearance.\n";
  recommendations += "- Satin for a dressier look.\n\n";

  recommendations += "5. YOUR TAILOR DESIGN NOTE\n";
  recommendations +=
    "Create a " +
    colours[0] +
    " " +
    silhouettes[0] +
    ". Explore a suitable neckline, comfortable sleeves and a fabric that fits the occasion and budget.\n\n";

  recommendations += "6. INSPIRATION IMAGE\n";
  recommendations += imageNote + "\n\n";

  recommendations +=
    "These recommendations are starting ideas, not strict fashion rules.";

  // Send recommendations to the frontend
  res.json({ recommendations: recommendations });
});

// Start the backend
app.listen(PORT, () => {
  console.log(
    "Smart Tailor 2.0 backend running at http://localhost:" + PORT
  );
});

