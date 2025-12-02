import Groq from "groq-sdk";
import readline from "node:readline/promises";
import { indexDocument, vectorStore } from "./gemini-prepare.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function llmCall(prompt) {
  // if (filePath && typeof filePath === "string" && filePath.trim() !== ""){
  //   const result = await indexDocument(filePath)

  //   if(result.skipped){
  //     console.log("Using Already Indexed!")
  //   }
  //   else{
  //     console.log("New Index!")
  //   }
  // }

  const question = prompt;

  const relevantContext = await vectorStore.similaritySearch(question, 3);
  const context = relevantContext.map((e) => e.pageContent).join("\n\n");

  const SYSTEM_PROMPT = `You are “CareChat”, a professional Customer Support Assistant for the e-commerce company ShopVerse.

Your ONLY knowledge source is the retrieved context. 
Base your answers strictly on that context. 
If the information is not in the context, reply with: 
"I don't have this information in the provided documents."

STYLE & FORMATTING RULES:
• Write in clear, friendly, conversational tone.  
• Use clean ChatGPT-style formatting:  
  - short paragraphs  
  - simple bullet points 
  - line breaks for readability  
  - clear steps when needed
• Do NOT use bold text (**text**) or special characters. Keep it simple. 
• Keep answers concise but helpful, like a trained customer support agent.  
• Never hallucinate. If uncertain, say so.

You do not have acces to check status or perform any action, your role is just to inform them through context.

Your goal is to give helpful answers that are easy to read and feel natural to users.
`;

  const user_query = `Question: ${question}
    Context: ${context}
    Answer: `;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: user_query,
      },
    ],
    model: "openai/gpt-oss-120b",
  });

  return completion.choices[0].message.content;
}
