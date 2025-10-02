import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CertificateNameDialogProps {
  course: any;
  score: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export default function CertificateNameDialog({ course, score, onSubmit, onCancel }: CertificateNameDialogProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load profile username as default
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.username) {
          setName(profile.username);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setName("CryptoLearner"); // Fallback default
      }
    } else {
      setName("CryptoLearner"); // Default if no profile
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    onSubmit(name.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="max-w-lg w-full"
      >
        <Card className="bg-gradient-to-br from-white via-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Perfect Score Achieved!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Congratulations! You scored {score}% in {course.title}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
              <p className="text-center text-gray-700 font-medium">
                You've earned a <strong>Certificate of Achievement</strong>!
                <br />
                Enter your name to personalize your certificate.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="certificateName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name for Certificate
                </label>
                <Input
                  id="certificateName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name..."
                  className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                  maxLength={50}
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  This name will appear on your certificate
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!name.trim() || isSubmitting}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <>🎓 Generate Certificate</>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  Skip
                </Button>
              </div>
            </form>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Blockchain Verified
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Instantly Generated
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Downloadable
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
