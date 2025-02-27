import React from "react";

export default function Footer() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 p-2.5 text-center z-10"
      style={{ backgroundColor: "#a6f1e0" }}
    >
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        <p className="mr-5">
          &copy; AY2024/25 DSA3101 Data Science in Practice Group 6
        </p>
        <a
          href="https://github.com/zzhenjie01/dsa3101-ay2425s2-team6"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline text-blue-600 hover:text-blue-800 hover:underline"
        >
          View Project on GitHub
        </a>
      </div>
    </footer>
  );
}
