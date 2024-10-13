import React, { FC } from "react";
import ReactMarkdown from "react-markdown";

export interface ICard {
  pageContent: string;
  metadata: {
    hash: string;
  };
}

interface ICardProps {
  card: ICard;
  selected: string[] | null;
}

export const Card: FC<ICardProps> = ({ card, selected }) => (
  <div
    id={card.metadata.hash}
    className={`card bg-base-100 shadow-sm transition-all duration-300 ease-in-out mb-4 ${
      selected && selected.includes(card.metadata.hash)
        ? "border-2 border-primary"
        : "border border-base-300 hover:border-primary/50"
    }`}
  >
    <div className="card-body">
      <ReactMarkdown className="prose">{card.pageContent}</ReactMarkdown>
      <div className="card-actions justify-end">
        <span className="text-xs text-base-content/60">
          {card.metadata.hash}
        </span>
      </div>
    </div>
  </div>
);
