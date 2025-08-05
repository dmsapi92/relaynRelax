import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  Calendar,
  Car,
  Check,
  ChevronRight,
  Clock,
  Cloud,
  Facebook,
  FileCheck,
  FileSignature,
  FileText,
  Fingerprint,
  HardDrive,
  HeartPulse,
  Home,
  Info,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Moon,
  Phone,
  Settings,
  ShieldCheck,
  Smartphone,
  Sun,
  Trophy,
  Truck,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { generateHomePageSEO } from "~/utils/seo";
import { getUserId } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return generateHomePageSEO();
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  return json({ isAuthenticated: !!userId });
};

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  lastUpdated: string;
}

const features: FeatureCard[] = [
  {
    title: "Pollution Certificate Expiry Reminder",
    description:
      "Never miss your PUCC renewal date. Get timely alerts before expiration.",
    icon: FileCheck,
    lastUpdated: "3 mins ago",
  },
  {
    title: "Fitness Expiry Reminder",
    description:
      "Stay on top of your vehicle's fitness certificate renewals with our reminders.",
    icon: Car,
    lastUpdated: "3 mins ago",
  },
  {
    title: "RC Expiry Reminder",
    description:
      "Receive alerts before your vehicle's registration certificate expires.",
    icon: FileSignature,
    lastUpdated: "3 mins ago",
  },
  {
    title: "Permit Expiry Reminder",
    description: "Get timely reminders for all your vehicle permit renewals.",
    icon: Calendar,
    lastUpdated: "3 mins ago",
  },
];

const categories = [
  { id: "core", name: "Core Features", color: "bg-primary" },
  { id: "security", name: "Security", color: "bg-success" },
  { id: "documents", name: "Documents", color: "bg-secondary" },
  { id: "reports", name: "Reports", color: "bg-warning" },
  { id: "communication", name: "Communication", color: "bg-pink-500" },
  { id: "support", name: "Support", color: "bg-danger" },
];

const stats = [
  { label: "Registered Users", value: "2,000+", icon: Users },
  { label: "Vehicles Managed", value: "8,000+", icon: Car },
  { label: "Customer Satisfaction", value: "98%", icon: Trophy },
  { label: "Daily Reminders", value: "100+", icon: Bell },
];

const highlights = [
  "Secure Document Storage",
  "Real-time Expiry Reminders",
  "Digital Document Access",
  "Mobile Responsive",
  "24/7 Support",
  "Regular Updates",
];

const documentTypes = [
  "PUCC",
  "Fitness Certificate",
  "RC (Registration Certificate)",
  "Insurance",
  "Permit",
  "National Permit",
  "Driving License",
];

const hoverScale = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

const shimmerEffect = {
  initial: {
    x: "-100%",
    opacity: 0.3,
  },
  animate: {
    x: "100%",
    opacity: 0,
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: "linear",
    },
  },
};

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const cardHoverAnimation = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.05,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  },
};

const textRevealAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
const testimonials = [
  {
    name: "Puja Sharma",
    role: "Fleet Manager",
    content:
      "relyNrelax has revolutionized our document management system. The automated reminders and organized dashboard have helped us maintain 100% compliance across our fleet.",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Priya Patel",
    role: "Business Owner",
    content:
      "As a business owner managing multiple vehicles, relyNrelax has been invaluable. The digital document storage and renewal tracking saves us hours of work each month.",
    avatar: "https://i.pravatar.cc/150?img=29",
  },
  {
    name: "MD Tajuddin",
    role: "Transport Company Owner",
    content:
      "relyNrelax streamlined our entire fleet documentation process. The real-time alerts and user-friendly interface have made compliance management effortless for our team.",
    avatar: "https://i.pravatar.cc/150?img=59",
  },
];

