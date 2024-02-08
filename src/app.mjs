import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const chat = async (req, res) => {
  const client = new BedrockRuntimeClient({
    region: "eu-central-1",
  });

  const { prompt } = req.body;

  const modelId = "amazon.titan-text-express-v1";

  console.log("PROMPT: ", prompt);

  const input = {
    modelId: modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inputText: prompt,
      textGenerationConfig: {
        maxTokenCount: 2048,
        temperature: 0,
        stopSequences: ["User:"],
        topP: 0.1,
      },
    }),
  };

  const command = new InvokeModelCommand(input);
  try {
    const response = await client.send(command);
    const decodedResponseBody = new TextDecoder().decode(response.body);

    /** @type {ResponseBody} */
    const responseBody = JSON.parse(decodedResponseBody);

    console.log("RES: ", responseBody);
    res.send(responseBody);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
app.use("/chat", chat);

export default app;
