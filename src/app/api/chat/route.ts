import { Configuration, OpenAIApi } from "openai-edge";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/utils/context";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Get the last message
    const lastMessage = messages[messages.length - 1];

    // Get the context from the last message
    const context = await getContext(lastMessage.content, "");

    const prompt = [
      {
        role: "system",
        content: `You are an AI assistant that provides informative and well-formatted responses based on Reddit discussions. Use the following context to answer the user's query:
    
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    
    When responding:
    1. Always begin your response with "According to Reddit discussions:"
    2. Use markdown formatting to enhance readability:
       - Use bold (**text**) for emphasis on key points
       - Use bullet points or numbered lists for multiple items
       - Use blockquotes (> text) for direct quotes from Reddit
       - Use headings (## or ###) to organize information
    3. Summarize the main points from the Reddit discussions
    4. Provide additional insights or explanations when relevant
    5. If there are conflicting opinions, present them objectively
    6. End with a brief conclusion or takeaway
    
    Remember to maintain a friendly and informative tone throughout your response.
        `,
      },
    ];

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        ...prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
    });
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (e) {
    throw e;
  }
}
