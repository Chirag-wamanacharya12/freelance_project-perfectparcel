
export async function sendWhatsAppMessage(message: string, maxRetries = 3) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.ADMIN_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !from || !to) {
    const missing = [];
    if (!accountSid) missing.push("TWILIO_ACCOUNT_SID");
    if (!authToken) missing.push("TWILIO_AUTH_TOKEN");
    if (!from) missing.push("TWILIO_WHATSAPP_FROM");
    if (!to) missing.push("ADMIN_WHATSAPP_NUMBER");
    
    console.warn(`Twilio configuration missing: ${missing.join(", ")}. Skipping WhatsApp notification.`);
    return;
  }

  const authHeader = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.log(`Retry attempt ${attempt} for WhatsApp message. Waiting ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        },
        body: new URLSearchParams({
          From: from,
          To: to,
          Body: message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("WhatsApp message sent successfully:", data.sid);
        return; // Success, exit the loop
      }

      // If we get here, the response was not OK
      console.error(`Twilio API Error (Attempt ${attempt + 1}):`, data);

      // Only retry on 5xx errors or specific rate limits (429)
      // 4xx errors (like invalid numbers or auth) usually shouldn't be retried
      if (response.status < 500 && response.status !== 429) {
        console.error("Non-retryable error status:", response.status);
        break; 
      }

    } catch (error) {
      console.error(`Failed to send WhatsApp message (Attempt ${attempt + 1}):`, error);
      
      if (attempt === maxRetries) {
        console.error("All retry attempts failed.");
      }
    }
  }
}
