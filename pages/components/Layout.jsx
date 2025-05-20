// components/Layout.js
import Head from "next/head";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Candidate Finder</title>
        <meta
          name="description"
          content="Find the perfect candidate for your job opening"
        />
        <link rel="icon" href="/favicon.ico" />
        {/* PDF.js CDN for PDF parsing */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
        {/* jsPDF for client-side PDF generation */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      </Head>

      <Navbar />

      <main>{children}</main>

      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Candidate Finder. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;