"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingSpinner() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing animation after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen"></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl scale-150 animate-pulse" />

        {/* Main spinner container */}
        <div className="relative flex items-center justify-center w-16 h-16">
          {/* Rotating circle */}
          <motion.div
            className="absolute w-full h-full rounded-full border-t-2 border-r-2 border-blue-500"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Dots container */}
          <div className="flex space-x-1">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg"
                initial={{ scale: 0.5, opacity: 0.7 }}
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.2,
                  ease: [0.4, 0, 0.6, 1], // Custom easing for a more natural feel
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
        Loading...
      </p>
    </div>
  );
}

// "use client";

// import { motion } from "framer-motion";

// export function LoadingSpinner() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <div className="flex space-x-3">
//         {[0, 1, 2].map((index) => (
//           <motion.div
//             key={index}
//             className="w-3 h-3 rounded-full bg-blue-500"
//             animate={{
//               y: ["0%", "-50%", "0%"],
//             }}
//             transition={{
//               duration: 0.6,
//               repeat: Number.POSITIVE_INFINITY,
//               delay: index * 0.2,
//               ease: "easeInOut",
//             }}
//           />
//         ))}
//       </div>
//       <p className="mt-4 text-sm text-gray-500">Loading...</p>
//     </div>
//   );
// }
