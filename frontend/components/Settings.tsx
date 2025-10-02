import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SunIcon, 
  MoonIcon,
  BellIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  CogIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState('en');
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = prefersDark ? 'dark' : 'light';
      setTheme(systemTheme);
      applyTheme(systemTheme);
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CogIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>🎨</span>
              <span>Appearance</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <SunIcon className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Light Mode</p>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <MoonIcon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
              </motion.button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <BellIcon className="w-5 h-5" />
              <span>Notifications</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about new courses and achievements</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    notifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: notifications ? 24 : 2 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md"
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Sound Effects</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Play sounds for interactions</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    soundEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: soundEnabled ? 24 : 2 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md"
                  />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>📚</span>
              <span>Learning Preferences</span>
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Auto-save Progress</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save your learning progress</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    autoSave ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: autoSave ? 24 : 2 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md"
                  />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <UserCircleIcon className="w-5 h-5" />
              <span>Account</span>
            </h3>
            
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Privacy Settings</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your data and privacy</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 text-xl">🔐</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Security</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update password and security settings</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Version 1.0.0</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Check for updates
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
