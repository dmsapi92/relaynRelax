import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { Switch } from "@nextui-org/switch";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Car,
  ChevronDown,
  Cog,
  FileText,
  Home,
  LifeBuoy,
  Maximize2,
  Minimize2,
  Search,
  Smartphone,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { SystemAdmin } from "prisma/schema/generated/zod";
import { useEffect, useMemo, useRef, useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  isCollapsed: boolean;
  currentPath: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  systemAdminRecord?: SystemAdmin;
  isSuperAdmin?: boolean;
  userPermissions?: any;
  userType?: string;
}

export const navigationGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "dashboard", href: "/dashboard", icon: Home },
      { title: "Users", href: "/users", icon: Users },
      { title: "Notifications", href: "/notifications", icon: Bell },
      { title: "Mobile App", href: "/mobileApp/auth", icon: Smartphone },
    ],
  },
  {
    title: "Reminders",
    items: [{ title: "All Reminders", href: "/reminders", icon: Bell }],
  },
  {
    title: "Vehicle Management",
    items: [{ title: "All Vehicles", href: "/vehicles", icon: Car }],
  },
  {
    title: "Driving Licenses",
    items: [{ title: "All Licenses", href: "/licenses", icon: FileText }],
  },
  {
    title: "Billing & Payments",
    items: [{ title: "Billing Overview", href: "/billing", icon: Wallet }],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", href: "/profile", icon: User },
      { title: "Support", href: "/support", icon: LifeBuoy },
    ],
  },
];

// Helper function to check if user has permission for a specific path
const hasPermissionForPath = (permissions: any, path: string): boolean => {
  if (!permissions) return false;

  // Always allow certain paths
  const alwaysAllowedPaths = [
    "/dashboard",
    "/analytics",
    "/notifications",
    "/settings",
    "/support",
  ];

  if (alwaysAllowedPaths.includes(path)) return true;

  // Find the matching permission in the permissionsData array
  const permission = permissions.permissionsData?.find((p: any) => {
    // Handle dynamic route parameters by replacing them with wildcards
    const routePattern = path.replace(/\$[^/]+/g, "*");
    const permissionPattern = p.path?.replace(/\$[^/]+/g, "*") || "";

    // Check if this is a parent route that should be hidden
    const isRestrictedParentRoute = [
      "/facility/hostel",
      "/facility/library",
      "/facility/transport",
      "/facility/resources",
      "/facility/lesson-plans",
      "/facility/teacher-logbook",
      "/communication/messages",
      "/communication/announcements",
      "/communication/forums",
      "/communication/ptm",
    ].some((restrictedPath) => path.startsWith(restrictedPath));

    if (isRestrictedParentRoute) {
      // For restricted parent routes, require exact permission match
      return (
        routePattern === permissionPattern &&
        (p.canread || p.canwrite || p.canupdate || p.candelete)
      );
    }

    // For other routes, allow partial matches
    return (
      routePattern === permissionPattern ||
      routePattern.startsWith(permissionPattern)
    );
  });

  if (!permission) return false;

  // Check if any permission is granted (read/write/update/delete)
  return (
    permission.canread ||
    permission.canwrite ||
    permission.canupdate ||
    permission.candelete
  );
};

