// This module handles interactions with the OpenAI API for generating responses based on input messages.
// It uses the GPT-3.5-turbo model to generate responses with a maximum token limit of 100.
// The API key is retrieved from the environment variables using dotenv configuration.
// The getResponse function takes a message as input and returns the generated response.

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.API_KEY });

async function getResponse(message) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: message}],
    model: "gpt-3.5-turbo",
    max_tokens:100
  });

  return completion.choices[0].message.content;
}

export default getResponse;
