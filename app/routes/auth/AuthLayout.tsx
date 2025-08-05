import { Button } from "@nextui-org/button";
import { Link } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Car,
  FileCheck,
  LogIn,
  Moon,
  Shield,
  Sun,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Circle {
  id: number;
  left: string;
  top: string;
}

const circles: Circle[] = [
  { id: 1, left: "-5%", top: "50%" },
  { id: 2, left: "50%", top: "-5%" },
  { id: 3, left: "95%", top: "90%" },
  { id: 4, left: "80%", top: "20%" },
  { id: 5, left: "15%", top: "85%" },
];

interface AuthLayoutProps {
  children: React.ReactNode;
  isLogin?: boolean;
}

export default function AuthLayout({
  children,
  isLogin = true,
}: AuthLayoutProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (systemPrefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-primary-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-[90rem] grid ${
          isLogin ? "md:grid-cols-2" : "md:grid-cols-[35%_65%]"
        } bg-background/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-default-200 dark:border-default-100/20`}
      >
        {/* Left Side - Hero Section */}
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 bg-gradient-to-br from-primary-500 via-pink-500 to-rose-500 dark:from-primary-600 dark:via-purple-700 dark:to-pink-800 text-foreground-50 flex flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-foreground-50/80 hover:text-foreground-50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </div>

          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              rotate: [0, 1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mb-8 flex items-center gap-2"
          >
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-13 h-10 bg-white rounded-full p-1"
            />
            <h1 className="text-2xl font-bold text-white">relyNrelax</h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-4 text-white"
          >
            Never Miss a Document Expiry Again
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/90 mb-6"
          >
            Track and manage your vehicle documents efficiently with our
            comprehensive reminder system.
          </motion.p>

          <div className="space-y-4 text-sm">
            {[
              { text: "PUCC Expiry Reminders", icon: FileCheck },
              { text: "Fitness Certificate Alerts", icon: Car },
              { text: "Insurance Renewal Notifications", icon: Shield },
              { text: "Vehicle Permit Tracking", icon: Calendar },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="bg-white/20 rounded-full p-1.5">
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-white">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Button
              as={Link}
              to="/"
              variant="flat"
              className="bg-white/10 text-white hover:bg-white/20 border border-white/20"
            >
              Back to Home
            </Button>
          </motion.div>

          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {circles.map((circle) => (
              <motion.div
                key={circle.id}
                className="absolute w-64 h-64 bg-foreground-50/5 dark:bg-foreground-50/10 rounded-full"
                style={{
                  left: circle.left,
                  top: circle.top,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 15 + circle.id * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Right Side - Auth Forms */}
        <div
          className={`${
            isLogin ? "p-8" : "p-4 lg:p-8"
          } overflow-y-auto max-h-[90vh]`}
        >
          <div className="flex justify-center mb-8">
            <motion.div
              className="inline-flex p-1.5 bg-default-100 dark:bg-default-50/10 backdrop-blur-sm rounded-xl shadow-sm relative"
              animate={{ scale: [0.98, 1] }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-1.5 bg-background rounded-lg shadow-sm z-0"
                animate={{ x: isLogin ? 0 : "100%" }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                style={{ width: "50%" }}
              />
              <Link to="/auth/login">
                <motion.button
                  className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                      isLogin
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-default-600 dark:text-default-400 hover:text-foreground dark:hover:text-foreground"
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </motion.button>
              </Link>
              {/* <Link to="/auth/registration">
                <motion.button
                  className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${
                      !isLogin
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-default-600 dark:text-default-400 hover:text-foreground dark:hover:text-foreground"
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </motion.button>
              </Link> */}
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`${!isLogin && "max-w-6xl mx-auto"}`}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
