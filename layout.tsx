import './globals.css';

export const metadata = {
  title: "Joe's Book",
  description: 'A shared home for the pages of the book.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <a href="/" className="brand">
              Joe&rsquo;s Book
            </a>
            <nav>
              <a href="/">Read</a>
              <a href="/upload">Upload</a>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
