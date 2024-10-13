import { ScoredPineconeRecord } from "@pinecone-database/pinecone";
import { getMatchesFromEmbeddings } from "./pinecone";
import { getBatchEmbeddings } from "./embeddings";

export type Metadata = {
  url: string;
  text: string;
  chunk: string;
};

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (
  message: string,
  namespace: string,
  maxTokens = 3000,
  minScore = 0.6,
  getOnlyText = true
) => {
  const embedding = (await getBatchEmbeddings([message]))[0];
  const matches = await getMatchesFromEmbeddings(embedding, 5, namespace); // Increase matches
  const qualifyingDocs = matches.filter((m) => m.score && m.score > minScore);

  if (!getOnlyText) return qualifyingDocs;

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).chunk);
  const context = docs.join("\n").substring(0, maxTokens);
  return context;
};
