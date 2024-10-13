import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function getBatchEmbeddings(
  inputs: string[]
): Promise<number[][]> {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: inputs.map((input) => input.replace(/\n/g, " ")),
    });
    const result = await response.json();

    if (!result.data) {
      console.error("Unexpected API response structure:", result);
      throw new Error("Unexpected API response structure");
    }

    if (!Array.isArray(result.data)) {
      console.error("API response data is not an array:", result.data);
      throw new Error("API response data is not an array");
    }

    return result.data.map((item: any) => {
      if (!item.embedding || !Array.isArray(item.embedding)) {
        console.error("Invalid embedding in API response:", item);
        throw new Error("Invalid embedding in API response");
      }
      return item.embedding as number[];
    });
  } catch (e) {
    console.error("Error calling OpenAI embedding API: ", e);
    throw new Error(`Error calling OpenAI embedding API: ${e}`);
  }
}
