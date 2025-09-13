// utils/aiAPI.js
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

export const askAI = async (prompt, language = "english") => {
  const langInstruction = {
    english: "Answer in English suitable for farmers:",
    malayalam: "Answer in Malayalam suitable for farmers:",
    hindi: "Answer in Hindi suitable for farmers:",
    tamil: "Answer in Tamil suitable for farmers:"
  };

  const fullPrompt = `${langInstruction[language] || langInstruction["english"]} ${prompt}`;

  try {
    const response = await fetch(OPENROUTER_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat", // you can swap with another model
        messages: [
          { role: "system", content: "You are a helpful farming assistant." },
          { role: "user", content: fullPrompt }
        ]
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No answer";
  } catch (err) {
    console.error("AI API Error:", err);
    return "Error generating answer";
  }
};
