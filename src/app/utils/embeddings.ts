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
    return result.data.map((item: any) => item.embedding as number[]);
  } catch (e) {
    console.error("Error calling OpenAI embedding API: ", e);
    throw new Error(`Error calling OpenAI embedding API: ${e}`);
  }
}
