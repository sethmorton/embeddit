import React from "react";
import Image from "next/image";
interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export default function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      className={`navbar bg-base-300 shadow-lg ${className || ""}`}
      {...props}
    >
      <div className="navbar-start"></div>
      <div className="navbar-center">
        <a className="btn btn-ghost normal-case text-4xl font-extrabold text-primary hover:text-primary-focus transition-colors duration-200">
          Embeddit
        </a>
      </div>
      <div className="navbar-end">
        <Image src="/logo_embeddit.png" alt="Logo" width={40} height={40} />
      </div>
    </header>
  );
}
