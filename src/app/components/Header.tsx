import Image from "next/image";

export default function Header({ className, title }: { className?: string; title?: string }) {
  return (
    <header
      className={`flex items-center justify-center text-gray-200 text-2xl ${className}`}
    >
      <div className="text-4xl ml-3 mr-3">+{title}</div>
    </header>
  );
}
