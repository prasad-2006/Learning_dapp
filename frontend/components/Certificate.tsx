import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CertificateProps {
  course: any;
  score: number;
  completionDate: Date;
  studentName: string;
  onClose: () => void;
}

export default function Certificate({ course, score, completionDate, studentName, onClose }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = () => {
    const certificateData = {
      studentName,
      courseName: course.title,
      completionDate: completionDate.toLocaleDateString(),
      score,
      certificateId: `CERT-${Date.now()}-${course.id}`
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(certificateData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `certificate-${course.title.replace(/\s+/g, '-').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="max-w-5xl w-full"
      >
        {/* Certificate Container */}
        <div 
          ref={certificateRef} 
          className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
          style={{ aspectRatio: '4/3' }}
        >
          {/* Geometric Background Design */}
          <div className="absolute inset-0">
            {/* Top Blue Triangular Shapes */}
            <div className="absolute top-0 left-0 w-0 h-0" 
                 style={{ 
                   borderLeft: '300px solid #1e40af',
                   borderBottom: '150px solid transparent'
                 }}>
            </div>
            <div className="absolute top-0 right-0 w-0 h-0"
                 style={{
                   borderRight: '200px solid #f59e0b', 
                   borderBottom: '100px solid transparent'
                 }}>
            </div>
            
            {/* Bottom Blue Triangular Shapes */}
            <div className="absolute bottom-0 left-0 w-0 h-0"
                 style={{
                   borderLeft: '250px solid #1e40af',
                   borderTop: '120px solid transparent'
                 }}>
            </div>
            <div className="absolute bottom-0 right-0 w-0 h-0"
                 style={{
                   borderRight: '180px solid #f59e0b',
                   borderTop: '90px solid transparent'
                 }}>
            </div>

            {/* Side Accent Lines */}
            <div className="absolute left-8 top-16 w-1 h-32 bg-gradient-to-b from-blue-600 to-blue-800"></div>
            <div className="absolute left-12 top-20 w-1 h-24 bg-gradient-to-b from-orange-400 to-yellow-500"></div>
            <div className="absolute right-8 bottom-16 w-1 h-32 bg-gradient-to-t from-blue-600 to-blue-800"></div>
            <div className="absolute right-12 bottom-20 w-1 h-24 bg-gradient-to-t from-orange-400 to-yellow-500"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 px-16 py-12 text-center">
            {/* Certificate Header */}
            <div className="mb-8">
              <h1 className="text-6xl font-serif font-normal text-gray-800 tracking-[0.2em] mb-4">
                CERTIFICATE
              </h1>
              <p className="text-xl font-semibold text-gray-600 tracking-[0.15em] uppercase">
                OF ACHIEVEMENT
              </p>
              
              {/* Decorative Diamond Pattern */}
              <div className="flex justify-center items-center mt-6 mb-8">
                <div className="w-3 h-3 bg-orange-400 transform rotate-45 mx-1"></div>
                <div className="w-4 h-4 bg-blue-600 transform rotate-45 mx-2"></div>
                <div className="w-3 h-3 bg-orange-400 transform rotate-45 mx-1"></div>
              </div>
            </div>

            {/* Presentation Text */}
            <div className="mb-6">
              <p className="text-lg font-medium text-gray-700">
                This certificate is proudly presented to
              </p>
            </div>

            {/* Student Name */}
            <div className="mb-8">
              <h2 className="text-5xl font-script text-gray-800 mb-4" style={{ fontFamily: 'cursive' }}>
                {studentName}
              </h2>
              <div className="w-80 h-0.5 bg-gray-400 mx-auto"></div>
            </div>

            {/* Achievement Description */}
            <div className="mb-8 max-w-3xl mx-auto">
              <p className="text-base text-gray-700 leading-relaxed">
                For successfully completing the <strong>{course.title}</strong> course with excellence, 
                demonstrating mastery of {course.category || 'blockchain technology'} concepts and achieving a perfect score of <strong>{score}%</strong>. 
                This achievement represents dedication to learning and expertise in the field of study 
                through the LearnDApp educational platform.
              </p>
            </div>

            {/* Award Badge */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Main Badge Circle */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-lg relative">
                  <div className="text-center text-white">
                    <div className="text-xs font-bold">TOP</div>
                    <div className="text-xs font-bold">BRAND</div>
                    <div className="text-xs font-bold">AWARD</div>
                  </div>
                </div>
                
                {/* Badge Ribbons */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-12 bg-gradient-to-b from-yellow-400 to-yellow-500 clip-ribbon-left"></div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 ml-2">
                  <div className="w-8 h-12 bg-gradient-to-b from-orange-400 to-orange-500 clip-ribbon-right"></div>
                </div>
              </div>
            </div>

            {/* Signatures and Info Section */}
            <div className="flex justify-between items-end pt-8">
              {/* Left Signature */}
              <div className="text-center">
                <div className="w-48 h-px bg-gray-400 mb-3"></div>
                <p className="text-sm font-medium text-gray-600">Signature</p>
              </div>

              {/* Center - Date and Certificate Info */}
              <div className="text-center px-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800 text-lg">LearnDApp</p>
                    <p className="text-sm text-gray-600">Blockchain Learning Platform</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Date: {completionDate.toLocaleDateString()} | 
                  ID: CERT-{Date.now().toString().slice(-6)}-{course.id}
                </p>
              </div>

              {/* Right Signature */}
              <div className="text-center">
                <div className="w-48 h-px bg-gray-400 mb-3"></div>
                <p className="text-sm font-medium text-gray-600">Signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={downloadCertificate}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
          >
            📄 Download Certificate
          </Button>
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300"
          >
            ✨ Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
