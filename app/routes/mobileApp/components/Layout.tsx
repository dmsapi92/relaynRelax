import { Button } from "@nextui-org/button";
import { Drawer, DrawerContent, DrawerHeader } from "@nextui-org/drawer";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import {
  IconArrowLeft,
  IconBell,
  IconCar,
  IconDashboard,
  IconHome,
  IconLicense,
  IconLogout,
  IconMenu2,
  IconMoon,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  institution?: {
    name: string;
    logo?: string | null;
  } | null;
  showFooter?: boolean;
}

const getUserType = (pathname: string) => {
  if (pathname.includes("/mobileApp/customer")) return "customer";
  return "customer"; // default to customer
};
const sidebarMenuItems = [
  {
    label: "Profile",
    icon: IconUser,
    href: "/mobileApp/customer/profile",
  },
  {
    label: "Vehicles",
    icon: IconCar,
    href: "/mobileApp/customer/vehicles",
  },
  {
    label: "Licenses",
    icon: IconLicense,
    href: "/mobileApp/customer/licenses",
  },
  {
    label: "Reminders",
    icon: IconBell,
    href: "/mobileApp/customer/reminders",
  },
  {
    label: "Logout",
    icon: IconLogout,
    href: "/mobileApp/logout",
  },
];

const bottomNavItems = [
  {
    label: "Home",
    icon: IconHome,
    href: "/mobileApp/customer",
  },
  {
    label: "Vehicles",
    icon: IconCar,
    href: "/mobileApp/customer/vehicles",
  },
  {
    label: "Licenses",
    icon: IconLicense,
    href: "/mobileApp/customer/licenses",
  },
  {
    label: "Reminders",
    icon: IconBell,
    href: "/mobileApp/customer/reminders",
  },
];

const navItems = [
  {
    icon: IconHome,
    label: "Home",
    href: "/mobileApp/customer",
  },
  {
    icon: IconDashboard,
    label: "Dashboard",
    href: "/mobileApp/customer/dashboard",
  },
  {
    icon: IconCar,
    label: "Vehicles",
    href: "/mobileApp/customer/vehicles",
  },
  {
    icon: IconLicense,
    label: "Licenses",
    href: "/mobileApp/customer/licenses",
  },
  {
    icon: IconBell,
    label: "Reminders",
    href: "/mobileApp/customer/reminders",
  },
];

export default function Layout({
  children,
  title,
  showBackButton = true,
  institution,
  showFooter = true,
}: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isLeftOpen, setIsLeftOpen] = React.useState(false);
  const [isRightOpen, setIsRightOpen] = React.useState(false);

  const userType = getUserType(location.pathname);
  const currentSidebarItems = sidebarMenuItems;
  const currentBottomNavItems = bottomNavItems;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isRootPath = location.pathname === "/mobileApp/customer";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Left Drawer - Menu */}
      <Drawer
        isOpen={isLeftOpen}
        onClose={() => setIsLeftOpen(false)}
        placement="left"
        classNames={{
          base: "w-[80%] max-w-[320px]",
        }}
      >
        <DrawerContent className="h-full">
          <DrawerHeader className="flex gap-2 items-center border-b border-divider pb-4">
            <div>
              <h3 className="text-lg font-bold">
                {institution?.name || "relyNrelax"}
              </h3>
              <p className="text-sm text-foreground-500">Menu</p>
            </div>
          </DrawerHeader>
          <div className="flex flex-col gap-2 p-4">
            {currentSidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsLeftOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-content2"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Right Drawer - Notifications */}
      <Drawer
        isOpen={isRightOpen}
        onClose={() => setIsRightOpen(false)}
        placement="right"
        classNames={{
          base: "w-[80%] max-w-[320px]",
        }}
      >
        <DrawerContent className="h-full">
          <DrawerHeader className="border-b border-divider pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Notifications</h3>
              <Button size="sm" variant="light" color="primary">
                Mark all as read
              </Button>
            </div>
          </DrawerHeader>
          <div className="p-4">
            <p className="text-center text-foreground-500">
              No new notifications
            </p>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar
          className={`transition-all duration-300 justify-stretch items-stretch rounded-2xl mx-auto max-w-7xl ${
            isScrolled
              ? "bg-background/80 backdrop-blur-md shadow-medium"
              : "bg-background/50 backdrop-blur-sm"
          }`}
          maxWidth="full"
          position="static"
        >
          <NavbarContent className="gap-2 flex-1">
            {showBackButton && !isRootPath ? (
              <Button
                isIconOnly
                variant="light"
                onPress={() => navigate(-1)}
                className="text-foreground"
              >
                <IconArrowLeft size={24} />
              </Button>
            ) : (
              <Button
                isIconOnly
                variant="light"
                onPress={() => setIsLeftOpen(true)}
                className="text-foreground"
              >
                <IconMenu2 size={24} />
              </Button>
            )}

            <NavbarBrand className="flex gap-2 items-center flex-1 min-w-0 max-w-full">
              <h1 className="font-semibold text-center break-words whitespace-pre-wrap">
                {title || institution?.name || "relyNrelax"}
              </h1>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent justify="end" className="gap-2 flex-initial">
            <Button
              isIconOnly
              variant="flat"
              onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="bg-content2/50"
              radius="lg"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? (
                    <IconSun size={20} />
                  ) : (
                    <IconMoon size={20} />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>

            <Button
              isIconOnly
              variant="flat"
              className="bg-content2/50 relative"
              onPress={() => setIsRightOpen(true)}
              radius="lg"
            >
              <IconBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            </Button>
          </NavbarContent>
        </Navbar>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-16 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {showFooter && (
        <nav className="fixed bottom-0 left-0 right-0 bg-content1 border-t border-divider z-[100]">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex flex-col items-center justify-center w-full h-full relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 border-t-2 border-primary"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <Icon
                    size={24}
                    className={
                      isActive ? "text-primary" : "text-foreground-500"
                    }
                  />
                  <span
                    className={`text-tiny ${
                      isActive ? "text-primary" : "text-foreground-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
