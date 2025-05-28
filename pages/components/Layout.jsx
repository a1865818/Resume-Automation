// components/Layout.js
import Head from "next/head";
import Script from "next/script";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>ResumeRender</title>
        <meta
          name="description"
          content="Find the perfect candidate for your job opening"
        />
        <link rel="icon" href="/favicon.ico" />
        {/* PDF.js CDN for PDF parsing */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
        {/* html2pdf.js for client-side PDF generation from HTML */}
        {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script> */}
        {/* jsPDF for client-side PDF generation (fallback) */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      </Head>

      <Navbar />
      
      {/* Add the HTML2PDF library */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        strategy="beforeInteractive"
      />
      
      {/* Main content area - grows to fill available space */}
      <main className="flex-grow">{children}</main>

      {/* Footer - always sticks to bottom */}
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Candidate Finder. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;