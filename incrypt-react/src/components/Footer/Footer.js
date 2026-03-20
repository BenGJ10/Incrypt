import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-bg-surface py-5">
      <div className="mx-auto w-[92%] max-w-6xl flex flex-col items-center justify-center gap-4 text-center">
        
        <p className="text-sm text-text-muted">
          © {currentYear} Incrypt. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
          <a
            href="https://facebook.com/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-text-muted hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <FaFacebookF size={16} />
          </a>

          <a
            href="https://linkedin.com/in/bengj10"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-text-muted hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <FaLinkedinIn size={16} />
          </a>

          <a
            href="https://twitter.com/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-text-muted hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <FaTwitter size={16} />
          </a>

          <a
            href="https://instagram.com/bengj10"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-text-muted hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <FaInstagram size={16} />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
