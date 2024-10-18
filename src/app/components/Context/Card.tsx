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
    className={`card bg-base-100 shadow-sm transition-all duration-300 ease-in-out mb-4 overflow-hidden ${
      selected && selected.includes(card.metadata.hash)
        ? "border-2 border-primary"
        : "border border-base-300 hover:border-primary/50"
    }`}
  >
    <div className="card-body p-4 sm:p-6">
      <div className="prose prose-sm sm:prose-base max-w-full break-words overflow-auto max-h-60 sm:max-h-80">
        <ReactMarkdown>{card.pageContent}</ReactMarkdown>
      </div>
      <div className="card-actions justify-end mt-2">
        <span className="text-xs text-base-content/60 truncate max-w-full">
          {card.metadata.hash}
        </span>
      </div>
    </div>
  </div>
);
