export const metadata = {
  title: "Embeddit",
  description: "ChatGPT with Reddit",
};

import "../global.css";

//

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="lofi">
      <body>{children}</body>
    </html>
  );
}
