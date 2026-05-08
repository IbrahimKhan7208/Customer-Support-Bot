import { llmCall } from "./chat.js";

export async function promptController(req, res) {
  let { text } = req.body;

  if (!text) {
    return res.send("Prompt Required!");
  }

  try {
    const response = await llmCall(text);
    res.send(response);
  } catch (err) {
    console.error("LLM Error:", err.message);
    res.status(500).send(err.message);
  }
}
