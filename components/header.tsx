import Image from "next/image";

const navLinks = [
  { href: "#home", text: "Try Now" },
  { href: "#how-it-works", text: "How It Works" },
  { href: "#features", text: "Features" },
];

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="AI Image Analyzer Logo"
              width={24}
              height={24}
              className="mr-2"
            />
            <h1 className="text-base text-indigo-600">Snapalyzer</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm font-bold text-gray-600 transition duration-150 ease-in-out hover:text-indigo-600"
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
