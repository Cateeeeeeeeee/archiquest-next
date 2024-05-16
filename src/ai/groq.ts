"use server";
import Groq from "groq-sdk";

const groq_key = process.env.GROQ;

const groq = new Groq({
  apiKey: groq_key,
});

export type Message = {
  content: string;
  role: "user" | "assistant" | "system";
};

type GroqRequest = {
  response_format?: { type: "json_object" };
  messages: Message[];
  max_tokens: number;
  model: string;
};

//We can call the Groq API and pass our user prompt, max tokens and system prompt.
export async function getGroqCompletion(
  userPrompt: string,
  max_tokens: number,
  systemPrompt: string = "",
  jsonOnly: boolean = false
) {
  if (!userPrompt || userPrompt.trim() === "") {
    console.warn("User prompt is empty. Using default prompt.");
    userPrompt = "You are a helpful assistant.";
  }

  const messages = [
    { role: "system", content: systemPrompt || "You are a helpful assistant." },
    { role: "user", content: userPrompt },
  ];

  const body = {
    messages,
    model: "llama3-70b-8192",
    max_tokens: max_tokens,
  } as GroqRequest;

  if (jsonOnly) body.response_format = { type: "json_object" };

  try {
    const completion = await groq.chat.completions.create(body);
    return completion.choices[0]?.message?.content || "Oops, something went wrong.";
  } catch (error) {
    console.error("Error in getGroqCompletion:", error);
    throw error;
  }
}

//We can call the Groq API and pass our user prompt, max tokens and system prompt.
export async function getGroqChat(max_tokens: number, messages: Message[]) {
  const body = {
    messages: messages,
    model: "llama3-70b-8192",
    max_tokens: max_tokens,
  };

  try {
    const completion = await groq.chat.completions.create(body);
    return completion.choices[0]?.message?.content || "Oops, something went wrong.";
  } catch (error) {
    console.error("Error in getGroqChat:", error);
    throw error;
  }
}

export async function getGroqCompletionParallel(
  userPrompts: string[],
  max_tokens: number,
  systemPrompts: string[],
  jsonOnly: boolean = false
) {
  //Iterate over the longer of the two arrays
  const iterator = systemPrompts.length > userPrompts.length ? systemPrompts : userPrompts;

  const completions = await Promise.all(
    iterator.map(async (p, i) => {
      let userPrompt = userPrompts[Math.min(i, userPrompts.length - 1)];
      const systemPrompt = systemPrompts[Math.min(i, systemPrompts.length - 1)];

      if (!userPrompt || userPrompt.trim() === "") {
        console.warn(`User prompt at index ${i} is empty. Using default prompt.`);
        userPrompt = "You are a helpful assistant.";
      }

      const messages = [
        { role: "system", content: systemPrompt || "You are a helpful assistant." },
        { role: "user", content: userPrompt },
      ];

      const body = {
        messages,
        model: "llama3-8b-8192",
        max_tokens: max_tokens,
      } as GroqRequest;

      if (jsonOnly) body.response_format = { type: "json_object" };

      try {
        return groq.chat.completions.create(body);
      } catch (error) {
        console.error(`Error in getGroqCompletionParallel at index ${i}:`, error);
        throw error;
      }
    })
  );

  return completions.map((c) => c.choices[0]?.message?.content || "No response.");
}