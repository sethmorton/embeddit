import React, { useState, useEffect, useCallback } from "react";
import { IUrlEntry } from "./UrlButton";
import { Card, ICard } from "./Card";
import { clearIndex, crawlDocument } from "./utils";
import { Button } from "./Button";
import { ServerlessSpecCloudEnum } from "@pinecone-database/pinecone";
import LoadingIcon from "../Loading";
interface ContextProps {
  className: string;
  selected: string[] | null;
}

export const Context: React.FC<ContextProps> = ({ className, selected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [entries, setEntries] = useState<IUrlEntry[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const [subreddit, setSubreddit] = useState("sibo");
  const [limit, setLimit] = useState(10);
  const [chunkSize, setChunkSize] = useState(256);
  const [chunkOverlap, setChunkOverlap] = useState(1);
  const [indexName, setIndexName] = useState(process.env.PINECONE_INDEX || "");
  const [cloudName, setCloudName] = useState<ServerlessSpecCloudEnum>(
    (process.env.PINECONE_CLOUD as ServerlessSpecCloudEnum) || "aws"
  );
  const [regionName, setRegionName] = useState(
    process.env.PINECONE_REGION || "us-west-2"
  );

  useEffect(() => {
    const element = selected && document.getElementById(selected[0]);
    element?.scrollIntoView({ behavior: "smooth" });
  }, [selected]);

  const handleCrawl = useCallback(async () => {
    setIsLoading(true);
    setProgress(0);
    console.log("CRAWLING");
    try {
      await crawlDocument(
        subreddit,
        setEntries,
        setCards,
        limit,
        indexName,
        cloudName,
        regionName,
        chunkSize,
        chunkOverlap
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [
    subreddit,
    limit,
    indexName,
    cloudName,
    regionName,
    chunkSize,
    chunkOverlap,
  ]);

  const DropdownLabel: React.FC<
    React.PropsWithChildren<{ htmlFor: string }>
  > = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="text-white p-2 font-bold">
      {children}
    </label>
  );

  return (
    <div
      className={`flex flex-col border-2 overflow-y-auto rounded-lg border-gray-500 w-full ${className}`}
    >
      <div className="flex flex-col items-start sticky top-0 w-full">
        <div className="flex flex-col items-start lg:flex-row w-full lg:flex-wrap p-2">
          <div className="flex flex-col w-full mb-4">
            <DropdownLabel htmlFor="subreddit">Subreddit:</DropdownLabel>
            <input
              id="subreddit"
              type="text"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="p-2 bg-gray-700 rounded text-white w-full"
            />
          </div>
          <div className="flex flex-col w-full mb-4">
            <DropdownLabel htmlFor="limit">Limit:</DropdownLabel>
            <input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="p-2 bg-gray-700 rounded text-white w-full"
            />
          </div>
          <Button
            className="w-full my-2 uppercase active:scale-[98%] transition-transform duration-100"
            style={{
              backgroundColor: "#4f6574",
              color: "white",
            }}
            onClick={handleCrawl}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingIcon />
                <span className="ml-2">Crawling... {progress}%</span>
              </div>
            ) : (
              "Crawl Subreddit"
            )}
          </Button>
        </div>
        <div className="flex-grow w-full px-4">
          <Button
            className="w-full my-2 uppercase active:scale-[98%] transition-transform duration-100"
            style={{
              backgroundColor: "#4f6574",
              color: "white",
            }}
            onClick={() => clearIndex(setEntries, setCards)}
          >
            Clear Index
          </Button>
        </div>
        <div className="text-left w-full flex flex-col rounded-b-lg bg-gray-600 p-3 subpixel-antialiased">
          <div className="my-4 flex flex-col">
            <div className="flex flex-col w-full">
              <DropdownLabel htmlFor="chunkSize">
                Chunk Size: {chunkSize}
              </DropdownLabel>
              <input
                className="p-2 bg-gray-700"
                type="range"
                id="chunkSize"
                min={1}
                max={2048}
                value={chunkSize}
                onChange={(e) => setChunkSize(parseInt(e.target.value))}
              />
            </div>
            <div className="flex flex-col w-full">
              <DropdownLabel htmlFor="chunkOverlap">
                Chunk Overlap: {chunkOverlap}
              </DropdownLabel>
              <input
                className="p-2 bg-gray-700"
                type="range"
                id="chunkOverlap"
                min={1}
                max={200}
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-full">
        {cards &&
          cards.map((card, key) => (
            <Card key={key} card={card} selected={selected} />
          ))}
      </div>
    </div>
  );
};
