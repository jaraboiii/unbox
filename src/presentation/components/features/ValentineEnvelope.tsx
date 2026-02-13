"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";

interface ValentineEnvelopeProps {
  senderName: string;
  receiverName: string;
  customMessage?: string;
  passcode?: string;
  passcodeHint?: string;
  passcodeMessage?: string;
  images: string[];
  eventImages?: string[];
  imageCaptions?: string[];
  eventDescriptions?: string[];
  youtubeUrl?: string;
  preview?: boolean;
  onComplete?: () => void;
}

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface MessageOverlayProps {
  message: string;
  subMessage: string;
  onClick: () => void;
}

const MessageOverlay = ({ message, subMessage, onClick }: MessageOverlayProps) => (
  <motion.div
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-2xl w-full text-center"
    >
      <p className="text-3xl md:text-4xl font-light text-white drop-shadow-xl leading-relaxed font-handwriting tracking-wide">
        " {message} "
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="mt-8"
      >
        <p className="text-sm text-white/80 font-light animate-pulse cursor-pointer border-b border-white/30 inline-block pb-1">
          {subMessage}
        </p>
      </motion.div>
    </motion.div>
  </motion.div>
);

export function ValentineEnvelope({ senderName, receiverName, customMessage, passcode, passcodeHint, passcodeMessage, youtubeUrl, images, eventImages, imageCaptions, eventDescriptions, preview, onComplete }: ValentineEnvelopeProps) {
  const [step, setStep] = useState<'sealed' | 'opening' | 'enteringPasscode' | 'showingPasscodeMessage' | 'viewingPhotos' | 'closingEnvelope' | 'preMessage' | 'viewingEventCards' | 'showingMessage' | 'showingMusicMessage' | 'playingMusic' | 'revealed'>('sealed');
  const [selectedEventCard, setSelectedEventCard] = useState<number | null>(null);
  const [finalCardIndex, setFinalCardIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoDirection, setPhotoDirection] = useState(0);
  const [inputPasscode, setInputPasscode] = useState("");
  const [isPasscodeError, setIsPasscodeError] = useState(false);
  const [isPasscodeSuccess, setIsPasscodeSuccess] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (step === 'viewingEventCards') {
      const timer = setTimeout(() => setShowScrollHint(true), 3000);
      return () => clearTimeout(timer);
    } else {
        setShowScrollHint(false);
    }
  }, [step]);

  const validImages = images.filter(Boolean);
  const validEventImages = eventImages?.filter(Boolean) || validImages;

  const handleEnvelopeClick = () => {
    if (step === 'sealed') {
      setStep('opening');
      setTimeout(() => {
        if (passcode && passcode.length > 0) {
          console.log('Redirecting to passcode entry');
          setStep('enteringPasscode');
        } else {
          console.log('No passcode, viewing photos');
          setStep('viewingPhotos');
        }
      }, 1200);
    }
  };

  const handlePasscodeSubmit = (code: string) => {
    if (code === passcode) {
      setIsPasscodeSuccess(true);
      setTimeout(() => {
        if (passcodeMessage) {
          setStep('showingPasscodeMessage');
        } else {
          setStep('viewingPhotos');
        }
      }, 1500);
    } else {
      setIsPasscodeError(true);
      setTimeout(() => setIsPasscodeError(false), 500);
    }
  };

  const handlePasscodeMessageClick = () => {
    setStep('viewingPhotos');
  };

  const handleNextPhoto = () => {
    if (currentPhotoIndex < validImages.length - 1) {
      setPhotoDirection(currentPhotoIndex % 2 !== 0 ? -1 : 1);
      setCurrentPhotoIndex(prev => prev + 1);
    } else {
      setPhotoDirection(currentPhotoIndex % 2 !== 0 ? -1 : 1);
      setStep('closingEnvelope');
      setTimeout(() => {
        setStep('preMessage');
      }, 1500);
    }
  };

  const handlePreMessageClick = () => {
     setStep('viewingEventCards');
  };

  const handleEventCardClick = (index: number) => {
    setSelectedEventCard(index);
  };

  const handleEventCardClose = () => {
    setSelectedEventCard(null);
  };

  const handleFinishEvents = () => {
    if (youtubeUrl) {
      setStep('showingMusicMessage');
    } else {
      setStep('showingMessage');
    }
  };

  const handleMessageClick = () => {
    setStep('revealed');
    onComplete?.();
  };

  const handleMusicMessageClick = () => {
    setStep('playingMusic');
  };

  const handleMusicComplete = () => {
    setStep('showingMessage');
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'valentine-card-qr.png';
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFDEE3] via-[#FFBBC1] to-[#FF8896] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
              scale: Math.random() * 0.4 + 0.3,
              opacity: 0
            }}
            animate={{
              y: -100,
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute text-[#FF6F77] text-xl"
          >
            ❤
          </motion.div>
        ))}
      </div>

      {preview && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-around opacity-10 select-none overflow-hidden py-10">
             {[...Array(3)].map((_, i) => (
               <Image
                  key={i}
                  src="/unbox-logo.png" 
                  alt="Preview Watermark" 
                  width={400} 
                  height={400} 
                  className="object-contain opacity-80 drop-shadow-lg rounded-full"
                  style={{ transform: i % 2 === 0 ? 'rotate(-15deg)' : 'rotate(15deg)' }}
               />
             ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center w-full px-4">
        {step === 'sealed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <motion.p
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl md:text-2xl font-light text-[#C00000] drop-shadow-lg"
            >
              คลิกที่ซองเพื่อเปิด
            </motion.p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {(step === 'sealed' || step === 'opening' || step === 'enteringPasscode' || step === 'viewingPhotos' || step === 'closingEnvelope') && (
            <motion.div
              key="envelope"
              className="relative"
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: step === 'closingEnvelope' ? 0 : 1,
                scale: step === 'closingEnvelope' ? 0.7 : 1,
                y: step === 'closingEnvelope' ? 50 : 0
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.2 }}
              onClick={step === 'sealed' ? handleEnvelopeClick : undefined}
              style={{ 
                cursor: step === 'sealed' ? 'pointer' : 'default',
              }}
            >

              <motion.div
                className="relative w-80 h-[250px] md:w-96 md:h-[300px]"
                animate={{ opacity: step === 'viewingPhotos' ? 0.4 : 1 }}
                transition={{ duration: 0.5 }}
                whileHover={step === 'sealed' ? { scale: 1.05 } : {}}
                whileTap={step === 'sealed' ? { scale: 0.95 } : {}}
              >

                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3334] to-[#FF6F77] rounded-2xl shadow-2xl border-4 border-white" />
                
                <motion.div
                  className="absolute top-[0.5%] left-[2%] right-[2%] h-40 md:h-48 bg-gradient-to-br from-[#FF6F77] to-[#C00000] origin-top border-t-4 border-white"
                  style={{
                    clipPath: 'polygon(0 0, 50% 70%, 100% 0)',
                  }}
                  animate={
                    step === 'opening' || step === 'viewingPhotos' || step === 'closingEnvelope'
                      ? { rotateX: -180 }
                      : { rotateX: 0 }
                  }
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />

                <motion.div
                  className="absolute top-[38%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl md:text-7xl drop-shadow-xl z-20"
                  animate={
                    step === 'sealed'
                      ? { scale: 1, opacity: 1 }
                      : step === 'opening'
                        ? { scale: [1, 1.3, 0], rotate: [0, 15, -15, 0], opacity: [1, 1, 0] }
                        : { scale: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.6 }}
                >
                  💝
                </motion.div>

                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step === 'sealed' ? 1 : 0 }}
                    className="relative w-full h-full"
                  >

                    <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <p className="text-2xl md:text-3xl font-light drop-shadow-lg text-white text-center">
                        {receiverName}
                      </p>
                    </div>


                    <div className="absolute bottom-6 right-6 text-right">
                      <p className="text-sm md:text-base font-light drop-shadow-lg opacity-90 text-white">
                        จาก
                      </p>
                      <p className="text-xl md:text-2xl font-light drop-shadow-lg text-white">
                        {senderName}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <AnimatePresence>
                {step === 'enteringPasscode' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ 
                       opacity: 1, 
                       scale: 1, 
                       y: 0 
                    }}
                    exit={{ opacity: 0, scale: 0.9, y: -50 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-full max-w-sm z-40 bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50"
                  >
                    <motion.div
                       animate={isPasscodeSuccess ? { scale: [1, 1.2, 1] } : {}}
                    >
                       <p className={`text-center font-light text-xl mb-6 transition-colors duration-300
                           ${isPasscodeSuccess ? 'text-green-600' : 'text-[#FF6F77]'}
                       `}>
                         {passcodeHint || "จำรหัสนี้ได้ไหม? 🔒"}
                       </p>
                    </motion.div>
                    
                    <div className="flex justify-center gap-2 mb-8">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={isPasscodeError ? { x: [-5, 5, -5, 5, 0] } : (isPasscodeSuccess ? { scale: [1, 1.1, 1], borderColor: '#16a34a', color: '#16a34a' } : {})}
                          transition={{ duration: 0.4, delay: isPasscodeSuccess ? i * 0.05 : 0 }}
                          className={`w-8 h-10 border-b-2 flex items-center justify-center text-xl font-medium transition-colors duration-300
                            ${i < inputPasscode.length ? 'border-[#FF3334] text-[#C00000]' : 'border-gray-300 text-gray-300'}
                            ${i === inputPasscode.length && !isPasscodeSuccess ? 'border-[#FF8896] bg-[#FFDEE3]/30' : ''}
                          `}
                        >
                          {i < inputPasscode.length ? inputPasscode[i] : ''}
                        </motion.div>
                      ))}
                    </div>

                     {isPasscodeSuccess ? (
                        <motion.div 
                          className="flex flex-col justify-center items-center h-48 relative"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="relative">
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
                              className="absolute inset-0 bg-green-100 rounded-full z-0"
                            ></motion.div>

                            <motion.div
                                animate={{ 
                                  rotate: [0, -10, 10, -10, 10, 0],
                                  scale: [1, 0]
                                }}
                                transition={{ 
                                  rotate: { duration: 0.5, ease: "easeInOut" },
                                  scale: { delay: 0.8, duration: 0.2 }
                                }}
                                className="relative z-10 w-24 h-24 flex items-center justify-center"
                            >
                               <svg width="60" height="60" viewBox="0 -5 24 30" fill="none" stroke="#FF6F77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                 <motion.path 
                                   d="M7 11V7a5 5 0 0 1 10 0v4"
                                   initial={{ y: 0 }}
                                   animate={{ y: -5 }}
                                   transition={{ delay: 0.5, duration: 0.3, type: "spring" }}
                                 />
                                 <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="#FFE4E6" />
                               </svg>
                            </motion.div>

                            <motion.div
                               className="absolute top-0 left-0 w-24 h-24 flex items-center justify-center z-20"
                               initial={{ scale: 0 }}
                               animate={{ scale: 1 }}
                               transition={{ delay: 0.8, type: "spring" }}
                            >
                              <motion.svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-12 w-12 text-green-600" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <motion.path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={3} 
                                  d="M5 13l4 4L19 7" 
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ delay: 0.9, duration: 0.3 }}
                                />
                              </motion.svg>
                            </motion.div>
                          </div>
                          
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="mt-4 text-green-600 font-light text-xl"
                          >
                            ผ่านแล้ว!
                          </motion.p>
                        </motion.div>
                     ) : (
                       <div className="grid grid-cols-3 gap-4">
                         {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '⌫'].map((num) => (
                           <button
                             key={num}
                             onClick={() => {
                               if (isPasscodeSuccess) return; 
                               if (typeof num === 'number') {
                                 if (inputPasscode.length < 8) {
                                   const next = inputPasscode + num;
                                   setInputPasscode(next);
                                   if (next.length === 8) handlePasscodeSubmit(next);
                                 }
                               } else if (num === '⌫') {
                                 setInputPasscode(prev => prev.slice(0, -1));
                               } else if (num === 'C') {
                                 setInputPasscode("");
                               }
                             }}
                             className={`h-12 rounded-xl flex items-center justify-center text-lg font-light transition-all
                               ${typeof num === 'number' 
                                 ? 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-100 hover:scale-105 active:scale-95' 
                                 : 'bg-[#FFDEE3] text-[#FF6F77] hover:bg-[#FFBBC1]'}
                             `}
                           >
                             {num}
                           </button>
                         ))}
                       </div>
                     )}
                   </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {step === 'viewingPhotos' && validImages.length > 0 && (
                  <motion.div
                    key={currentPhotoIndex}
                    initial={{ y: 100, scale: 0.8, opacity: 0 }}
                    animate={{ y: -120, scale: 1, opacity: 1 }}
                    exit={{ 
                      y: -250, 
                      x: photoDirection * 200,
                      scale: 0.8,
                      opacity: 0,
                      rotate: photoDirection * 15
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 md:w-80 md:h-80 z-30 cursor-grab active:cursor-grabbing"
                    onClick={handleNextPhoto}
                    drag="y"
                    dragConstraints={{ top: -100, bottom: 100 }}
                    dragElastic={0.3}
                    dragMomentum={true}
                    whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onDragEnd={(_, info) => {
                      // More sensitive: swipe up 30px to advance
                      if (info.offset.y < -30) {
                        handleNextPhoto();
                      }
                    }}
                  >
                    <div className="relative w-full h-full bg-white p-3 rounded-3xl shadow-2xl border-4 border-[#FF6F77]">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        {validImages[currentPhotoIndex] ? (
                          <Image
                            src={validImages[currentPhotoIndex]}
                            alt={`Photo ${currentPhotoIndex + 1}`}
                            fill
                            className="object-contain"
                          />
                        ) : null}
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center w-full"
                    >
                      <p className="text-white font-light drop-shadow-lg mb-1">
                        {currentPhotoIndex + 1} / {validImages.length}
                      </p>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3, duration: 1 }}
                        className="text-white/80 text-sm font-light drop-shadow-lg"
                      >
                        {currentPhotoIndex < validImages.length - 1 
                          ? "Swipe up หรือแตะเพื่อดูรูปถัดไป" 
                          : "Swipe up หรือแตะเพื่อดูข้อความ"}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step === 'showingPasscodeMessage' && passcodeMessage && (
            <MessageOverlay
              key="passcode-message"
              message={passcodeMessage}
              subMessage="แตะเพื่อดูรูปภาพ"
              onClick={handlePasscodeMessageClick}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step === 'preMessage' && (
            <MessageOverlay
              key="pre-message"
              message="ยังจำวันนั้นได้ไหม..."
              subMessage="แตะเพื่อภาพเหตุการณ์"
              onClick={handlePreMessageClick}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step === 'viewingEventCards' && (
            <motion.div
              key="event-cards-container"
              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
                <div className="min-h-full flex flex-col items-center justify-start py-10">
                  <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-16 relative pb-40">
                    {validEventImages.map((img, index) => (
                      <motion.div
                        key={`card-${index}`}
                        initial={{ y: 1000, rotate: (index * 7 % 20) - 10 }}
                        animate={{ 
                            y: 0, 
                            rotate: [(index % 2 === 0 ? -2 : 2) + (((index * 3) % 5) - 2), 0, (index % 2 === 0 ? -2 : 2) + (((index * 3) % 5) - 2)]
                        }}
                        transition={{ 
                            type: "spring", stiffness: 80, damping: 15, delay: index * 0.15,
                            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" } 
                        }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
                        onClick={() => handleEventCardClick(index)}
                        className="relative w-72 h-auto min-h-[420px] bg-[#Fdfbf7] p-5 pb-8 shadow-2xl cursor-pointer transform transition-transform duration-300 group shrink-0 flex flex-col"
                        style={{
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-12 z-20">
                            <div className="w-full h-full border-4 border-gray-400 rounded-full bg-transparent shadow-sm" style={{ clipPath: 'inset(40% 0 0 0)' }}></div>
                            <div className="absolute top-1 left-1 w-6 h-10 border-4 border-gray-300 rounded-full bg-transparent"></div>
                          </div>

                          <div className="w-full h-56 bg-gray-100 mb-4 overflow-hidden relative shadow-inner border border-gray-200 shrink-0">
                            <Image src={img} alt="Memory" fill className="object-contain transition-transform duration-500 group-hover:scale-110" />
                          </div>

                          <div className="flex-grow flex flex-col items-center text-center">
                              <p className="font-handwriting text-gray-800 text-xl font-bold truncate w-full px-2 mb-2">
                                {imageCaptions?.[index] || `ความทรงจำที่ ${index + 1}`}
                              </p>
                              {eventDescriptions?.[index] && (
                                  <p className="font-light text-gray-500 text-sm leading-relaxed line-clamp-3 italic px-1">
                                      "{eventDescriptions[index]}"
                                  </p>
                              )}
                          </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

               <AnimatePresence>
                 {showScrollHint && (
                   <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.5 }}
                     className="absolute bottom-28 md:bottom-24 left-0 w-full text-white/80 text-sm font-light flex flex-col items-center pointer-events-none z-[95]"
                   >
                     <span className="drop-shadow-md">เลื่อนเพื่อดูเพิ่มเติม</span>
                     <svg className="w-5 h-5 mt-1 animate-bounce drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                     </svg>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="absolute bottom-0 left-0 w-full p-8 pb-10 md:pb-12 flex justify-center z-[100] bg-gradient-to-t from-black/40 to-transparent pointer-events-none">
                 <button
                   onClick={handleFinishEvents}
                   className="pointer-events-auto text-white/80 hover:text-white font-light text-sm border-b border-transparent hover:border-white transition-all pb-1 inline-flex items-center gap-2 drop-shadow-lg"
                 >
                   ไปต่อ 🡆
                 </button>
               </div>

               <AnimatePresence>
                 {selectedEventCard !== null && (
                   <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg"
                     onClick={handleEventCardClose}
                   >
                     <motion.div
                       initial={{ scale: 0.8, rotate: -5 }}
                       animate={{ scale: 1, rotate: 0 }}
                       exit={{ scale: 0.8, rotate: 5 }}
                       onClick={(e) => e.stopPropagation()}
                       className="bg-[#Fdfbf7] p-6 pb-16 max-w-md w-full shadow-2xl relative rotate-1"
                     >
                       <button onClick={handleEventCardClose} className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg text-gray-500 hover:text-red-500 flex items-center justify-center text-2xl">×</button>
                       

                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/30 rotate-1 backdrop-blur-sm border border-white/20 shadow-sm transform -translate-y-1/2"></div>

                       <div className="w-full aspect-square bg-gray-100 mb-6 overflow-hidden relative shadow-inner border border-gray-200">
                         <Image src={validEventImages[selectedEventCard]} alt="Memory Detail" fill className="object-contain" />
                       </div>

                       <div className="text-center">
                         <h3 className="font-handwriting text-2xl md:text-3xl text-gray-800 leading-relaxed font-bold">
                           {imageCaptions?.[selectedEventCard] || `ความทรงจำที่ ${selectedEventCard + 1}`}
                         </h3>
                         <p className="mt-4 text-gray-600 font-light text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                           {eventDescriptions?.[selectedEventCard] || "ไม่มีคำบรรยาย..."}
                         </p>
                       </div>
                     </motion.div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step === 'showingMessage' && customMessage && (
            <motion.div
              key="message-container"
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/10"
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleMessageClick}
            >

              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0],
                    }}
                    transition={{
                      duration: 2 + ((i * 3) % 100) / 100,
                      delay: ((i * 7) % 100) / 100,
                      repeat: Infinity,
                      repeatDelay: ((i * 11) % 100) / 100
                    }}
                    className="absolute text-yellow-400 text-2xl"
                    style={{
                      left: `${10 + ((i * 13) % 80)}%`,
                      top: `${10 + ((i * 17) % 80)}%`,
                    }}
                  >✨</motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 max-w-3xl w-full text-center"
              >
                 <p className="text-3xl md:text-5xl lg:text-6xl font-light text-[#C00000] drop-shadow-sm leading-relaxed whitespace-pre-wrap font-handwriting">
                   " {customMessage} "
                 </p>
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 5, duration: 1 }}
                   className="mt-8 text-sm text-white/80 font-light animate-pulse"
                 >
                   (แตะเพื่อไปต่อ)
                 </motion.p>
              </motion.div>
            </motion.div>
          )}

          {step === 'showingMessage' && !customMessage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              onAnimationComplete={() => {
                setStep('revealed');
                onComplete?.();
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step === 'showingMusicMessage' && (
            <MessageOverlay
              key="music-message"
              message="มีเพลงอยากให้ฟังด้วยนะ..."
              subMessage="แตะเพื่อฟังเพลง"
              onClick={handleMusicMessageClick}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step === 'playingMusic' && youtubeUrl && (
            <motion.div
              key="music-player"
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="w-full max-w-sm">
                <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-800 relative overflow-hidden">
                  
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-green-500/10 blur-3xl pointer-events-none"></div>

                  <div className="flex justify-between items-center mb-6 text-gray-400">
                     <span className="text-xs tracking-widest uppercase">Now Playing</span>
                     <div className="flex space-x-1">
                       <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                       <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                       <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                     </div>
                  </div>

                  <div className="relative aspect-square w-full bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 mb-8 group">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getYoutubeId(youtubeUrl)}?autoplay=0&controls=1&showinfo=0&modestbranding=1&rel=0`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full object-cover"
                    ></iframe>
                  </div>

                  <div className="mb-8">
                     <h3 className="text-white text-2xl font-bold mb-1 truncate">เพลงพิเศษสำหรับ {receiverName}</h3>
                     <p className="text-gray-400 font-light text-sm">{senderName} มอบเพลงนี้ให้คุณ</p>
                  </div>

                  <div className="mb-8">
                    <div className="relative w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="absolute left-0 top-0 h-full bg-green-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 180, ease: "linear" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                      <span>0:00</span>
                      <span>3:45</span>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-8 mb-4">
                     <button className="text-gray-400 hover:text-white transition-colors" onClick={handleMusicComplete}>
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" transform="rotate(180)"><path d="M19 12l-7-7-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l7-7z"/></svg>  
                     </button>
                     
                     <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] animate-pulse">
                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                     </div>

                     <button className="text-gray-400 hover:text-white transition-colors" onClick={handleMusicComplete}>
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M5 12l7 7 1.41-1.41L7.83 13H20v-2H7.83l5.58-5.59L12 4l-7 7z" transform="rotate(180 12 12)"/></svg>
                     </button>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button 
                    onClick={handleMusicComplete}
                    className="text-white/80 hover:text-white font-light text-sm border-b border-transparent hover:border-white transition-all pb-1 inline-flex items-center gap-2"
                  >
                    ไปต่อ 🡆
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {step === 'revealed' && (
            <motion.div
              className="fixed inset-0 z-[50] flex items-center justify-center p-4 overflow-y-auto custom-scrollbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative w-full max-w-sm mt-auto mb-auto">
                
                {/* Background Card (Card 2 - Memories) */}
                <motion.div
                  className="absolute inset-x-4 top-0 bottom-0 bg-white rounded-[2rem] shadow-xl border-2 border-[#FFBBC1] origin-bottom cursor-pointer"
                  animate={finalCardIndex === 1 ? 
                    { top: 0, scale: 1, rotate: 0, zIndex: 30 } : 
                    { top: '2rem', scale: 0.92, rotate: 3, zIndex: 5 } // ซ้อนอยู่หลัง
                  }
                  transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
                  onClick={() => setFinalCardIndex(finalCardIndex === 1 ? 0 : 1)}
                  style={{ height: '100%' }}
                >
                   {/* Card 2 Content (Memories) */}
                   <div className={`w-full h-full flex flex-col p-6 rounded-[2rem] bg-[#fff0f3] overflow-hidden ${finalCardIndex === 1 ? 'opacity-100' : 'opacity-60 transition-opacity duration-300'}`}>
                      {/* Tape effect at top */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#FFBBC1]/50 rotate-1"></div>

                      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
                      
                      <div className="text-center mt-4 mb-4 shrink-0 relative z-10">
                         <div className="inline-block px-4 py-1.5 bg-white/80 rounded-full border border-[#FF6F77]/30 shadow-sm mb-2">
                            <h3 className="text-xl font-handwriting text-[#C00000]">ความทรงจำของเรา ❤️</h3>
                         </div>
                      </div>

                      <div className="flex-grow flex items-center relative z-10 min-h-[300px]">
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-1 no-scrollbar w-full h-full items-center" onClick={(e) => e.stopPropagation()}>
                          {validEventImages.map((img, idx) => (
                              <motion.div 
                                key={idx} 
                                className="snap-center shrink-0 w-[260px] h-[340px] bg-white p-3 shadow-md rounded-xl border border-gray-100 flex flex-col transform cursor-pointer hover:scale-[1.02] transition-transform"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEventCard(idx);
                                }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-gray-50 shadow-inner">
                                    <Image 
                                      src={img} 
                                      alt={`Event ${idx+1}`} 
                                      fill 
                                      className="object-contain" 
                                      sizes="(max-width: 768px) 100vw, 33vw"
                                      quality={90}
                                    />
                                </div>
                                <h4 className="font-bold text-gray-700 text-lg truncate mb-1 text-center">{imageCaptions?.[idx]}</h4>
                                <div className="flex-grow overflow-y-auto custom-scrollbar bg-gray-50/50 rounded p-2 border border-gray-100/50">
                                    <p className="text-sm text-gray-500 font-light italic leading-relaxed text-center">
                                      "{eventDescriptions?.[idx]}"
                                    </p>
                                </div>
                              </motion.div>
                          ))}
                        </div>
                      </div>
                   </div>
                </motion.div>

                <motion.div
                  className="relative bg-[#FFF9F0] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col items-center border-[6px] border-white ring-1 ring-gray-200/50 origin-bottom cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff0000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                  animate={finalCardIndex === 0 ? 
                    { y: 0, scale: 1, opacity: 1, rotate: 0, zIndex: 20 } : 
                    { y: 20, scale: 0.92, opacity: 0.8, rotate: -3, zIndex: 0 }
                  }
                  transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
                  onClick={() => setFinalCardIndex(finalCardIndex === 0 ? 1 : 0)}
                >
                  <div className="absolute inset-3 border-2 border-dashed border-[#FFB5B5] rounded-[1.5rem] pointer-events-none"></div>

                  <div className="w-full h-full flex flex-col items-center p-6 relative z-10">
                    
                    <div className="text-center mb-1 shrink-0 mt-1">
                      <h2 className="text-3xl font-semibold text-[#FF6F77] font-handwriting leading-tight">
                        Happy Valentine's
                      </h2>
                      <h2 className="text-3xl font-semibold text-[#C00000] font-handwriting leading-tight">
                        Day 2026
                      </h2>
                    </div>

                    <div className="w-full space-y-3 mb-2 shrink-0 text-center">
                       <div>
                          <span className="text-xs text-[#FF8896] uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-[#FFDEE3]">To</span>
                          <p className="text-2xl text-[#FF3334] font-light mt-1">{receiverName}</p>
                       </div>
                    </div>

                    <div className="w-16 h-0.5 bg-[#FFBBC1]/50 mb-4 shrink-0"></div>

                    <div className="flex justify-center gap-2 mb-3 shrink-0 transform -rotate-1 w-full px-2">
                      {validImages.slice(0, 3).map((img, i) => (
                        <div key={i} className={`flex-1 aspect-square max-w-[110px] bg-white p-1 shadow-md rounded-xl transform ${i % 2 === 0 ? 'rotate-2' : '-rotate-2'} transition-transform duration-300 z-10`}>
                          <div className="w-full h-full relative overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                            <Image src={img} alt="" fill className="object-contain" />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-full flex items-center justify-center relative my-6 shrink-0">
                       {customMessage && (
                          <div className="relative bg-white/80 p-4 w-full rounded-xl shadow-inner border border-[#FFE4E6]">
                             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-[#FFBBC1]/50 -rotate-1"></div>
                             <p className="text-base text-[#8B0000] font-light font-handwriting text-center leading-relaxed line-clamp-[7]">
                                "{customMessage}"
                             </p>
                          </div>
                       )}
                    </div>

                     <div className="shrink-0 text-center w-full">
                        <span className="text-[10px] text-[#FF8896] uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-[#FFDEE3]">From</span>
                        <p className="text-2xl text-transparent bg-gradient-to-r from-[#C00000] to-[#FF3334] bg-clip-text mt-0.5 font-medium">
                          {senderName}
                        </p>
                     </div>
                  </div>
                </motion.div>
              </div>

              <AnimatePresence>
                  {selectedEventCard !== null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg"
                      onClick={handleEventCardClose}
                    >
                      <motion.div
                        initial={{ scale: 0.8, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0.8, rotate: 5 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#Fdfbf7] p-6 pb-16 max-w-md w-full shadow-2xl relative rotate-1 rounded-sm"
                      >
                        <button 
                            onClick={handleEventCardClose} 
                            className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg text-gray-500 hover:text-red-500 flex items-center justify-center text-2xl transition-colors"
                        >
                            ×
                        </button>
                        
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/30 rotate-1 backdrop-blur-sm border border-white/20 shadow-sm transform -translate-y-1/2"></div>

                        <div className="w-full aspect-square bg-gray-100 mb-6 overflow-hidden relative shadow-inner border border-gray-200">
                          <Image 
                            src={validEventImages[selectedEventCard]} 
                            alt="Memory Detail" 
                            fill 
                            className="object-contain" 
                            quality={100}
                          />
                        </div>

                        <div className="text-center">
                          <h3 className="font-handwriting text-2xl md:text-3xl text-gray-800 leading-relaxed font-bold">
                            {imageCaptions?.[selectedEventCard] || `ความทรงจำที่ ${selectedEventCard + 1}`}
                          </h3>
                          <p className="mt-4 text-gray-600 font-light text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                            {eventDescriptions?.[selectedEventCard] || "ไม่มีคำบรรยาย..."}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
              </AnimatePresence>

              {/* QR Code Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setShowQRCode(true)}
                className="fixed bottom-8 right-8 z-[60] w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-[#FF6F77] hover:bg-[#FFF0F3] transition-colors border-2 border-[#FFBBC1]"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </motion.button>

              {/* QR Code Modal */}
              <AnimatePresence>
                {showQRCode && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg"
                    onClick={() => setShowQRCode(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.8, rotate: -5 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0.8, rotate: 5 }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl relative"
                    >
                      <button 
                        onClick={() => setShowQRCode(false)}
                        className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg text-gray-500 hover:text-red-500 flex items-center justify-center text-2xl transition-colors border-2 border-gray-100"
                      >
                        ×
                      </button>

                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-handwriting text-[#C00000] mb-2">แชร์การ์ด</h3>
                        <p className="text-sm text-gray-500 font-light">สแกน QR Code เพื่อเปิดการ์ด</p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border-4 border-[#FFBBC1] mb-6 flex justify-center">
                        <QRCodeCanvas
                          id="qr-code-canvas"
                          value={typeof window !== 'undefined' ? window.location.href : ''}
                          size={256}
                          level="H"
                          includeMargin={true}
                        />
                      </div>

                      <button
                        onClick={handleDownloadQR}
                        className="w-full py-3 bg-gradient-to-r from-[#FF6F77] to-[#FF3334] text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        บันทึก QR Code
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
