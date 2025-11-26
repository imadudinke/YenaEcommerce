import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-10 border-t bg-background">
      <div className="mx-auto max-w-7xl px-3 md:px-6 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="text-sm font-semibold mb-3">Customer Service</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="/help/shipping">Shipping Info</a>
            </li>
            <li>
              <a href="/help/returns">Returns</a>
            </li>
            <li>
              <a href="/help/contact">Contact Us</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/careers">Careers</a>
            </li>
            <li>
              <a href="/press">Press</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="/privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="/terms">Terms of Service</a>
            </li>
            <li>
              <a href="/cookies">Cookie Policy</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
          <p className="text-sm text-muted-foreground">
            Stay updated with new drops and deals.
          </p>
          <div className="mt-3 flex gap-2">
            <a
              className="px-3 py-1 rounded-md border"
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
            <a
              className="px-3 py-1 rounded-md border"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="px-3 md:px-6 py-4 text-xs text-muted-foreground border-t">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2 flex-col sm:flex-row text-center">
          <span>
            © {new Date().getFullYear()} YenaShop. All rights reserved.
          </span>
          <span>Made with ❤️</span>
        </div>
      </div>
    </footer>
  );
};
