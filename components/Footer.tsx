import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Restez branché
          </h2>
          <div className="mb-8 flex space-x-8">
            <Link
              href="https://facebook.com"
              className="transition-colors duration-300 hover:text-white"
            >
              <Facebook size={32} aria-hidden="true" />
              <span className="sr-only">Suivez-nous sur Facebook</span>
            </Link>
            <Link
              href="https://instagram.com"
              className="transition-colors duration-300 hover:text-white"
            >
              <Instagram size={32} aria-hidden="true" />
              <span className="sr-only">Suivez-nous sur Instagram</span>
            </Link>
            <Link
              href="https://twitter.com"
              className="transition-colors duration-300 hover:text-white"
            >
              <Twitter size={32} aria-hidden="true" />
              <span className="sr-only">Suivez-nous sur Twitter</span>
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} CutzByMayy. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
