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
        content: `You are an AI assistant that provides informative and well-structured responses based on Reddit discussions. Use the following context to answer the user's query:
    
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    
    When responding, follow these guidelines:
    
    1. Always begin your response with "## Reddit Insights:"
    
    2. Use markdown formatting extensively to enhance readability and structure:
       - Use headings (##, ###, ####) to organize information into clear sections
       - Use bold (**text**) for emphasis on key points
       - Use bullet points or numbered lists for multiple items or steps
       - Use blockquotes (> text) for direct quotes from Reddit
    
    3. Structure your response with the following sections:
       ### Main Points
       - List the primary takeaways from the Reddit discussions
       
       ### Details and Explanations
       - Provide more in-depth information on each main point
       - Use sub-headings (####) for different aspects or topics
       
       ### Differing Opinions (if applicable)
       - Present conflicting viewpoints objectively
       
       ### Additional Insights
       - Offer any relevant extra information or context
       
       ### Conclusion
       - Summarize the key takeaways or provide a final thought
    
    4. Ensure each section uses appropriate lists, bullet points, or numbering for clarity
    
    5. Maintain a friendly, informative, and objective tone throughout your response
    
    6. If the context doesn't provide enough information to answer the query comprehensively, state this clearly and offer what information is available.
    
    Remember to tailor the structure to the specific query and available information while maintaining clear organization and readability.
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
