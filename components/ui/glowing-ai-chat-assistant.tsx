'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Link, Code, Mic, Send, Info, Bot, X, Trash2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const FloatingAiAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      text: 'Assalamu alaikum! Education platformasiga xush kelibsiz. Men bu platforma haqida barcha savollaringizga javob beraman.',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const maxChars = 2000;
  const chatRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);



  // AI responses
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('xususiyat') || lowerMessage.includes('feature')) {
      return `Education platformamizning asosiy xususiyatlari:\n\n1. Online kurslar va darslar\n2. Interaktiv o'quv vositalari\n3. O'qituvchilar bilan bevosita bog'lanish\n4. O'quvchi natijalarini kuzatish\n5. Sertifikat va attestatlar\n6. Video darslar va matnli o'quv vositalari\n7. Ijro topshiriqlar va test\n\nBu xususiyatlar orqali siz samarali ta'lim olishingiz mumkin.`;
    }

    if (lowerMessage.includes('kurs') || lowerMessage.includes('course')) {
      return `Bizning platformada quyidagi yo'nalishlar bo'yicha kurslar mavjud:\n\n• Programmalash (Python, JavaScript, React, Node.js)\n• Web Dizayn va Frontend\n• Mobile Ilovalar (iOS, Android)\n• Data Science va AI\n• Digital Marketing va SEO\n• UI/UX Dizayn\n• Cloud Texnologiyalar\n\nHar bir kurs sertifikat bilan tugaydi, shuningdek portfolio loyihalari kiradi.`;
    }

    if (lowerMessage.includes('xavf') || lowerMessage.includes('security') || lowerMessage.includes('himoya')) {
      return `Xavfsizlik bizning birinchi prioriteti:\n\n• SSL/TLS shifrlash - barcha ma'lumotlar himoyalangan\n• Parollar xesh-langan format'da saqlanadi\n• 2-faktorli autentifikatsiya mavjud\n• Muntazam xavfsizlik tekshiruvi o'tkaziladi\n• Shaxsiy ma'lumotlar GDPR standartiga mos\n• Serverlar xavfsiz ma'mozda joylashgan\n• Avtomatik backup har 24 soatda\n\nBizning platforma xalqaro xavfsizlik standartlariga javob beradi.`;
    }

    if (lowerMessage.includes('platform') || lowerMessage.includes('haqida')) {
      return `Education - ta'lim va o'qitish uchun zamonaviy platforma.\n\nBiz talabalarni raqamli ta'lim orqali o'z hayollarini amalga oshirishda yordam beramiz.\n\n✓ 50,000+ faol foydalanuvchi\n✓ 200+ zamonaviy kurs\n✓ 500+ tajribali o'qituvchi\n✓ 24/7 texnik qo'llab-quvvatlash\n\nBizning missiyasi: har kimga yuqori sifatli ta'lim imkoniyatini berish.`;
    }

    if (lowerMessage.includes('o\'qituvchi') || lowerMessage.includes('teacher') || lowerMessage.includes('instructor')) {
      return `Bizning platformada tajribali va malakali o'qituvchilar mavjud:\n\n✓ Sohada 5+ yil tajribasi\n✓ Sertifikatlangan mutaxassislar\n✓ Amaliy loyihalar bo'yicha mentoring\n✓ Bevosita darslar va savolga javoblar\n✓ Shaxsiy o'quv rejasi yasash\n\nO'qituvchilar bilan bog'lanish:\n• Live video darslar - har hafta\n• Chat orqali koʻrsatma - 24/7\n• Email bilan javoblar - 12 soat ichida`;
    }

    if (lowerMessage.includes('sertifikat') || lowerMessage.includes('attestat') || lowerMessage.includes('certificate')) {
      return `Sertifikat va Attestatlar:\n\n✓ Har bir kurs tugaganida sertifikat\n✓ LinkedIn'da tadbiqlanishi mumkin\n✓ CV'da qo'shish uchun ruxsat\n✓ Xalqaro tan olish\n\nSertifikat olish sharti:\n• Barcha video darslarni ko'rish\n• Barcha testlardan 80%+ ball\n• Final layihani bajarib yuborish`;
    }

    if (lowerMessage.includes('narx') || lowerMessage.includes('to\'lov') || lowerMessage.includes('price')) {
      return `To'lov va Narxlar:\n\n📌 Bepul kurslar:\n• Kirish kurslari va webinarlar\n• Demoversion mavjud\n\n💰 Premium oʻyiklar:\n• Oylik: 29,999 som\n• Yillik: 299,999 som (30% chegirma)\n\n✨ Enterprise:\n• Guruhlar uchun maxsus narx\n• Korporativ tadbir\n\nHamma to'lovlar xavfli Payment Gateway orqali.`;
    }

    if (lowerMessage.includes('royxatdan') || lowerMessage.includes('register') || lowerMessage.includes('account')) {
      return `Ro'yxatdan o'tish juda oson:\n\n1️⃣ Email yoki telefon raqami\n2️⃣ Kuch taragi parol belgilash\n3️⃣ Email tasdiqlash\n4️⃣ Profil to'ldirish (ixtiyoriy)\n\nRo'yxatdan o'tgach:\n✓ Bepul kurslarni ko'rish mumkin\n✓ Sertifikat olish\n✓ O'qituvchilar bilan bog'lanish\n✓ Shaxsiy doshbord\n\nRo'yxatdan o'tish 2 minutada tugatiladi.`;
    }

    if (lowerMessage.includes('qollabquv') || lowerMessage.includes('support') || lowerMessage.includes('muammo')) {
      return `Qo'llab-Quvvatlash:\n\n📞 Bog'lanish usullari:\n• Chat: 24/7 mavjud\n• Email: support@education.uz\n• Telefon: +998 (71) 200-20-20\n• Social: Instagram, Telegram\n\n⏱️ Javob vaqti:\n• Chat: 5-10 daqiqa\n• Email: 12 soat ichida\n• Telefon: Ish kunlarida\n\nBiz barcha muammolarni tezda hal qilamiz.`;
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('card') || lowerMessage.includes('click') || lowerMessage.includes('payme')) {
      return `To'lov Usullari:\n\n💳 Kredit kartalar:\n• Visa, Mastercard, Humo\n• UzCard\n\n📱 Mobile to'lovlar:\n• Payme\n• Click\n• M10\n\n🏦 Bank o'tkazmalari:\n• Barcha O'zbekiston banklari\n\nBarchasida SSL shifrlash bilan xavfli.`;
    }

    return `Siz shunday savol berdiniz: "${userMessage}"\n\nEducation platformasi haqida ko'proq ma'lumot:\n• Xususiyatlar\n• Kurslar\n• Xavfsizlik\n• Sertifikatlar\n• To'lov usullari\n• Qo'llab-quvvatlash\n\nBoshqa savol bering yoki admin bilan bog'lanib koping.`;
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
  };

  const handleSend = () => {
    if (message.trim()) {
      // Add user message
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setMessage('');
      setCharCount(0);
      setIsLoading(true);

      // Simulate AI response delay
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: getAIResponse(message),
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);
      }, 800);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '0',
        text: 'Assalamu alaikum! Education platformasiga xush kelibsiz. Men bu platforma haqida barcha savollaringizga javob beraman.',
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);
    setMessage('');
    setCharCount(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        if (!(event.target as HTMLElement).closest('.floating-ai-button')) {
          setIsChatOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Backdrop when chat is open */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsChatOpen(false)}
        />
      )}
      
      <div className="fixed bottom-6 right-6 z-50 p-4 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
        {/* Floating 3D Glowing AI Logo */}
        <button 
          className={`floating-ai-button relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform ${
            isChatOpen ? 'rotate-90' : 'rotate-0'
          }`}
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,1) 0%, rgba(168,85,247,1) 100%)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.7), 0 0 40px rgba(124, 58, 237, 0.5), 0 0 60px rgba(109, 40, 217, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* 3D effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-30"></div>
          
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
          
          {/* AI Icon */}
          <div className="relative z-10">
          { isChatOpen ? <X /> :  <Bot className="w-8 h-8 text-white" />}
          </div>
          
          {/* Glowing animation */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500"></div>
        </button>

        {/* Chat Interface */}
        {isChatOpen && (
          <div 
            ref={chatRef}
            className="absolute bottom-20 right-0 w-max max-w-[500px] transition-all duration-300 origin-bottom-right"
            style={{
              animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            }}
          >
            <div className="relative flex flex-col rounded-3xl bg-gradient-to-br from-zinc-950 to-black border border-zinc-700/50 shadow-2xl backdrop-blur-3xl overflow-hidden h-[420px]">
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-medium text-zinc-400">AI Assistant</span>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-700/50 transition-colors"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-zinc-800 text-zinc-100 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === 'user'
                            ? 'text-indigo-200'
                            : 'text-zinc-500'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString('uz-UZ', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <div
                        className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                        style={{ animationDelay: '0s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce ml-1"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce ml-1"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Section */}
              <div className="px-4 pb-4 flex-shrink-0">
                <div className="relative overflow-hidden mb-3">
                  <textarea
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 outline-none resize-none text-sm font-normal leading-relaxed text-zinc-100 placeholder-zinc-500 rounded-lg hover:border-zinc-600/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    placeholder="Savolingizni yozing..."
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  />
                </div>

                {/* Controls Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Attachment Group */}
                    <div className="flex items-center gap-1.5 p-1 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
                      <button className="group relative p-2.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-300 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/80 hover:scale-105">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="group relative p-2.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-300 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 hover:scale-105">
                        <Link className="w-4 h-4" />
                      </button>
                      <button className="group relative p-2.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-300 text-zinc-500 hover:text-green-400 hover:bg-zinc-800/80 hover:scale-105">
                        <Code className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Voice Button */}
                    <button className="group relative p-2.5 bg-transparent border border-zinc-700/30 rounded-lg cursor-pointer transition-all duration-300 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 hover:scale-105">
                      <Mic className="w-4 h-4" />
                    </button>

                    {/* Clear Chat Button */}
                    <button 
                      onClick={handleClearChat}
                      className="group relative p-2.5 bg-transparent border border-zinc-700/30 rounded-lg cursor-pointer transition-all duration-300 text-zinc-500 hover:text-orange-400 hover:bg-zinc-800/80 hover:scale-105"
                      title="Yozishmalarni tozalash"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Character Counter */}
                    <div className="text-xs font-medium text-zinc-500">
                      <span>{charCount}</span>/<span className="text-zinc-400">{maxChars}</span>
                    </div>

                    {/* Send Button */}
                    <button 
                      onClick={handleSend}
                      disabled={!message.trim() || isLoading}
                      className="group relative p-3 bg-gradient-to-r from-indigo-600 to-indigo-500 border-none rounded-xl cursor-pointer transition-all duration-300 text-white shadow-lg hover:from-indigo-500 hover:to-indigo-400 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform"
                      style={{
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50 text-xs text-zinc-500 gap-2">
                  <div className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>Shift + Enter = yangi qator</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>

              {/* Floating Overlay */}
              <div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.05), transparent, rgba(147,51,234,0.05))' 
                }}
              ></div>
            </div>
          </div>
        )}
        
        {/* CSS for animations */}
        <style jsx>{`
          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.8) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          .floating-ai-button:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.9), 0 0 50px rgba(124, 58, 237, 0.7), 0 0 70px rgba(109, 40, 217, 0.5);
          }
        `}</style>
      </div>
    </>
  );
};

export { FloatingAiAssistant };
