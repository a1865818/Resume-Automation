// components/Navbar.js
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-xl font-bold text-indigo-600 cursor-pointer">
                    ResumeRender
                </span>
              </Link>
            </div>
            
            <div className="hidden sm:flex sm:items-center">
              <Link href="pdf-upload">
                <span className="text-gray-700 hover:text-indigo-600 cursor-pointer px-3 py-2 text-sm font-medium">
                  PDF Tool
                </span>
              </Link>
              <Link href="/saved-resumes">
                <span className="text-gray-700 hover:text-indigo-600 cursor-pointer px-3 py-2 text-sm font-medium">
                  Saved Resumes
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center sm:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open main menu</span>
              {/* Mobile menu button - would implement menu toggle here */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;