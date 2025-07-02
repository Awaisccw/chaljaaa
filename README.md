# WhatsApp Meme Bot

## Features
- Generates QR code for WhatsApp linking (`/generate-qr?sessionId=+923001234567`)
- Accepts meme content from n8n via `/send-message` endpoint

## How to Use
1. Deploy to Railway or VPS
2. Visit `/generate-qr?sessionId=YOURNUMBER` to link your WhatsApp
3. Send POST to `/send-message` with:
```
{
  "sessionId": "+92300xxxxxxx",
  "to": "+92300xxxxxxx",
  "caption": "Funny meme caption",
  "image": "data:image/jpeg;base64,..."
}
```