// Helper function to filter navigation items based on permissions
const filterNavigationItems = (
  items: NavItem[],
  permissions: any,
  userType: string
): NavItem[] => {
  return items.filter((item) => {
    // Always show certain items for all users
    const alwaysShowItems = [
      "Overview",
      "Settings",
      "Support",
      "Dashboard",
      "Analytics",
      "Notifications",
    ];
    if (alwaysShowItems.includes(item.title)) return true;

    // Check permissions based on path
    const hasPermission = hasPermissionForPath(permissions, item.href);

    // Filter children recursively
    if (item.children) {
      const filteredChildren = filterNavigationItems(
        item.children,
        permissions,
        userType
      );

      // Only keep children array if it has items
      if (filteredChildren.length > 0) {
        item.children = filteredChildren;
        // For parent items, require explicit permission or allowed children
        return hasPermission || alwaysShowItems.includes(item.title);
      }
      return false;
    }

    // User type specific filtering
    switch (userType) {
      case "SUPER_ADMIN":
        return true; // Super admin sees everything
      case "ADMIN":
        // Check for specific admin restrictions
        const adminRestrictedPaths = [
          "/institution-setup/system",
          "/settings/system",
          "/facility/hostel",
          "/facility/library",
          "/facility/transport",
          "/facility/resources",
          "/facility/lesson-plans",
          "/facility/teacher-logbook",
          "/communication/messages",
          "/communication/announcements",
          "/communication/forums",
          "/communication/ptm",
        ];
        return (
          hasPermission &&
          !adminRestrictedPaths.some((path) => item.href.startsWith(path))
        );
      case "STAFF":
        // Staff has more restricted access
        const staffRestrictedPaths = [
          "/administrative/roles",
          "/settings/system",
          "/institution-setup",
          "/finance/salary-management",
          "/finance/budget",
          "/finance/payment-gateway",
          "/facility/hostel",
          "/facility/library",
          "/facility/transport",
          "/facility/resources",
          "/facility/lesson-plans",
          "/facility/teacher-logbook",
          "/communication/messages",
          "/communication/announcements",
          "/communication/forums",
          "/communication/ptm",
        ];
        return (
          hasPermission &&
          !staffRestrictedPaths.some((path) => item.href.startsWith(path))
        );
      default:
        return hasPermission;
    }
  });
};

// Helper function to filter navigation groups
const filterNavigationGroups = (
  groups: NavGroup[],
  permissions: any,
  userType: string
): NavGroup[] => {
  return groups
    .map((group) => ({
      ...group,
      items: filterNavigationItems(group.items, permissions, userType),
    }))
    .filter((group) => group.items.length > 0); // Only keep groups that have visible items
};

