"use client";

import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/presentation/animations/variants";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-rose-950 relative overflow-hidden px-6">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
        className="relative z-10 max-w-2xl w-full text-center space-y-8"
      >
        <motion.div variants={slideUp} className="space-y-4">
          <div className="relative w-50 h-50 mx-auto">
            <Image
              src="/unbox-logo.png"
              alt="Unbox Logo"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-5xl md:text-5xl font-semibold text-gray-800 dark:text-gray-100">
            Unbox
          </h2>
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 dark:text-gray-100">
            Coming Soon
          </h2>
          <p className="text-lg md:text-xl font-light text-gray-600 dark:text-gray-400 leading-relaxed">
            เว็บ <span className="font-normal text-rose-500">unboxforyou</span> ของเราจะเปิดบริการในเร็วๆ นี้
            <br />
            เตรียมพบกับประสบการณ์ส่งของขวัญดิจิทัลรูปแบบใหม่
          </p>
        </motion.div>

        {/* Line Button */}
        <motion.div variants={slideUp} className="pt-8">
          <a
            href="https://line.me/R/ti/p/@unboxforyou" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#06C755] hover:bg-[#05b64d] text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group"
          >
            {/* Line Icon */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
              <Image 
                src="/line_logo.webp" 
                alt="Line" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <div className="text-2xl uppercase tracking-wider opacity-90">สั่งทำกับเรา</div>
              <div className="text-4xl font-bold leading-none">Unbox</div>
            </div>
          </a>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-sm font-light text-gray-400">© 2026 Unbox. All rights reserved.</p>
      </motion.div>
    </div>
  );
}