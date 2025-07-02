const express = require("express");
const { create, Client } = require("@open-wa/wa-automate");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const sessions = {};

const startClient = async (sessionId) => {
  const client = await create({
    sessionId,
    multiDevice: true,
    headless: true,
    useChrome: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  sessions[sessionId] = client;
  return client;
};

app.get("/generate-qr", async (req, res) => {
  const sessionId = req.query.sessionId || "default";
  const client = await create({
    sessionId,
    multiDevice: true,
    headless: true,
    useChrome: true,
    qrTimeout: 0,
    authTimeout: 0,
    blockCrashLogs: true,
    disableSpins: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    qrCallback: (base64Qr) => {
      res.send(`<img src="${base64Qr}" alt="QR Code" />`);
    },
  });
  sessions[sessionId] = client;
});

app.post("/send-message", async (req, res) => {
  const { sessionId, to, caption, image } = req.body;
  try {
    const client = sessions[sessionId] || (await startClient(sessionId));
    await client.sendImage(to, image, "meme.jpg", caption || "");
    res.json({ success: true, message: "Meme sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("WhatsApp bot running on port", PORT));