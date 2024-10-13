import React, { useState, useEffect, useCallback } from "react";
import { IUrlEntry } from "./UrlButton";
import { Card, ICard } from "./Card";
import { clearIndex, crawlDocument } from "./utils";
import { ServerlessSpecCloudEnum } from "@pinecone-database/pinecone";
import { Input } from "./Input";
import { Button } from "./Button";
import { Spinner } from "../Loading/Spinner";

interface ContextProps {
  className: string;
  selected: string[] | null;
  onCrawlComplete: (completed: boolean) => void;
}

export const Context: React.FC<ContextProps> = ({
  className,
  selected,
  onCrawlComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [entries, setEntries] = useState<IUrlEntry[]>([]);
  const [cards, setCards] = useState<ICard[]>([]); // Initialize with an empty array
  const [limit, setLimit] = useState(10);
  const [subreddit, setSubreddit] = useState("sibo");
  const [indexName] = useState(process.env.PINECONE_INDEX || "");
  const [cloudName] = useState<ServerlessSpecCloudEnum>(
    (process.env.PINECONE_CLOUD as ServerlessSpecCloudEnum) || "aws"
  );
  const [regionName] = useState(process.env.PINECONE_REGION || "us-west-2");
  const [isCrawlComplete, setIsCrawlComplete] = useState(false);

  useEffect(() => {
    const element = selected && document.getElementById(selected[0]);
    element?.scrollIntoView({ behavior: "smooth" });
  }, [selected]);

  const handleCrawl = useCallback(async () => {
    setIsLoading(true);
    setIsCrawlComplete(false);
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
        256,
        1
      );
      setIsCrawlComplete(true);
      onCrawlComplete(true);
    } catch (error) {
      console.error("Crawl failed:", error);
      onCrawlComplete(false);
    } finally {
      setIsLoading(false);
    }
  }, [subreddit, limit, indexName, cloudName, regionName, onCrawlComplete]);

  return (
    <div
      className={`flex flex-col bg-base-200 rounded-lg shadow-xl ${className}`}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Context Settings</h2>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Subreddit</span>
          </label>
          <Input
            type="text"
            placeholder="Enter subreddit"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Number of Posts</span>
          </label>
          <Input
            type="number"
            placeholder="Enter limit"
            value={limit.toString()}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="input input-bordered w-full"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleCrawl}
            disabled={isLoading}
            className="btn btn-primary flex-1"
          >
            {isLoading ? (
              <>
                <Spinner size={20} />
                Crawling...
              </>
            ) : (
              "Crawl Subreddit"
            )}
          </Button>
        </div>
      </div>
      <div className="divider"></div>
      <div className="p-4 overflow-y-auto flex-1">
        {cards.length > 0 ? (
          cards.map((card, key) => (
            <Card key={key} card={card} selected={selected} />
          ))
        ) : (
          <p>No cards available</p>
        )}
      </div>
    </div>
  );
};
