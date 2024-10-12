// UrlButton.tsx

import { Button } from "./Button";
import React, { FC } from "react";
import { IconContext } from "react-icons";
import { SiReddit } from "react-icons/si"; // Import Reddit icon
import Link from "next/link";

export interface IUrlEntry {
  url: string;
  title: string;
  seeded: boolean;
  loading: boolean;
}

interface IURLButtonProps {
  entry: IUrlEntry;
  onClick: () => Promise<void>;
}

const UrlButton: FC<IURLButtonProps> = ({ entry, onClick }) => (
  <div key={`${entry.url}-${entry.seeded}`} className="pr-2 lg:flex-grow">
    <Button
      className={`relative overflow-hidden w-full my-1 lg:my-2 mx-2 ${
        entry.loading ? "shimmer" : ""
      }`}
      style={{
        backgroundColor: entry.seeded ? "green" : "bg-gray-800",
        color: entry.seeded ? "white" : "text-gray-200",
      }}
      onClick={onClick}
    >
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white-500 hover:bg-white-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200 flex items-center justify-center rounded-full p-2 text-3xl text-white transition duration-200 hover:cursor-pointer dark:text-white"
      >
        <SiReddit
          color="red"
          fontSize={24}
          className="hover:text-green"
        />
      </a>
      {entry.loading && (
        <div
          className="absolute inset-0"
          style={{
            zIndex: -1,
            background:
              "linear-gradient(90deg, white, rgba(255,255,255,0.5), white)",
            animation: "shimmer 2s infinite",
          }}
        ></div>
      )}
      <div className="relative">{entry.title}</div>
    </Button>
  </div>
);

export default UrlButton;
