import Image from "next/image";

const navLinks = [
  { href: "#", text: "Home" },
  { href: "#how-it-works", text: "How It Works" },
  { href: "#features", text: "Features" },
];

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/image-logo.jpg"
              alt="AI Image Analyzer Logo"
              width={32}
              height={32}
              className="mr-1"
            />
            <h1 className="text-lg font-bold text-blue-600">Snapalyze</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 text-sm font-medium transition duration-150 ease-in-out"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
export default Header;
