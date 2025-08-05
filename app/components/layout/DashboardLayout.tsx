import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  User,
} from "@nextui-org/react";
import { type SystemAdmin } from "@prisma/client";
import { Link, useNavigate } from "@remix-run/react";
import { motion } from "framer-motion";
import {
  Car,
  FileText,
  Home,
  Menu,
  Moon,
  Search,
  Sun,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  systemAdminRecord?: SystemAdmin;
  isSuperAdmin?: boolean;
  userPermissions?: any;
  userType?: string;
}

export default function DashboardLayout({
  children,
  currentPath,
  systemAdminRecord,
  isSuperAdmin,
  userPermissions,
  userType,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebarCollapsed");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [showBottomNav, setShowBottomNav] = useState(false);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Only run on client-side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []); // Run only on mount

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        "sidebarCollapsed",
        JSON.stringify(isSidebarCollapsed)
      );
    }
  }, [isSidebarCollapsed, mounted]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMounted(true);

    // Check if we should show bottom navigation (on mobile devices)
    const checkMobile = () => {
      setShowBottomNav(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []); // Run only on mount
  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex flex-col min-w-0">{children}</div>
      </div>
    );
  }
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        currentPath={currentPath}
        systemAdminRecord={systemAdminRecord}
        isSuperAdmin={isSuperAdmin}
        userPermissions={userPermissions}
        userType={userType}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-content1 border-b border-divider">
          <div className="h-16 px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                variant="light"
                onPress={() => {
                  if (window.innerWidth < 768) {
                    setIsMobileOpen(true);
                  } else {
                    setIsSidebarCollapsed(!isSidebarCollapsed);
                  }
                }}
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </Button>

              {/* Search Bar */}
              <div className="relative max-w-md hidden sm:block">
                <Input
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  placeholder="Search..."
                  startContent={<Search className="w-4 h-4 text-default-400" />}
                  size="sm"
                  classNames={{
                    inputWrapper: "h-9",
                  }}
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <Button
                isIconOnly
                variant="light"
                onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {/* User Menu */}
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <User
                    as="button"
                    name={systemAdminRecord?.firstName}
                    description={
                      systemAdminRecord?.email || "admin@example.com"
                    }
                    className="transition-transform"
                    avatarProps={{
                      name: systemAdminRecord
                        ? `${systemAdminRecord.firstName[0]}${systemAdminRecord.lastName[0]}`
                        : "AU",
                      size: "sm",
                      className:
                        "bg-gradient-to-br from-primary to-secondary text-white",
                    }}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <div className="flex flex-col">
                      <span className="text-small font-semibold">
                        {systemAdminRecord?.firstName}{" "}
                        {systemAdminRecord?.lastName}
                      </span>
                      <span className="text-tiny text-default-500">
                        {systemAdminRecord?.email || "admin@example.com"}
                      </span>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="settings"
                    onPress={() => navigate("/settings")}
                  >
                    Settings
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    className="text-danger"
                    color="danger"
                    onPress={() => navigate("/logout")}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-default-300 dark:scrollbar-thumb-default-600 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto p-0 sm:p-6 pb-20 md:pb-6">
            {children}
          </div>
        </main>
      </div>
      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-divider">
          <div className="flex justify-around items-center h-16 max-w-7xl mx-auto">
            {[
              { title: "Home", href: "/dashboard", icon: Home },
              { title: "Users", href: "/users", icon: Users },
              { title: "Vehicles", href: "/vehicles", icon: Car },
              { title: "Licenses", href: "/licenses", icon: FileText },
            ].map((item) => {
              const isActive = currentPath === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex flex-col items-center justify-center w-full h-full"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`flex flex-col items-center ${
                      isActive ? "text-primary" : "text-foreground-500"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-foreground-500"
                      }`}
                    />
                    <span className="text-[10px] mt-1">{item.title}</span>
                    {isActive && (
                      <motion.div
                        layoutId="bottomNav"
                        className="absolute bottom-0 w-12 h-1 bg-primary rounded-t-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
