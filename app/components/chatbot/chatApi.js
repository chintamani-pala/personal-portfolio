const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "https://portfolio-chatbot-w2wa.onrender.com";

export async function sendMessage(query) {
  const response = await fetch(`${CHAT_API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Failed to connect to the AI assistant.");
  }

  const data = await response.json();
  return data.response;
}
