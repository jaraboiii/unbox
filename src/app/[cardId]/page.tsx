

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ValentineEnvelope } from "@/presentation/components/features/ValentineEnvelope";
import { SupabaseCardRepository } from "@/infrastructure/repositories/SupabaseCardRepository";
import { GreetingCard } from "@/core/domain/entities/GreetingCard";

export default function CardPage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const [card, setCard] = useState<GreetingCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCard = async () => {
      try {
        const repository = new SupabaseCardRepository();
        const foundCard = await repository.findById(cardId);

        if (!foundCard) {
          setError("ไม่พบการ์ดนี้");
          setLoading(false);
          return;
        }


        await repository.incrementViewCount(cardId);

        setCard(foundCard);
        setLoading(false);
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการโหลดการ์ด");
        setLoading(false);
      }
    };

    loadCard();
  }, [cardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-gray-950 dark:via-rose-950 dark:to-pink-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            💝
          </motion.div>
          <p className="text-xl font-light text-gray-600 dark:text-gray-400">
            กำลังโหลดการ์ด...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-gray-950 dark:via-rose-950 dark:to-pink-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="text-6xl mb-6">💔</div>
          <h1 className="text-3xl font-light text-gray-800 dark:text-gray-200 mb-4">
            {error || "ไม่พบการ์ด"}
          </h1>
          <p className="text-lg font-light text-gray-600 dark:text-gray-400 mb-8">
            ลิงก์นี้อาจไม่ถูกต้อง หรือการ์ดถูกลบไปแล้ว
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-light hover:shadow-lg transition-all"
          >
            กลับหน้าแรก
          </a>
        </motion.div>
      </div>
    );
  }


  if (card.templateId === "valentine-2026") {
    return (
      <ValentineEnvelope
        senderName={card.senderName}
        receiverName={card.receiverName}
        customMessage={card.customMessage}
        passcode={card.passcode}
        passcodeHint={card.passcodeHint}
        passcodeMessage={card.passcodeMessage}
        youtubeUrl={card.youtubeUrl}
        images={card.images || ["", "", ""]}
        eventImages={card.eventImages}
        imageCaptions={card.imageCaptions}
        eventDescriptions={card.eventDescriptions}
        preview={card.preview}
      />
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-gray-950 dark:via-rose-950 dark:to-pink-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-light text-gray-600 dark:text-gray-400">
          Template ไม่รองรับ
        </p>
      </div>
    </div>
  );
}
