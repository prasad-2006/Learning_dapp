import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Certificate from './Certificate';

interface EarnedCertificate {
  id: string;
  courseName: string;
  courseIcon: string;
  studentName: string;
  score: number;
  completionDate: Date;
  certificateId: string;
  course: {
    id: number;
    title: string;
    description: string;
    icon: string;
  };
}

export default function Certificates() {
  const [earnedCertificates, setEarnedCertificates] = useState<EarnedCertificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<EarnedCertificate | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    // Load certificates from localStorage (using the same key as QuizComponent)
    const loadCertificates = () => {
      try {
        const savedCertificates = localStorage.getItem('certificates');
        if (savedCertificates) {
          const certificates = JSON.parse(savedCertificates).map((cert: any) => ({
            id: cert.completionId || `cert-${Date.now()}`,
            courseName: cert.courseName || 'Unknown Course',
            courseIcon: getCourseIcon(cert.courseName),
            studentName: cert.userName || 'Student',
            score: cert.score || 100,
            completionDate: new Date(cert.date),
            certificateId: cert.completionId || `cert-${Date.now()}`,
            course: {
              id: getCourseId(cert.courseName),
              title: cert.courseName || 'Unknown Course',
              description: getCourseDescription(cert.courseName),
              icon: getCourseIcon(cert.courseName)
            }
          }));
          setEarnedCertificates(certificates);
        }
      } catch (error) {
        console.error('Error loading certificates:', error);
        setEarnedCertificates([]);
      }
    };

    loadCertificates();
    
    // Listen for certificate updates
    const handleStorageChange = () => {
      loadCertificates();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check every 5 seconds for same-tab updates
    const interval = setInterval(loadCertificates, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Helper function to get course icon based on course name
  const getCourseIcon = (courseName: string): string => {
    if (courseName?.includes('Blockchain')) return '⛓️';
    if (courseName?.includes('Smart Contract')) return '💻';
    if (courseName?.includes('DeFi')) return '💰';
    return '📚';
  };

  // Helper function to get course ID based on course name
  const getCourseId = (courseName: string): number => {
    if (courseName?.includes('Blockchain')) return 1;
    if (courseName?.includes('Smart Contract')) return 2;
    if (courseName?.includes('DeFi')) return 3;
    return 0;
  };

  // Helper function to get course description
  const getCourseDescription = (courseName: string): string => {
    if (courseName?.includes('Blockchain')) return 'Test your knowledge of basic blockchain concepts';
    if (courseName?.includes('Smart Contract')) return 'Advanced concepts in smart contract programming';
    if (courseName?.includes('DeFi')) return 'Understanding decentralized finance protocols';
    return 'Comprehensive blockchain and crypto education';
  };

  const handleViewCertificate = (certificate: EarnedCertificate) => {
    setSelectedCertificate(certificate);
    setShowCertificate(true);
  };

  const handleCloseCertificate = () => {
    setShowCertificate(false);
    setSelectedCertificate(null);
  };

  const downloadAllCertificates = () => {
    const certificatesData = earnedCertificates.map(cert => ({
      courseName: cert.courseName,
      studentName: cert.studentName,
      completionDate: cert.completionDate.toLocaleDateString(),
      score: cert.score,
      certificateId: cert.certificateId
    }));

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(certificatesData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "my-certificates.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-4"
            >
              <span className="text-8xl">🏆</span>
            </motion.div>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              My Certificates
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              View and download all your earned certificates from completed courses
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {earnedCertificates.length}
                </div>
                <p className="text-gray-300">Total Certificates</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {earnedCertificates.filter(cert => cert.score === 100).length}
                </div>
                <p className="text-gray-300">Perfect Scores</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {new Set(earnedCertificates.map(cert => cert.course.title)).size}
                </div>
                <p className="text-gray-300">Unique Courses</p>
              </CardContent>
            </Card>
          </div>

          {/* Certificates Grid */}
          {earnedCertificates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📜</div>
              <h2 className="text-2xl font-bold text-white mb-4">No Certificates Yet</h2>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Complete quizzes with perfect scores to earn your first certificate!
              </p>
              <Button 
                onClick={() => window.location.hash = '#quiz'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
              >
                Take a Quiz 🎯
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Earned Certificates</h2>
                <Button
                  onClick={downloadAllCertificates}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  📄 Download All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {earnedCertificates.map((certificate, index) => (
                  <motion.div
                    key={certificate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-white/20 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="text-4xl">{certificate.courseIcon}</div>
                          <div className="text-right">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                              {certificate.score}%
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                          {certificate.courseName}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex items-center justify-between">
                            <span>Student:</span>
                            <span className="text-white font-medium">{certificate.studentName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Date:</span>
                            <span className="text-white">{certificate.completionDate.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>ID:</span>
                            <span className="text-xs text-gray-400 font-mono">
                              {certificate.certificateId.slice(0, 16)}...
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleViewCertificate(certificate)}
                          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg font-semibold transition-all duration-300"
                        >
                          View Certificate 🏆
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && selectedCertificate && (
          <Certificate
            course={selectedCertificate.course}
            score={selectedCertificate.score}
            completionDate={selectedCertificate.completionDate}
            studentName={selectedCertificate.studentName}
            onClose={handleCloseCertificate}
          />
        )}
      </AnimatePresence>
    </>
  );
}