const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const fadeInStaggered = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const blinkEffect = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const bounceAnimation = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Index() {
  const { isAuthenticated } = useLoaderData<typeof loader>();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar maxWidth="xl" className="bg-background/70 backdrop-blur-md">
        <NavbarBrand>
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-14 h-12 rounded-full object-cover bg-white p-1 shadow-md transition-all hover:scale-105"
            />
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              relyNrelax
            </div>
          </div>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="text-foreground font-medium flex items-center gap-2 group"
              >
                <Home className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">
                  Home
                </span>
              </Link>
            </motion.div>
          </NavbarItem>
          <NavbarItem>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="#services"
                className="text-foreground font-medium flex items-center gap-2 group"
              >
                <Settings className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">
                  Services
                </span>
              </Link>
            </motion.div>
          </NavbarItem>
          <NavbarItem>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="#about"
                className="text-foreground font-medium flex items-center gap-2 group"
              >
                <Info className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">
                  About Us
                </span>
              </Link>
            </motion.div>
          </NavbarItem>
          <NavbarItem>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="#contact"
                className="text-foreground font-medium flex items-center gap-2 group"
              >
                <MessageCircle className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">
                  Contact Us
                </span>
              </Link>
            </motion.div>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </NavbarItem>
          {isAuthenticated ? (
            <NavbarItem>
              <Button as={Link} to="/vehicles" color="primary" variant="flat">
                Dashboard
              </Button>
            </NavbarItem>
          ) : (
            <>
              <NavbarItem>
                <Button
                  as={Link}
                  to="/auth/login"
                  color="primary"
                  variant="flat"
                >
                  Log In
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </Navbar>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 dark:from-primary-900/20 dark:to-secondary-900/20 z-0">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-4 inline-block"
              >
                <div className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                  #1 Vehicle Document Reminder Service in India
                </div>
              </motion.div>
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Welcome To{" "}
                <motion.span
                  className="text-primary"
                  variants={pulseAnimation}
                  animate="animate"
                >
                  relyNrelax.com
                </motion.span>
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                The platform that provides you reminder for the important dates
                like vehicle's PUCC expiry, Fitness expiry, RC expiry and many
                more ....
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {isAuthenticated ? (
                  <Button
                    as={Link}
                    to="/vehicles"
                    color="primary"
                    size="lg"
                    className="font-medium"
                    startContent={<Car className="h-5 w-5" />}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      as={Link}
                      to="/auth/login"
                      color="primary"
                      size="lg"
                      className="font-medium"
                      startContent={<Bell className="h-5 w-5" />}
                    >
                      Log In
                    </Button>
                    <Button
                      as={Link}
                      to="/mobileApp/auth?systemId=67f65caa5dccde075f149ef9"
                      color="secondary"
                      variant="flat"
                      size="lg"
                      className="font-medium"
                      startContent={<Smartphone className="h-5 w-5" />}
                    >
                      Mobile App
                    </Button>
                  </>
                )}
              </motion.div>

              <motion.div
                className="mt-10 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${30 + i}`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">2,000+</span> satisfied users
                </div>
                <motion.div
                  variants={pulseAnimation}
                  animate="animate"
                  className="ml-2 bg-green-500 h-2 w-2 rounded-full"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1 relative max-w-md"
            >
              <div className="relative bg-background/70 backdrop-blur-sm p-4 rounded-xl shadow-xl">
                <motion.div
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  initial="initial"
                  animate="animate"
                >
                  <motion.div
                    variants={shimmerEffect}
                    className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  />
                </motion.div>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => {
                    let Icon;
                    switch (i % 4) {
                      case 0:
                        Icon = Car;
                        break;
                      case 1:
                        Icon = Calendar;
                        break;
                      case 2:
                        Icon = Bell;
                        break;
                      case 3:
                        Icon = FileSignature;
                        break;
                      default:
                        Icon = Car;
                    }

                    return (
                      <motion.div
                        key={i}
                        variants={cardHoverAnimation}
                        initial="rest"
                        whileHover="hover"
                        className="bg-background rounded-lg p-4 shadow-md"
                      >
                        <div className="h-8 w-8 bg-primary/10 flex items-center justify-center rounded-md mb-3">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="h-2.5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                        <div className="h-2 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </motion.div>
                    );
                  })}
                </div>
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-primary text-white p-3 rounded-full shadow-lg"
                  variants={floatingAnimation}
                  animate="animate"
                >
                  <Bell className="h-6 w-6" />
                </motion.div>

                <motion.div
                  className="absolute -top-3 -left-3 bg-secondary text-white p-2 rounded-full shadow-lg"
                  variants={bounceAnimation}
                  animate="animate"
                >
                  <Calendar className="h-5 w-5" />
                </motion.div>
              </div>

              <motion.div
                className="absolute -right-10 top-1/2 transform -translate-y-1/2 hidden lg:block"
                variants={blinkEffect}
                animate="animate"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center text-primary font-bold">
                    24/7
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                    <Bell className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="mt-16 md:mt-24 bg-background/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                Why People Love relyNrelax
              </h3>
              <div className="flex items-center text-primary">
                <span className="text-sm font-medium">4.9/5</span>
                <div className="flex ml-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  className="rounded-lg bg-background p-4 border border-gray-200 dark:border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    "{testimonial.content}"
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Services Section */}
      <section
        id="services"
        className="py-16 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={textRevealAnimation}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                className="bg-primary/10 text-primary px-4 py-1 rounded-full flex items-center space-x-2"
                variants={pulseAnimation}
                animate="animate"
              >
                <Bell className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Smart Reminder System
                </span>
              </motion.div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The complete toolkit to turn one-time browsers into long-term
              customers. Never miss important document renewals again.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemAnimation}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full relative"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <Card className="h-full border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                  <CardBody className="p-6 relative">
                    {hoveredFeature === index && (
                      <motion.div
                        className="absolute inset-0 bg-primary/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                      <div className="h-14 w-14 bg-primary/10 flex items-center justify-center rounded-xl mb-4 md:mb-0 md:mr-5">
                        <feature.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{feature.title}</h3>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500">
                            Last updated {feature.lastUpdated}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {feature.description}
                    </p>

                    <div className="flex justify-between items-center mt-auto pt-4">
                      <div className="text-xs font-medium text-primary">
                        {index % 2 === 0
                          ? "Available for all users"
                          : "Premium feature"}
                      </div>
                      <Button
                        size="sm"
                        color="primary"
                        variant="light"
                        endContent={<Bell className="h-4 w-4" />}
                      >
                        Set Reminder
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-2xl font-bold mb-4">
                  Additional Document Management Features
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  relyNrelax provides a comprehensive solution for all your
                  vehicle documents management needs. From digital storage to
                  intelligent expiry predictions, we have everything covered.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Cloud Backup",
                      icon: Cloud,
                      description: "All your documents securely backed up",
                    },
                    {
                      title: "Digital Storage",
                      icon: HardDrive,
                      description: "Paperless management of all documents",
                    },
                    {
                      title: "WhatsApp Alerts",
                      icon: MessageSquare,
                      description: "Get timely alerts via WhatsApp",
                    },
                    {
                      title: "Multi-vehicle Support",
                      icon: Truck,
                      description: "Manage unlimited vehicles in one account",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-background/70"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="hidden md:flex items-center justify-center">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, rotate: -10 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-background rounded-xl shadow-xl w-60 p-4 relative z-10 border border-gray-200 dark:border-gray-800">
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                        alt="Vehicle"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full mb-2"></div>
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-600 rounded-full mb-2"></div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="absolute -bottom-4 -left-4 bg-secondary/10 rounded-xl shadow-md w-40 p-3 border border-gray-200 dark:border-gray-800"
                    variants={floatingAnimation}
                    animate="animate"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-1"></div>
                    <div className="h-2 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-center">About Us</h2>

              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  At relyNrelax, we understand the importance of staying ahead
                  with your vehicle's documentation. We are dedicated to ensure
                  that you never miss an expiry date again. Our innovative
                  reminder service alerts you promptly when your vehicle's
                  documents, including registration, insurance, and licenses,
                  are due for renewal.
                </p>

                <p>
                  Driven by a passion for simplifying your life and enhancing
                  your peace of mind, relyNrelax leverages cutting-edge
                  technology to deliver timely notifications via Phone call, SMS
                  or Whatsapp message, email, etc. Our team is committed to
                  provide reliable and personalized service, tailored to meet
                  the unique needs of each of our valued customers.
                </p>

                <p>
                  Join thousands of satisfied clients who rely on us and relax,
                  to keep them informed and compliant. Whether you're a busy
                  professional, a fleet manager, or a conscientious vehicle
                  owner, our goal is to make document management effortless and
                  efficient.
                </p>

                <p>
                  Discover the difference with relyNrelax. Let us handle the
                  details so you can focus on what matters most—safely enjoying
                  the road ahead.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Document Types Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-1 rounded-full mb-4">
              <FileText className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                All Document Types Covered
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Document Management
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We help you track and manage all types of vehicle and driving
              license documents through their lifecycle.
            </p>
          </motion.div>

          <div className="relative mb-16">
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-full"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                filter: "blur(80px)",
              }}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {documentTypes.map((docType, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className="bg-background rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center relative z-10"
                >
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4 mx-auto">
                    {index === 0 ? (
                      <AlertTriangle className="h-6 w-6 text-primary" />
                    ) : index === 1 ? (
                      <HeartPulse className="h-6 w-6 text-primary" />
                    ) : index === 2 ? (
                      <FileText className="h-6 w-6 text-primary" />
                    ) : index === 3 ? (
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    ) : index === 4 ? (
                      <Award className="h-6 w-6 text-primary" />
                    ) : index === 5 ? (
                      <Fingerprint className="h-6 w-6 text-primary" />
                    ) : (
                      <FileCheck className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="font-medium mb-2">{docType}</div>
                  <div className="text-xs text-gray-500">
                    {index === 99
                      ? "Renewed every 6 months"
                      : index === 99
                      ? "Annual renewal"
                      : index === 99
                      ? "15-year validity"
                      : index === 3
                      ? "Annual renewal"
                      : index === 99
                      ? "5-year validity"
                      : index === 99
                      ? "20-year validity"
                      : "Renewal based on type"}
                  </div>
                  {index % 3 === 0 && (
                    <div className="absolute -top-1 -right-1">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="bg-background rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Why Document Management Matters
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Proper document management is not just about compliance - it's
                  about safety, security, and peace of mind. Missing renewals
                  can lead to penalties and legal issues.
                </p>

                <motion.ul
                  className="space-y-4"
                  variants={fadeInStaggered}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {[
                    "Avoid hefty fines and penalties",
                    "Prevent vehicle seizure due to expired documents",
                    "Maintain legal compliance at all times",
                    "Ensure smooth operation of your vehicles",
                    "Keep insurance coverage active for protection",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3"
                      variants={itemAnimation}
                    >
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 mt-0.5 flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="mt-8">
                  <Button
                    as={Link}
                    to="/auth/login"
                    color="primary"
                    className="font-medium"
                    endContent={<ArrowRight className="h-4 w-4" />}
                  >
                    Start Tracking Your Documents
                  </Button>
                </div>
              </div>

              <div className="relative">
                <motion.div
                  className="absolute -top-10 -left-10 w-20 h-20 bg-primary/10 rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                />

                <motion.div
                  className="absolute -bottom-5 -right-5 w-12 h-12 bg-secondary/10 rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                />

                <motion.div
                  className="relative bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1586861268223-8b7a663562ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                    alt="Document Management"
                    className="w-full h-full object-cover rounded-xl mix-blend-overlay"
                  />

                  <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
                    <div className="bg-background/80 backdrop-blur-sm p-6 rounded-xl shadow-lg max-w-md">
                      <div className="flex justify-center mb-4">
                        <Megaphone className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Don't Risk It!</h4>
                      <p className="text-sm">
                        <span className="text-red-500 font-semibold">85%</span>{" "}
                        of vehicle owners have faced penalties for expired
                        documents at least once.
                      </p>
                      <div className="mt-4 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          whileInView={{ width: "85%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary-500/90 to-secondary-500/90 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzB2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center bg-white/10 text-white px-4 py-1 rounded-full mb-4">
              <Trophy className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Industry Leader</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Thousands Trust relyNrelax
            </h2>
            <p className="text-lg max-w-3xl mx-auto opacity-90">
              Join thousands of users who trust relyNrelax to manage their
              vehicle documents and get timely reminders.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 origin-left"
                  transition={{ duration: 0.4 }}
                />

                <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 relative">
                  <stat.icon className="h-8 w-8" />

                  <svg
                    className="absolute -top-1 -right-1 h-20 w-20 text-white/10"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="125.6"
                      transform="rotate(-90 50 50)"
                    >
                      <motion.animate
                        attributeName="stroke-dashoffset"
                        from="251.2"
                        to={
                          index === 0
                            ? "50"
                            : index === 1
                            ? "75"
                            : index === 2
                            ? "5"
                            : "100"
                        }
                        dur="2s"
                        fill="freeze"
                        begin="0.5s"
                      />
                    </circle>
                  </svg>
                </div>

                <motion.div
                  className="text-4xl font-bold mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 200,
                  }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>

                <div className="text-sm opacity-90 mb-3">{stat.label}</div>

                <div className="h-1 w-16 bg-white/30 mx-auto rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Real-Time Monitoring & Analytics
                </h3>
                <p className="opacity-90 mb-6">
                  We don't just remind you - we provide comprehensive analytics
                  to help you understand your document renewal patterns and
                  optimize your vehicle management.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      label: "Timely Reminders",
                      value: "100%",
                      color: "bg-green-400",
                    },
                    {
                      label: "User Satisfaction",
                      value: "98%",
                      color: "bg-blue-400",
                    },
                    {
                      label: "Document Renewals",
                      value: "25K+",
                      color: "bg-purple-400",
                    },
                    {
                      label: "Penalty Prevention",
                      value: "99.5%",
                      color: "bg-yellow-400",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex justify-between mb-1">
                        <div className="text-sm">{item.label}</div>
                        <div className="text-sm font-bold">{item.value}</div>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${item.color}`}
                          initial={{ width: 0 }}
                          whileInView={{
                            width:
                              item.value === "100%"
                                ? "100%"
                                : item.value === "98%"
                                ? "98%"
                                : item.value === "99.5%"
                                ? "99.5%"
                                : "90%",
                          }}
                          transition={{ duration: 1, delay: 0.2 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button
                    as={Link}
                    to="#contact"
                    variant="flat"
                    color="default"
                    className="bg-white/20 text-white hover:bg-white/30"
                    endContent={<ChevronRight className="h-4 w-4" />}
                  >
                    Learn how we help
                  </Button>
                </div>
              </div>

              <div className="hidden md:block">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, rotate: 5 }}
                  whileInView={{ opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 transform rotate-3">
                    <div className="h-4 w-32 bg-white/20 rounded-full mb-4"></div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <div className="h-3 w-full bg-white/20 rounded-full mb-2"></div>
                        <div className="h-3 w-2/3 bg-white/20 rounded-full mb-2"></div>
                        <div className="h-10 w-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-md"></div>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg">
                        <div className="h-3 w-full bg-white/20 rounded-full mb-2"></div>
                        <div className="h-3 w-2/3 bg-white/20 rounded-full mb-2"></div>
                        <div className="h-10 w-full bg-gradient-to-r from-blue-400 to-green-400 rounded-md"></div>
                      </div>
                    </div>

                    <div className="bg-white/10 p-3 rounded-lg mb-4">
                      <div className="flex justify-between mb-2">
                        <div className="h-3 w-20 bg-white/20 rounded-full"></div>
                        <div className="h-3 w-12 bg-white/20 rounded-full"></div>
                      </div>
                      <div className="h-4 bg-white/10 rounded-full w-full overflow-hidden">
                        <motion.div
                          className="h-full bg-yellow-400"
                          initial={{ width: 0 }}
                          whileInView={{ width: "75%" }}
                          transition={{ duration: 2, delay: 0.5 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-2 w-2 bg-white/30 rounded-full"
                          ></div>
                        ))}
                      </div>
                      <div className="h-6 w-20 bg-primary/50 rounded-md"></div>
                    </div>
                  </div>

                  <motion.div
                    className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20"
                    variants={pulseAnimation}
                    animate="animate"
                  >
                    <Zap className="h-6 w-6" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-t from-secondary/5 to-transparent"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary-50/50 to-secondary-50/50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-1 rounded-full mb-4">
                    <Bell className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Never Miss An Expiry Again
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Stay On Top of Your Vehicle Documents?
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    Join relyNrelax today and experience hassle-free document
                    management with timely reminders. Start with a free account
                    and upgrade anytime.
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    {isAuthenticated ? (
                      <Button
                        as={Link}
                        to="/vehicles"
                        color="primary"
                        size="lg"
                        className="font-medium"
                        startContent={<Car className="h-5 w-5" />}
                      >
                        Manage Your Documents
                      </Button>
                    ) : (
                      <>
                        <Button
                          as={Link}
                          to="/mobileApp/auth?systemId=67f65caa5dccde075f149ef9"
                          color="primary"
                          size="lg"
                          className="font-medium"
                          startContent={<Smartphone className="h-5 w-5" />}
                        >
                          Mobile App
                        </Button>
                        <Button
                          as={Link}
                          to="/auth/login"
                          variant="bordered"
                          color="primary"
                          size="lg"
                          className="font-medium"
                        >
                          Log In
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-background overflow-hidden"
                        >
                          <img
                            src={`https://i.pravatar.cc/100?img=${50 + i}`}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Joined by <span className="font-semibold">5,000+</span>{" "}
                      vehicle owners
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="md:col-span-2">
                <motion.div
                  className="bg-background rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -top-3 -right-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
                    Free to Start
                  </div>

                  <h3 className="text-xl font-bold mb-4">Key Benefits</h3>

                  <ul className="space-y-3 mb-6">
                    {[
                      {
                        text: "Timely reminders for all documents",
                        icon: Bell,
                      },
                      { text: "Secure digital document storage", icon: Lock },
                      {
                        text: "Multi-vehicle support in one account",
                        icon: Car,
                      },
                      {
                        text: "Mobile & WhatsApp notifications",
                        icon: MessageSquare,
                      },
                      {
                        text: "24/7 dedicated customer support",
                        icon: HeartPulse,
                      },
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.text}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <div className="text-center">
                    <Button
                      as={Link}
                      to="/about"
                      color="secondary"
                      variant="ghost"
                      endContent={<ArrowRight className="h-4 w-4" />}
                      className="font-medium"
                    >
                      Learn about our premium plans
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-1 rounded-full mb-4">
              <Mail className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions or need assistance? Our customer support team is
              available 24/7 to help you with all your queries.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="md:col-span-2 bg-background rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-800"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help you?"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    placeholder="Your message..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>

                <Button
                  color="primary"
                  className="font-medium w-full sm:w-auto"
                  endContent={<Mail className="h-4 w-4" />}
                >
                  Send Message
                </Button>
              </motion.div>

              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardBody className="flex items-center p-6">
                    <Mail className="h-10 w-10 text-primary mr-4" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a
                        href="mailto:helpdesk.relynrelax@gmail.com"
                        className="font-medium text-primary text-lg"
                      >
                        helpdesk.relynrelax@gmail.com
                      </a>
                    </div>
                  </CardBody>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardBody className="flex items-center p-6">
                    <Phone className="h-10 w-10 text-primary mr-4" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <a
                        href="tel:+919395783957"
                        className="font-medium text-primary text-lg"
                      >
                        +91 9395783957
                      </a>
                    </div>
                  </CardBody>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardBody className="p-6">
                    <h3 className="font-medium mb-3">Business Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Monday - Friday:</span>
                        <span>9:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Saturday:</span>
                        <span>10:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Sunday:</span>
                        <span>Closed</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center text-primary">
                        <Bell className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">
                          Support available 24/7
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="text-2xl font-bold text-white mr-2">
                  relyNrelax
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                India's leading vehicle document reminder service. We help
                vehicle owners stay compliant and avoid penalties with timely
                document renewal reminders.
              </p>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "Services", path: "#services" },
                  { name: "About Us", path: "#about" },
                  { name: "Contact", path: "#contact" },
                  { name: "Login", path: "/auth/login" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-3">
                {[
                  { name: "Privacy Policy", path: "/privacy" },
                  { name: "Terms of Service", path: "/terms" },
                  { name: "Refund Policy", path: "/refund" },
                  { name: "Data Protection", path: "/data-protection" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 py-6 text-center">
            <p className="text-sm text-gray-400">
              Copyright © {new Date().getFullYear()} relynrelax.com. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <a
          href="https://wa.me/9395783957"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          {/* Multiple pulsing background effects */}
          <motion.div
            className="absolute inset-0 bg-green-500 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-green-500 rounded-full opacity-10"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.1, 0, 0.1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          {/* Main button with gradient */}
          <motion.div
            className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-green-600 group-hover:to-green-700 relative z-10"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <img
                src="https://i.ibb.co/fz2XMtPW/WhatsApp.png"
                alt="WhatsApp"
                className="h-6 w-6 object-contain"
              />
            </motion.div>
          </motion.div>

          {/* 24/7 Badge with animation */}
          <motion.div
            className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full px-2 py-1 flex items-center justify-center z-20 shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.2, rotate: 360 }}
          >
            24/7
          </motion.div>

          {/* Enhanced Tooltip */}
          <motion.div
            className="absolute -left-2 bottom-16 bg-white text-gray-800 px-4 py-3 rounded-xl shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2"
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <img
                src="https://i.ibb.co/fz2XMtPW/WhatsApp.png"
                alt="WhatsApp"
                className="h-4 w-4 object-contain"
              />
              <span>Chat with us on WhatsApp</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-white transform rotate-45 translate-y-1/2 shadow-sm" />

            {/* Tooltip arrow animation */}
            <motion.div
              className="absolute -bottom-1 right-4 w-2 h-2 bg-white transform rotate-45"
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Click animation effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0 }}
            whileHover={{ scale: 1.2, opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          />
        </a>
      </motion.div>
    </div>
  );
}
