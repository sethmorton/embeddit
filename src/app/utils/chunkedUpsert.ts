import { Pinecone, PineconeRecord, Index } from "@pinecone-database/pinecone";

const MAX_VECTORS_PER_UPSERT = 50; // Reduced from 100
const MAX_METADATA_SIZE = 1024 * 1024; // 1MB

// Add a simple in-memory cache
const cache: { [key: string]: PineconeRecord } = {};

export const chunkedUpsert = async (
  index: Index,
  vectors: PineconeRecord[],
  namespace: string
): Promise<void> => {
  const chunks = sliceIntoChunks(vectors, MAX_VECTORS_PER_UPSERT);

  for (const chunk of chunks) {
    try {
      const truncatedChunk = chunk.map((vector) => {
        // Check if the vector is already in the cache
        if (cache[vector.id]) {
          return cache[vector.id];
        }

        const truncatedVector = {
          ...vector,
          metadata: truncateMetadata(vector.metadata),
        };

        // Add the truncated vector to the cache
        cache[vector.id] = truncatedVector;

        return truncatedVector;
      });
      await index.namespace(namespace).upsert(truncatedChunk);
      console.log("upsert chunk", truncatedChunk);
    } catch (error) {
      console.error("Error upserting chunk:", error);
      continue;
    }
  }
};

const truncateMetadata = (metadata: any): any => {
  const stringified = JSON.stringify(metadata);
  if (stringified.length <= MAX_METADATA_SIZE) {
    return metadata;
  }

  // Truncate each field if necessary
  const truncated: any = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "string") {
      truncated[key] = value.slice(
        0,
        Math.floor(MAX_METADATA_SIZE / Object.keys(metadata).length)
      );
    } else {
      truncated[key] = value;
    }
  }
  return truncated;
};

const sliceIntoChunks = <T>(arr: T[], chunkSize: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, (i + 1) * chunkSize)
  );
};
