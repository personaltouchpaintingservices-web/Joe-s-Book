'use client';

const EMAIL = 'jclewriteswords@gmail.com';
const REDDIT_URL = 'https://www.reddit.com/user/JCLewisWritesWords/';
const VENMO_HANDLE = '@JCLewisWritesWords';
const VENMO_URL = 'https://venmo.com/u/JCLewisWritesWords';

export default function ContactPage() {
  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Get In Touch</div>
        <h1>Contact</h1>
        <p>A few ways to reach out, follow along, or send some support.</p>
      </div>

      <div className="contact-layout">
        <picture>
          <source srcSet="/images/contact-art-1.webp" type="image/webp" />
          <img
            src="/images/contact-art-1.jpg"
            alt=""
            className="contact-art contact-art-1"
          />
        </picture>

        <div className="contact-list">
          <a href={`mailto:${EMAIL}`} className="contact-row">
            <span className="contact-icon">✉️</span>
            <span className="contact-text">
              <span className="contact-label">Email</span>
              <span className="contact-value">{EMAIL}</span>
            </span>
          </a>

          <a
            href={REDDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-row"
          >
            <span className="contact-icon">👽</span>
            <span className="contact-text">
              <span className="contact-label">Reddit</span>
              <span className="contact-value">u/JCLewisWritesWords</span>
            </span>
          </a>

          <a
            href={VENMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-row"
          >
            <span className="contact-icon">💸</span>
            <span className="contact-text">
              <span className="contact-label">Venmo</span>
              <span className="contact-value">{VENMO_HANDLE}</span>
            </span>
          </a>
        </div>

        <picture>
          <source srcSet="/images/contact-art-2.webp" type="image/webp" />
          <img
            src="/images/contact-art-2.jpg"
            alt=""
            className="contact-art contact-art-2"
          />
        </picture>
      </div>
    </>
  );
}