// Add this new recursive NavItem component before the Sidebar component
const NavItem = ({
  item,
  isCollapsed,
  currentPath,
  level = 0,
  expandedItems,
  setExpandedItems,
  isMinimal = false,
}: {
  item: NavItem;
  isCollapsed: boolean;
  currentPath: string;
  level?: number;
  expandedItems: string[];
  setExpandedItems: (items: string[]) => void;
  isMinimal?: boolean;
}) => {
  const Icon = item.icon;
  const isActive = currentPath === item.href;
  const hasChildren = !isMinimal && item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.href);
  const [height, setHeight] = useState<number | "auto">("auto");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(ref.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Find all parent items at the same level
  const findSiblingParents = (
    items: NavItem[],
    currentHref: string,
    currentLevel: number
  ): string[] => {
    const parentPaths: string[] = [];

    const traverse = (navItems: NavItem[], depth: number) => {
      navItems.forEach((navItem) => {
        if (
          depth === currentLevel &&
          navItem.children &&
          navItem.children.length > 0 &&
          navItem.href !== currentHref
        ) {
          parentPaths.push(navItem.href);
        }
        if (navItem.children) {
          traverse(navItem.children, depth + 1);
        }
      });
    };

    traverse(items, 0);
    return parentPaths;
  };

  const toggleExpand = (e: React.MouseEvent) => {
    if (isCollapsed) return;
    if (hasChildren) {
      e.preventDefault();

      if (isExpanded) {
        // If closing, just remove current item and its children
        setExpandedItems(expandedItems.filter((i) => !i.startsWith(item.href)));
      } else {
        // If opening, collapse all other parents at the same level and their children
        const allParentPaths = findSiblingParents(
          navigationGroups.flatMap((group) => group.items),
          item.href,
          level
        );
        const newExpandedItems = expandedItems.filter(
          (path) =>
            !allParentPaths.some((parentPath) => path.startsWith(parentPath))
        );
        setExpandedItems([...newExpandedItems, item.href]);
      }
    }
  };

  const variants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.6,
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.6,
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className={`relative ${level > 0 ? "ml-3" : ""}`}>
      <Link
        to={item.href}
        onClick={toggleExpand}
        className={`
          group flex items-center ${
            isCollapsed ? "justify-center px-2" : "px-3"
          } py-2 
          rounded-lg text-sm font-medium transition-all duration-200 
          ${hasChildren ? "cursor-pointer" : ""}
          ${
            level > 0
              ? "border-l-2 border-default-100 dark:border-default-100/20"
              : ""
          }
          ${
            isActive
              ? "text-primary bg-primary-50/50 dark:bg-primary-500/20 border-primary"
              : "text-default-600 hover:text-primary hover:bg-default-100 dark:hover:bg-default-50 hover:border-primary"
          }
        `}
      >
        <motion.div
          className="flex items-center w-full"
          initial={false}
          animate={isExpanded ? "open" : "closed"}
        >
          <Icon
            className={`
              ${isCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}
              flex-shrink-0 transition-colors duration-200
              ${
                isActive
                  ? "text-primary"
                  : "text-default-400 group-hover:text-primary"
              }
            `}
          />
          {!isCollapsed && (
            <div className="flex items-center justify-between flex-1">
              <span className="truncate">{item.title}</span>
              {hasChildren && (
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                    mass: 0.6,
                  }}
                  className="ml-2 flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-default-400" />
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </Link>

      {/* Only render children if not in minimal view */}
      {hasChildren && !isCollapsed && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              variants={variants}
              initial="closed"
              animate="open"
              exit="closed"
              className="overflow-hidden pl-4 mt-1"
            >
              <motion.div
                ref={ref}
                variants={{
                  open: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.07,
                      delayChildren: 0.1,
                    },
                  },
                  closed: {
                    opacity: 0,
                  },
                }}
                initial="closed"
                animate="open"
                exit="closed"
                className={`
                  space-y-1 relative 
                  ${
                    level === 0
                      ? "pl-3 border-l-2 border-default-200 dark:border-default-100/20"
                      : ""
                  }
                `}
              >
                {item.children?.map((child, index) => (
                  <motion.div
                    key={child.href}
                    variants={itemVariants}
                    className={`
                      relative
                      ${index !== item.children!.length - 1 ? "mb-1" : ""}
                      ${
                        level === 0
                          ? "hover:border-l-2 hover:border-primary"
                          : ""
                      }
                    `}
                  >
                    <NavItem
                      item={child}
                      isCollapsed={isCollapsed}
                      currentPath={currentPath}
                      level={level + 1}
                      expandedItems={expandedItems}
                      setExpandedItems={setExpandedItems}
                      isMinimal={isMinimal}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// Add a new function to search through navigation items
const searchNavigationItems = (
  items: NavItem[],
  searchTerm: string
): NavItem[] => {
  if (!searchTerm) return items;

  const searchTermLower = searchTerm.toLowerCase();

  return items.reduce((acc: NavItem[], item) => {
    // Check if current item matches
    const itemMatches = item.title.toLowerCase().includes(searchTermLower);

    // Deep clone the item to avoid mutating the original
    const clonedItem = { ...item };

    // If there are children, search through them
    if (item.children && item.children.length > 0) {
      const matchingChildren = searchNavigationItems(item.children, searchTerm);
      if (matchingChildren.length > 0) {
        clonedItem.children = matchingChildren;
        acc.push(clonedItem);
        return acc;
      }
    }

    // Add the item if it matches or has matching children
    if (itemMatches) {
      // If item matches but also has children, include all children
      if (item.children) {
        clonedItem.children = item.children;
      }
      acc.push(clonedItem);
    }

    return acc;
  }, []);
};

export default function Sidebar({
  isCollapsed,
  currentPath,
  isMobileOpen,
  onMobileClose,
  systemAdminRecord,
  isSuperAdmin,
  userPermissions,
  userType,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const allNavigationGroups = useMemo(() => {
    const groups = [...navigationGroups];

    // Find Overview group and update Mobile App href
    const overviewGroup = groups.find((group) => group.title === "Overview");
    if (overviewGroup) {
      const mobileAppItem = overviewGroup.items.find(
        (item) => item.title === "Mobile App"
      );
      if (mobileAppItem) {
        mobileAppItem.href = `/mobileApp/auth?systemId=${systemAdminRecord?.SystemId}`;
      }
    }

    return groups;
  }, [systemAdminRecord?.SystemId]);

  // Check if current path is allowed based on permissions
  const isPathAllowed = (path: string, allowedPaths: string[]) => {
    // Check if the exact path is allowed
    if (allowedPaths.includes(path)) return true;

    // Check if any parent path is allowed (which would grant access to all children)
    return allowedPaths.some((allowedPath: string) => {
      // Remove trailing slash if exists
      const cleanPath = path.replace(/\/$/, "");
      const cleanAllowedPath = allowedPath.replace(/\/$/, "");

      // Check if this path is a child of any allowed parent path
      return (
        cleanPath.startsWith(cleanAllowedPath + "/") ||
        cleanPath === cleanAllowedPath
      );
    });
  };

  useEffect(() => {
    if (!isSuperAdmin && userType && userPermissions?.permissionsData) {
      const allowedPaths = userPermissions.permissionsData.map(
        (p: any) => p.path
      );

      // Always allow these paths
      const alwaysAllowedPaths = ["/", "/403", "/login", "/logout"];
      if (
        !alwaysAllowedPaths.includes(location.pathname) &&
        !isPathAllowed(location.pathname, allowedPaths)
      ) {
        // Redirect to 404 if path is not allowed
        // navigate("/403");
      }
    }
  }, [location, userPermissions, isSuperAdmin, userType, navigate]);

  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sidebarExpandedGroups");
      return saved ? JSON.parse(saved) : ["Overview"];
    } catch {
      return ["Overview"];
    }
  });

  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sidebarExpandedItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isMinimalView, setIsMinimalView] = useState(false);
  const [lastExpandedState, setLastExpandedState] = useState<{
    groups: string[];
    items: string[];
  }>({ groups: ["Overview"], items: [] });

  // Function to get all possible paths
  const getAllPaths = (items: NavItem[]): string[] => {
    const paths: string[] = [];
    const traverse = (items: NavItem[]) => {
      items.forEach((item) => {
        paths.push(item.href);
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(items);
    return paths;
  };

  // Function to expand all items
  const expandAll = () => {
    const allGroups = navigationGroups.map((group) => group.title);
    const allPaths = navigationGroups.flatMap((group) =>
      getAllPaths(group.items)
    );
    setExpandedGroups(allGroups);
    setExpandedItems(allPaths);
  };

  // Function to collapse all items
  const collapseAll = () => {
    setExpandedGroups([]);
    setExpandedItems([]);
  };

  // Handle minimal view toggle with improved behavior
  const handleMinimalViewToggle = (checked: boolean) => {
    setIsMinimalView(checked);
    if (checked) {
      // Save current state before going minimal
      setLastExpandedState({
        groups: expandedGroups,
        items: expandedItems,
      });
      // In minimal view, expand all groups but remove all expanded items
      setExpandedGroups(navigationGroups.map((group) => group.title));
      setExpandedItems([]);
    } else {
      // Restore previous state when leaving minimal view
      if (!searchTerm) {
        setExpandedGroups(lastExpandedState.groups);
        setExpandedItems(lastExpandedState.items);
      }
    }
  };

  const filteredNavigationGroups = useMemo(() => {
    let groups;
    if (isSuperAdmin) {
      // SuperAdmin filtering logic remains the same
      groups = allNavigationGroups
        .filter((group) =>
          ["Overview", "Administrative", "Admin"].includes(group.title)
        )
        .map((group) => {
          if (group.title === "Overview") {
            return {
              ...group,
              items: group.items.filter((item) =>
                ["Dashboard", "Analytics", "Management Systems"].includes(
                  item.title
                )
              ),
            };
          }
          if (group.title === "Administrative") {
            return {
              ...group,
              items: group.items.filter((item) =>
                ["Roles"].includes(item.title)
              ),
            };
          }
          return group;
        });
    } else if (
      (userType === "ADMIN" || userType === "STAFF") &&
      userPermissions?.permissionsData
    ) {
      // Filter navigation based on exact permission paths
      groups = allNavigationGroups
        .map((group) => {
          const filteredItems = group.items.filter((item) => {
            // Get all allowed paths from permissions
            const allowedPaths = userPermissions.permissionsData.map(
              (p: any) => p.path
            );

            // For items with children, we need to check each child path
            if (item.children) {
              // If the parent path is allowed, include all children
              if (isPathAllowed(item.href, allowedPaths)) {
                return true;
              }

              const allowedChildren = item.children.filter((child) => {
                if (child.children) {
                  // For grandchildren, check parent path first
                  if (isPathAllowed(child.href, allowedPaths)) {
                    return true;
                  }

                  // Otherwise filter grandchildren
                  const allowedGrandchildren = child.children.filter(
                    (grandchild) => isPathAllowed(grandchild.href, allowedPaths)
                  );
                  if (allowedGrandchildren.length > 0) {
                    child.children = allowedGrandchildren;
                    return true;
                  }
                }
                return isPathAllowed(child.href, allowedPaths);
              });

              if (allowedChildren.length > 0) {
                item.children = allowedChildren;
                return true;
              }
              return false;
            }

            // For items without children, just check the path
            return isPathAllowed(item.href, allowedPaths);
          });

          return {
            ...group,
            items: filteredItems,
          };
        })
        .filter((group) => group.items.length > 0); // Remove empty groups
    } else {
      groups = [...allNavigationGroups];
    }

    if (searchTerm) {
      groups = groups
        .map((group) => ({
          ...group,
          items: searchNavigationItems(group.items, searchTerm),
        }))
        .filter((group) => group.items.length > 0);
    }

    if (isMinimalView) {
      groups = groups.map((group) => ({
        ...group,
        items: group.items
          .map((item) => ({
            ...item,
            children: undefined,
          }))
          .filter((item) => !item.href.includes("/new")),
      }));
    }

    return groups;
  }, [
    isSuperAdmin,
    userPermissions,
    userType,
    searchTerm,
    isMinimalView,
    allNavigationGroups,
  ]);

  // Update the renderNavigationItems function
  const renderNavigationItems = (items: NavItem[]) => {
    return items.map((item) => (
      <NavItem
        key={item.href}
        item={item}
        isCollapsed={isCollapsed}
        currentPath={currentPath}
        expandedItems={expandedItems}
        setExpandedItems={setExpandedItems}
        isMinimal={isMinimalView} // Pass the minimal view state
      />
    ));
  };

  const sidebarContent = (
    <motion.div
      className={`h-screen bg-content1 border-r border-divider flex flex-col transition-all duration-300 ease-in-out relative
        ${isCollapsed ? "w-20" : "w-64"}`}
      layout
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-divider">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-14 h-12 rounded-full object-cover bg-white p-1 shadow-md transition-all hover:scale-105"
          />

          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className="text-lg font-semibold text-primary"
              >
                relyNrelax
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Enhanced Search and Controls */}
      {!isCollapsed && (
        <div className="px-4 py-2 space-y-2 border-b border-divider">
          <Input
            size="sm"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="w-4 h-4 text-default-400" />}
            endContent={
              searchTerm && (
                <button
                  className="focus:outline-none"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="w-4 h-4 text-default-400" />
                </button>
              )
            }
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={expandAll}
                className="p-1"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={collapseAll}
                className="p-1"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-small text-default-600">Minimal</span>
              <Switch
                size="sm"
                checked={isMinimalView}
                onChange={(e) => handleMinimalViewToggle(e.target.checked)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Updated Navigation section */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2 scrollbar-thin scrollbar-thumb-default-300 dark:scrollbar-thumb-default-600 scrollbar-track-transparent">
        {filteredNavigationGroups.map((group) => {
          if (!group || !group.items || group.items.length === 0) return null;

          const isExpanded = expandedGroups.includes(group.title);

          return (
            <div key={group.title} className="px-2">
              {!isCollapsed && (
                <Button
                  onPress={() =>
                    setExpandedGroups((prev) =>
                      prev.includes(group.title)
                        ? prev.filter((t) => t !== group.title)
                        : [...prev, group.title]
                    )
                  }
                  className="w-full justify-between min-h-unit-10 px-3 py-1"
                  variant="light"
                  endContent={
                    <ChevronDown
                      className={`w-4 h-4 text-default-400 transition-transform duration-200
                        ${isExpanded ? "transform rotate-180" : ""}`}
                    />
                  }
                >
                  <span className="font-medium text-default-700 text-small">
                    {group.title}
                  </span>
                </Button>
              )}
              <AnimatePresence initial={false}>
                {(isCollapsed || isExpanded) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`mt-1 ${
                        isCollapsed ? "space-y-2" : "ml-2 space-y-1"
                      }`}
                    >
                      {renderNavigationItems(group.items)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="border-t border-divider p-4 bg-default-50">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-tiny font-medium text-white">
              {systemAdminRecord?.firstName?.[0] || ""}
              {systemAdminRecord?.lastName?.[0] || ""}
            </span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-default-700 truncate">
                  {`${systemAdminRecord?.firstName || ""} ${
                    systemAdminRecord?.lastName || ""
                  }`}
                </p>
                <p className="text-xs text-default-500 truncate">
                  {systemAdminRecord?.email || ""}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          {!isCollapsed && (
            <Button
              isIconOnly
              variant="light"
              size="sm"
              aria-label="User settings"
            >
              <Cog className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );

  // For mobile view
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return (
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return sidebarContent;
}
