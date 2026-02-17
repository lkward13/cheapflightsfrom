import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">CheapFlightsFrom.us</h3>
            <p className="text-sm">
              We track flight prices on thousands of routes daily and alert you when fares drop.
              Save more, search less.
            </p>
            <p className="text-sm mt-2">
              <a href="mailto:info@cheapflightsfrom.us" className="hover:text-white transition-colors">
                info@cheapflightsfrom.us
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-white font-semibold mb-3">Popular Cities</h3>
            <ul className="space-y-1 text-sm grid grid-cols-2 gap-x-4">
              <li><Link href="/cheap-flights-from-dallas" className="hover:text-white transition-colors">Dallas</Link></li>
              <li><Link href="/cheap-flights-from-oklahoma-city" className="hover:text-white transition-colors">Oklahoma City</Link></li>
              <li><Link href="/cheap-flights-from-atlanta" className="hover:text-white transition-colors">Atlanta</Link></li>
              <li><Link href="/cheap-flights-from-new-york-city" className="hover:text-white transition-colors">New York City</Link></li>
              <li><Link href="/cheap-flights-from-los-angeles" className="hover:text-white transition-colors">Los Angeles</Link></li>
              <li><Link href="/cheap-flights-from-chicago" className="hover:text-white transition-colors">Chicago</Link></li>
              <li><Link href="/cheap-flights-from-denver" className="hover:text-white transition-colors">Denver</Link></li>
              <li><Link href="/cheap-flights-from-miami" className="hover:text-white transition-colors">Miami</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} CheapFlightsFrom.us. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
