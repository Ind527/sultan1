import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, X, Phone } from "lucide-react";

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const phoneNumber = "+6282129887769"; // Replace with actual WhatsApp number
  const defaultMessage = "Hello! I'm interested in your agricultural export products. Could you please provide me with more information?";

  const handleSendMessage = () => {
    const finalMessage = message.trim() || defaultMessage;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl border-0 w-16 h-16"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
          </motion.div>
        </Button>

        {/* Bounce Animation */}
        <motion.div
          className="absolute inset-0 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </motion.div>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)]"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="shadow-2xl border-0">
              <CardContent className="p-0">
                {/* Header */}
                <div className="bg-green-500 text-white p-4 rounded-t-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">GlobalExport Support</h3>
                      <p className="text-xs opacity-90">
                        Typically replies in a few minutes
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Content */}
                <div className="p-4 space-y-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">
                      👋 Hi there! How can we help you with your export needs today?
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your message:</label>
                    <textarea
                      className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                      placeholder={defaultMessage}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={handleSendMessage}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(`tel:${phoneNumber}`, '_self')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    <p>💬 Quick response guaranteed</p>
                    <p>📞 Available 24/7 for urgent inquiries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions - Always visible when not expanded */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-2 rounded-lg shadow-lg text-sm border"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              💬 Need help? Chat with us!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
