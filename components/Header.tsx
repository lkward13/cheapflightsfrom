import Link from "next/link";
import Image from "next/image";
import HeaderNav from "./HeaderNav";

export default function Header() {
  return (
    <>
      {/* Top info bar */}
      <div className="bg-brand-red text-white text-xs py-1.5 text-center">
        <a href="mailto:info@cheapflightsfrom.us" className="hover:underline">
          info@cheapflightsfrom.us
        </a>
      </div>

      <header className="bg-white text-brand-dark sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Cheap Flights From"
                width={160}
                height={40}
                className="h-8 w-auto"
                priority
              />
              <span className="hidden sm:inline font-bold text-brand-primary text-lg">
                Cheap Flights From
              </span>
            </Link>
            <HeaderNav />
          </div>
        </div>
      </header>
    </>
  );
}
