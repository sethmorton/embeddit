import { getBatchEmbeddings } from "@/utils/embeddings";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import {
  Pinecone,
  PineconeRecord,
  ServerlessSpecCloudEnum,
} from "@pinecone-database/pinecone";
import { chunkedUpsert } from "../../utils/chunkedUpsert";
import md5 from "md5";
import { RedditApiService } from "./RedditApiService";
import { truncateStringByBytes } from "@/utils/truncateString";
import { RedditPost } from "../../../../types";
import React from "react";

interface SeedOptions {
  chunkSize: number;
  chunkOverlap: number;
}

async function seed(
  subreddit: string,
  limit: number,
  indexName: string,
  cloudName: ServerlessSpecCloudEnum,
  regionName: string,
  options: SeedOptions,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) {
  try {
    const pinecone = new Pinecone();
    const { chunkSize, chunkOverlap } = options;

    const redditApiService = new RedditApiService(
      process.env.REDDIT_AUTH_TOKEN!,
      process.env.REDDIT_USER_AGENT!
    );

    const posts = await redditApiService.getSubredditPostsData(
      subreddit,
      limit
    );
    setProgress(10);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });
    const documents = await Promise.all(
      posts.map((post) => prepareDocument(post, splitter))
    );
    setProgress(30);

    const indexList =
      (await pinecone.listIndexes())?.indexes?.map((index) => index.name) || [];
    if (!indexList.includes(indexName)) {
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536,
        waitUntilReady: true,
        spec: {
          serverless: {
            cloud: cloudName,
            region: regionName,
          },
        },
      });
    }

    const index = pinecone.Index(indexName);

    const flatDocuments = documents.flat();
    const batchSize = 100; // Adjust based on your rate limits and performance needs
    const batches = Math.ceil(flatDocuments.length / batchSize) || 1;

    for (let i = 0; i < batches; i++) {
      const batch = flatDocuments.slice(i * batchSize, (i + 1) * batchSize);
      const batchEmbeddings = await getBatchEmbeddings(
        batch.map((doc) => doc.pageContent)
      );
      const vectors = batch.map((doc, index) =>
        embedDocument(doc, batchEmbeddings[index])
      );
      await chunkedUpsert(index!, vectors, "");
      setProgress(30 + Math.floor(((i + 1) / batches) * 70));
    }

    return flatDocuments;
  } catch (error) {
    console.error("Error seeding:", error);
    throw error;
  }
}

function embedDocument(doc: Document, embedding: number[]): PineconeRecord {
  const hash = md5(doc.pageContent);

  return {
    id: hash,
    values: embedding,
    metadata: {
      chunk: doc.pageContent,
      text: doc.metadata.text as string,
      title: doc.metadata.title as string,
      author: doc.metadata.author as string,
      url: doc.metadata.url as string,
      hash: doc.metadata.hash as string,
    },
  } as PineconeRecord;
}

async function prepareDocument(
  post: RedditPost,
  splitter: RecursiveCharacterTextSplitter
): Promise<Document[]> {
  const pageContent = `Title: ${post.title}\n\nContent: ${post.selftext}`;
  console.log(pageContent);
  console.log(post.selftext);
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        url: post.url,
        text: truncateStringByBytes(pageContent, 36000),
        title: post.title,
        author: post.author,
        content: post.selftext,
      },
    }),
  ]);

  return docs.map((doc: Document) => ({
    ...doc,
    metadata: {
      ...doc.metadata,
      hash: md5(doc.pageContent),
    },
  }));
}

export default seed;
