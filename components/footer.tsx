import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-white py-4 mt-16">
      <div className="max-w-6xl text-sm mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>
          &copy; 2024{" "}
          <Link
            className="hover:text-blue-600 hover:underline transition duration-150 ease-in-out"
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
