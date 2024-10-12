import { IUrlEntry } from "./UrlButton";
import { ICard } from "./Card";
import { ServerlessSpecCloudEnum } from "@pinecone-database/pinecone";
import { logger } from "../../../../logger";
import React from "react";

export async function crawlDocument(
  subreddit: string,
  setEntries: React.Dispatch<React.SetStateAction<IUrlEntry[]>>,
  setCards: React.Dispatch<React.SetStateAction<ICard[]>>,
  limit: number,
  indexName: string,
  cloudName: ServerlessSpecCloudEnum,
  regionName: string,
  chunkSize: number,
  chunkOverlap: number
): Promise<void> {
  setEntries((prevEntries: IUrlEntry[]) => [
    ...prevEntries,
    { url: subreddit, title: `r/${subreddit}`, loading: true, seeded: false },
  ]);

  try {
    const response = await fetch("/api/crawl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subreddit,
        limit,
        indexName,
        cloudName,
        regionName,
        options: {
          chunkSize,
          chunkOverlap,
        },
      }),
    });
    const { documents } = await response.json();

    setEntries((prevEntries: IUrlEntry[]) =>
      prevEntries.map((entry: IUrlEntry) =>
        entry.url === subreddit
          ? { ...entry, seeded: true, loading: false }
          : entry
      )
    );

    setCards(documents);

    logger.info("Crawling document completed");
  } catch (error) {
    logger.error("Failed to crawl document:", error);
    setEntries((prevEntries: IUrlEntry[]) =>
      prevEntries.map((entry: IUrlEntry) =>
        entry.url === subreddit
          ? { ...entry, seeded: false, loading: false, error: true }
          : entry
      )
    );
    throw new Error("Failed to crawl document");
  }
}

export async function clearIndex(
  setEntries: React.Dispatch<React.SetStateAction<IUrlEntry[]>>,
  setCards: React.Dispatch<React.SetStateAction<ICard[]>>
) {
  try {
    const response = await fetch("/api/clearIndex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    setEntries([]);
    setCards([]);
    logger.info("Index cleared successfully");
  } catch (error) {
    logger.error("Failed to clear index:", error);
    throw new Error("Failed to clear index");
  }
}
