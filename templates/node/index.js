import { NovixoAI } from "novixo-ai";
import { AgentLogger } from "novixo-agent-logger";

const ai = new NovixoAI({
  keys: {
    groq: process.env.GROQ_KEY,
    gemini: process.env.GEMINI_KEY,
  },
});

const logger = new AgentLogger();
logger.attachToNovixoAI(ai);

const response = await ai.ask("Explain offline-first architecture in one sentence.");
console.log("Response:", response);
console.log("Logs:", logger.getLogs());
