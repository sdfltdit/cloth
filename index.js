import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

export async function askClaude(prompt) {
  const res = await client.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  return res.content[0].text;
}