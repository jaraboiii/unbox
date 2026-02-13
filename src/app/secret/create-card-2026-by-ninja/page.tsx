"use client";

import { motion } from "framer-motion";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { fadeIn, slideUp } from "@/presentation/animations/variants";
import { SupabaseCardRepository } from "@/infrastructure/repositories/SupabaseCardRepository";
import { CreateCardUseCase } from "@/core/use-cases/CreateCardUseCase";
import { compressImage, formatFileSize } from "@/presentation/utils/imageCompressor";
import Image from "next/image";

import Link from "next/link";
import { ImageCropperModal } from "@/presentation/components/features/ImageCropperModal";

export default function Home() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState("valentine-2026");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [passcode, setPasscode] = useState("");
  const [passcodeHint, setPasscodeHint] = useState("");
  const [passcodeMessage, setPasscodeMessage] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [images, setImages] = useState<string[]>(["", "", ""]);
  const [eventImages, setEventImages] = useState<string[]>(["", "", ""]);
  const [imageCaptions, setImageCaptions] = useState<string[]>(["", "", ""]);
  const [eventDescriptions, setEventDescriptions] = useState<string[]>(["", "", ""]);
  const [imageLoading, setImageLoading] = useState<boolean[]>([false, false, false]);
  const [eventImageLoading, setEventImageLoading] = useState<boolean[]>([false, false, false]);
  const [isCreating, setIsCreating] = useState(false);

  // Cropper State
  const [cropper, setCropper] = useState<{
    isOpen: boolean;
    imageSrc: string | null;
    index: number;
    isEvent: boolean;
  }>({
    isOpen: false,
    imageSrc: null,
    index: 0,
    isEvent: false
  });


  const handleImageUpload = (index: number, e: ChangeEvent<HTMLInputElement>, isEventImage: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEventImage) {
        const newLoading = [...eventImageLoading];
        newLoading[index] = true;
        setEventImageLoading(newLoading);
      } else {
        const newLoading = [...imageLoading];
        newLoading[index] = true;
        setImageLoading(newLoading);
      }

      const reader = new FileReader();
      reader.onload = () => {
        setCropper({
          isOpen: true,
          imageSrc: reader.result as string,
          index,
          isEvent: isEventImage
        });
        
        // Clear loading state as we are now in cropping mode
        if (isEventImage) {
            const newLoading = [...eventImageLoading];
            newLoading[index] = false;
            setEventImageLoading(newLoading);
        } else {
            const newLoading = [...imageLoading];
            newLoading[index] = false;
            setImageLoading(newLoading);
        }

        // Reset input
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (base64: string) => {
    const { index, isEvent } = cropper;
    
    if (isEvent) {
       const newImages = [...eventImages];
       newImages[index] = base64;
       setEventImages(newImages);
    } else {
       const newImages = [...images];
       newImages[index] = base64;
       setImages(newImages);
    }
    
    setCropper(prev => ({ ...prev, isOpen: false }));
  };

  const handleCreate = async () => {
    if (!senderName || !receiverName) return;


    if (passcode.length > 0 && !passcodeHint) {
        alert("กรุณากรอกคำใบ้สำหรับรหัสลับ");
        return;
    }

    setIsCreating(true);

    try {
      // Use Supabase Repository
      const repository = new SupabaseCardRepository();
      const createCardUseCase = new CreateCardUseCase(repository);

      const card = await createCardUseCase.execute({
        senderName: senderName.trim(),
        receiverName: receiverName.trim(),
        templateId: selectedTemplate,
        isPublic: true,
        customMessage: customMessage.trim() || undefined,
        passcode: passcode.trim() || undefined,
        passcodeHint: passcodeHint.trim() || undefined,
        passcodeMessage: passcodeMessage.trim() || undefined,
        youtubeUrl: youtubeUrl.trim() || undefined,
        images: images,  
        eventImages: eventImages,
        imageCaptions: imageCaptions, 
        eventDescriptions: eventDescriptions,
      });


      router.push(`/${card.id}`);
    } catch (error) {
      console.error("Error creating card:", error);
      alert("เกิดข้อผิดพลาดในการสร้างการ์ด (อาจเกิดจากการอัพโหลดรูปภาพ หรือการเชื่อมต่อ): " + error);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-rose-950">

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.h1 
              className="text-2xl font-light tracking-wide text-gray-900 dark:text-white"
              whileHover={{ scale: 1.02 }}
            >
              Unbox
            </motion.h1>
            <nav className="hidden md:flex gap-8 text-sm font-light text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-rose-500 transition-colors">Templates</a>
              <a href="#" className="hover:text-rose-500 transition-colors">Gallery</a>
              <a href="#" className="hover:text-rose-500 transition-colors">About</a>
            </nav>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="text-center mb-20"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-full text-sm font-light text-rose-600 dark:text-rose-400">
                Interactive Greeting Cards
              </span>
            </motion.div>
            
            <motion.h2 
              variants={slideUp}
              className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-gray-900 dark:text-white mb-6"
            >
              สร้างประสบการณ์
              <br />
              <span className="font-light bg-gradient-to-r from-rose-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Unboxing
              </span>{" "}
              ที่น่าจดจำ
            </motion.h2>
            
            <motion.p 
              variants={slideUp}
              className="text-lg md:text-xl font-light text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              แพลตฟอร์มสร้างการ์ดอวยพรดิจิทัลแบบอินเทอร์แอคทีฟ
              <br />
              ส่งความรู้สึกพิเศษให้คนที่คุณรัก
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden"
          >

            <div className="p-8 md:p-12 border-b border-gray-200/50 dark:border-gray-800/50">
              <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-8">
                เลือก Template
              </h3>
              
              <motion.div
                onClick={() => setSelectedTemplate("valentine-2026")}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
                  selectedTemplate === "valentine-2026"
                    ? "ring-2 ring-rose-500 shadow-xl"
                    : "hover:shadow-lg"
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 p-8 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/20 rounded-full blur-2xl" />
                  
                  <div className="relative text-center">
                    <div className="text-6xl mb-4">💝</div>
                    <h4 className="text-2xl md:text-3xl font-light text-white mb-2">
                      Valentine's Day 2026
                    </h4>
                    <p className="text-white/80 font-light">
                      การ์ดวาเลนไทน์สุดพิเศษ
                    </p>
                  </div>
                </div>
                
                {selectedTemplate === "valentine-2026" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            </div>

            <div className="p-8 md:p-12 space-y-8">
              <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-8">
                ข้อมูลการ์ด
              </h3>


              <div className="space-y-3">
                <label htmlFor="sender" className="block text-sm font-light text-gray-700 dark:text-gray-300">
                  ชื่อผู้มอบ
                </label>
                <input
                  id="sender"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="ชื่อของคุณ"
                  disabled={isCreating}
                  className="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-light disabled:opacity-50"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="receiver" className="block text-sm font-light text-gray-700 dark:text-gray-300">
                  ชื่อผู้รับ
                </label>
                <input
                  id="receiver"
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="ชื่อคนพิเศษของคุณ"
                  disabled={isCreating}
                  className="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-light disabled:opacity-50"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300">
                  รหัสลับ 8 หลัก <span className="text-gray-400">(เช่น วันครบรอบ, วันเกิด)</span>
                </label>
                <div className="flex gap-2 justify-center">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      className={`relative w-10 h-12 rounded-lg border-2 flex items-center justify-center text-lg font-medium transition-all duration-200
                        ${i < passcode.length 
                          ? 'border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:border-rose-500/50 dark:text-rose-400' 
                          : 'border-gray-200 bg-white/50 text-gray-400 dark:border-gray-700/50 dark:bg-gray-800/50'}
                      `}
                    >
                      {i < passcode.length ? passcode[i] : ''}
                      {i === passcode.length && !isCreating && (
                        <motion.div
                          layoutId="cursor"
                          className="absolute inset-0 border-2 border-rose-500 rounded-lg animate-pulse"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={passcode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setPasscode(val);
                  }}
                  className="absolute opacity-0 w-full h-12 -mt-12 cursor-text"
                  disabled={isCreating}
                />
                <div className="text-center text-xs text-gray-400">
                  {passcode.length === 0 ? "เพิ่มความปลอดภัยให้การ์ดของคุณ" : `${passcode.length}/8 ตัวเลข`}
                </div>
                
                {passcode.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2"
                  >
                     <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                       คำถามสำหรับรหัสลับ <span className="text-red-400">*</span>
                     </label>
                     <input
                       type="text"
                       value={passcodeHint}
                       onChange={(e) => setPasscodeHint(e.target.value)}
                       placeholder="เช่น วันครบรอบของเราคือ?"
                       disabled={isCreating}
                       className="w-full px-6 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-gray-900 dark:text-white placeholder-gray-400 font-light text-center"
                     />

                     <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mt-4 mb-2">
                       ข้อความที่จะแสดงเมื่อใส่รหัสถูก <span className="text-gray-400">(ไม่บังคับ)</span>
                     </label>
                     <input
                       type="text"
                       value={passcodeMessage}
                       onChange={(e) => setPasscodeMessage(e.target.value)}
                       placeholder="เช่น ยินดีด้วยคุณจำได้! เก่งมาก"
                       disabled={isCreating}
                       className="w-full px-6 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-gray-900 dark:text-white placeholder-gray-400 font-light text-center"
                     />
                  </motion.div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300">
                  อัปโหลดรูปภาพ 3 รูป (ในซอง)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  รูปที่จะแสดงเมื่อเปิดซอง (Swipe ดูได้)
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-2">
                      <label
                        htmlFor={`image-${index}`}
                        className="block relative aspect-square cursor-pointer group"
                      >
                        <div className={`w-full h-full rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                          images[index]
                            ? "border-rose-500"
                            : "border-dashed border-gray-300 dark:border-gray-600 hover:border-rose-400 bg-gray-50/50 dark:bg-gray-800/50"
                        }`}>
                          {images[index] ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={images[index]}
                                alt={`Photo ${index + 1}`}
                                fill
                                className="object-contain"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <span className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                  แก้ไข
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                              {imageLoading[index] ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-10 h-10 mb-2 border-4 border-gray-300 border-t-rose-500 rounded-full"
                                  />
                                  <span className="text-xs font-light text-gray-500 dark:text-gray-400">
                                    กำลังบีบอัด...
                                  </span>
                                </>
                              ) : (
                                <>
                                  <svg className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-xs font-light text-gray-500 dark:text-gray-400">
                                    รูปที่ {index + 1}
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <input
                          id={`image-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e)}
                          className="hidden"
                          disabled={isCreating}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
                <label className="block text-sm font-medium text-rose-600 dark:text-rose-400">
                  รูปภาพเหตุการณ์ความทรงจำ 3 รูป (Event Cards) (สำคัญ)
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  รูปภาพที่จะแสดงเป็นการ์ดเหตุการณ์พร้อมคำบรรยาย (แยกจากรูปในซอง)
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((index) => (
                    <div key={`event-${index}`} className="space-y-2 p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <label
                        htmlFor={`event-image-${index}`}
                        className="block relative aspect-[3/4] cursor-pointer group w-full"
                      >
                        <div className={`w-full h-full rounded-xl border-2 transition-all duration-300 overflow-hidden shadow-sm ${
                          eventImages[index]
                            ? "border-rose-500 rotate-1 scale-[0.98]"
                            : "border-dashed border-gray-300 dark:border-gray-600 hover:border-rose-400 bg-white dark:bg-gray-800"
                        }`}>
                          {eventImages[index] ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={eventImages[index]}
                                alt={`Event ${index + 1}`}
                                fill
                                className="object-contain"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <span className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity font-light">
                                  เปลี่ยนรูป
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                              {eventImageLoading[index] ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-8 h-8 mb-2 border-2 border-gray-300 border-t-rose-500 rounded-full"
                                />
                              ) : (
                                <>
                                  <span className="text-2xl mb-2 opacity-50">📷</span>
                                  <span className="text-xs font-light text-gray-500 dark:text-gray-400">
                                    คลิกเพิ่มรูป
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <input
                          id={`event-image-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e, true)}
                          className="hidden"
                          disabled={isCreating}
                        />
                      </label>

                      <input
                        type="text"
                        placeholder={`ตั้งชื่อเหตุการณ์ที่ ${index + 1}...`}
                        value={imageCaptions[index]}
                        onChange={(e) => {
                            const newCaptions = [...imageCaptions];
                            newCaptions[index] = e.target.value;
                            setImageCaptions(newCaptions);
                        }}
                        maxLength={40}
                        className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 focus:border-rose-500 outline-none text-center font-bold font-handwriting placeholder-gray-400 text-gray-900 dark:text-white transition-colors"
                      />
                      

                      <textarea
                        placeholder="เล่าเรื่องราวความประทับใจ..."
                        value={eventDescriptions[index]}
                        onChange={(e) => {
                            const newDescriptions = [...eventDescriptions];
                            newDescriptions[index] = e.target.value;
                            setEventDescriptions(newDescriptions);
                        }}
                        rows={3}
                        className="w-full mt-2 px-3 py-2 text-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500/50 font-light text-gray-600 dark:text-gray-300 placeholder-gray-400 resize-none text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-light text-gray-700 dark:text-gray-300">
                  เพลงสื่อความหมาย <span className="text-gray-400">(Link Youtube)</span>
                </label>
                <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    disabled={isCreating}
                    className="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-gray-900 dark:text-white placeholder-gray-400 font-light text-center"
                />
              </div>
            
              <div className="space-y-3">
                <label htmlFor="message" className="block text-sm font-light text-gray-700 dark:text-gray-300">
                  ข้อความพิเศษ <span className="text-gray-400">(ไม่บังคับ)</span>
                </label>
                <textarea
                  id="message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="เขียนข้อความที่อยากส่งถึงคนพิเศษ..."
                  disabled={isCreating}
                  rows={4}
                  maxLength={500}
                  className="w-full px-6 py-4 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-light disabled:opacity-50 resize-none"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
                  {customMessage.length}/500
                </p>
              </div>

              


              <motion.button
                onClick={handleCreate}
                disabled={!senderName || !receiverName || isCreating}
                whileHover={senderName && receiverName && !isCreating ? { scale: 1.02 } : {}}
                whileTap={senderName && receiverName && !isCreating ? { scale: 0.98 } : {}}
                className={`w-full py-5 rounded-xl font-light text-lg transition-all duration-300 ${
                  senderName && receiverName && !isCreating
                    ? "bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }`}
              >
                {isCreating ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    กำลังสร้างการ์ด...
                  </span>
                ) : senderName && receiverName ? (
                  "สร้างการ์ด"
                ) : (
                  "กรุณากรอกข้อมูลให้ครบ"
                )}
              </motion.button>

              <button
                onClick={async () => {
                  if (confirm("สร้างการ์ดด้วยข้อมูลตัวอย่างทันที?")) {
                    setIsCreating(true);
                    try {
                      const repository = new SupabaseCardRepository();
                      const createCardUseCase = new CreateCardUseCase(repository);
                      const card = await createCardUseCase.execute({
                        isPublic: true,
                        templateId: "valentine-2026",
                        senderName: "{{ ชื่อผู้มอบ }}",
                        receiverName: "{{ ชื่อผู้รับ }}",
                        passcodeHint: "{{ หัวข้อข้อความรหัสลับ }}",
                        passcode: "12345678",
                        passcodeMessage: "{{ ข้อความเมื่อกรอกรหัสลับถูก }}",
                        images: [
                          "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=500&auto=format&fit=crop&q=60", 
                          "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=60", 
                          "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&auto=format&fit=crop&q=60"
                        ],
                        eventImages: [
                          "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=500&auto=format&fit=crop&q=60",
                          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60",
                          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60"
                        ],
                        imageCaptions: ["{{ หัวข้อเหตุการณ์ 1 }}", "{{ หัวข้อเหตุการณ์ 2 }}", "{{ หัวข้อเหตุการณ์ 3 }}"],
                        eventDescriptions: [
                          "{{ คำอธิบายเหตุการณ์ 1 }}",
                          "{{ คำอธิบายเหตุการณ์ 2 }}",
                          "{{ คำอธิบายเหตุการณ์ 3 }}"
                        ],
                        youtubeUrl: "https://www.youtube.com/watch?v=sbPGSR-41x8",
                        customMessage: "{{ ข้อความพิเศษตอนท้าย }}",
                      });
                      router.push(`/${card.id}`);
                    } catch (e) {
                      console.error(e);
                      alert("เกิดข้อผิดพลาด: " + (e as Error).message);
                      setIsCreating(false);
                    }
                  }
                }}
                className="w-full py-3 mt-4 text-sm text-gray-500 underline hover:text-rose-500 transition-colors"
              >
                [Dev Only] เติมข้อมูลและสร้างทันที (Preview)
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: "gift", title: "Unboxing Experience", desc: "ประสบการณ์การเปิดของขวัญแบบดิจิทัล" },
              { icon: "sparkles", title: "Interactive Animation", desc: "แอนิเมชันสวยงามและ interactive" },
              { icon: "heart", title: "Personal Touch", desc: "ปรับแต่งได้ตามความต้องการ" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center space-y-3"
              >
                <div className="flex justify-center">
                  {feature.icon === "gift" && (
                    <svg className="w-12 h-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  )}
                  {feature.icon === "sparkles" && (
                    <svg className="w-12 h-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                  {feature.icon === "heart" && (
                    <svg className="w-12 h-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </div>
                <h4 className="text-lg font-light text-gray-900 dark:text-white">
                  {feature.title}
                </h4>
                <p className="text-sm font-light text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>


      <footer className="border-t border-gray-200/50 dark:border-gray-800/50 mt-20">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-sm font-light text-gray-500 dark:text-gray-500">
            © 2026 Unbox
          </p>
        </div>
      </footer>

      <ImageCropperModal
        isOpen={cropper.isOpen}
        imageSrc={cropper.imageSrc}
        onClose={() => setCropper(prev => ({ ...prev, isOpen: false }))}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
