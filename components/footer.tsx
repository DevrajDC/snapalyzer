import Link from "next/link";

function Footer() {
  return (
    <footer className="mt-16 bg-white py-4">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm sm:px-6 lg:px-8">
        <p className="text-sm">
          &copy; 2024{" "}
          <Link
            className="transition duration-150 ease-in-out hover:text-blue-600 hover:underline"
            href={"https://devrajchatribin.com"}
          >
            Devraj Chatribin
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
