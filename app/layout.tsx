import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL;
const CONTACT_URL = process.env.NEXT_PUBLIC_CONTACT_URL;

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
              <a href="/read">Read</a>
              <a href="/author">Author</a>
              {CONTACT_URL && (
                <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
                  Contact
                </a>
              )}
              {DONATE_URL && (
                <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                  Donate
                </a>
              )}
            </nav>
          </header>
          <main>{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
