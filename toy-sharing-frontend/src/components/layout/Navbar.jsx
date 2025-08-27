import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  User,
  Heart,
  ShoppingBag,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Plus,
  MessageCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useNotifications } from "@/context/NotificationContext";
import { ROUTES } from "@/utils/constants";
import clsx from "clsx";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();
  const { currentTheme, isKidMode } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate(ROUTES.HOME);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: ROUTES.HOME, label: "Trang chủ", icon: "🏠" },
    { path: ROUTES.TOYS, label: "Đồ chơi", icon: "🧸" },
    { path: ROUTES.HOW_IT_WORKS, label: "Hướng dẫn", icon: "❓" },
    { path: ROUTES.ABOUT, label: "Giới thiệu", icon: "ℹ️" },
  ];

  const userMenuItems = [
    { path: ROUTES.PROFILE, label: "Hồ sơ", icon: User },
    { path: ROUTES.MY_TOYS, label: "Đồ chơi của tôi", icon: ShoppingBag },
    { path: ROUTES.BOOKINGS, label: "Đặt hàng", icon: Calendar },
    { path: ROUTES.FAVORITES, label: "Yêu thích", icon: Heart },
    { path: ROUTES.SETTINGS, label: "Cài đặt", icon: Settings },
  ];

  return (
    <nav
      className={clsx(
        "sticky top-0 z-40 w-full backdrop-blur-sm border-b transition-all duration-300",
        isKidMode()
          ? "bg-white/90 border-pink-200"
          : "bg-white/95 border-gray-200"
      )}
    >
      <div className="container-custom mx-auto w-4/5">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <motion.div
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🧸
            </motion.div>
            <div className="hidden sm:block">
              <h1
                className={clsx(
                  "text-xl lg:text-2xl font-bold",
                  isKidMode()
                    ? "text-gradient bg-gradient-to-r from-primary-500 to-secondary-500"
                    : "text-gray-900"
                )}
              >
                Toy Sharing
              </h1>
              <p className="text-xs text-gray-500 hidden lg:block">
                Chia sẻ niềm vui
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActivePath(link.path)
                    ? isKidMode()
                      ? "bg-primary-100 text-primary-700"
                      : "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search Button (Mobile) */}
            <button className="p-2 text-gray-600 hover:text-gray-900 lg:hidden">
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Add Toy Button */}
                <Button
                  size="small"
                  onClick={() => navigate(ROUTES.TOY_CREATE)}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="hidden sm:inline-flex"
                >
                  Thêm đồ chơi
                </Button>

                {/* Chat Button */}
                <Button
                  size="small"
                  variant={isActivePath(ROUTES.CHAT) ? "primary" : "ghost"}
                  onClick={() => navigate(ROUTES.CHAT)}
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                  className={`hidden sm:inline-flex ${
                    isActivePath(ROUTES.CHAT) ? "bg-blue-100 text-blue-700" : ""
                  }`}
                  title="Trò chuyện"
                >
                  Chat
                </Button>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 max-h-96 overflow-y-auto"
                      >
                        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            Thông báo
                          </h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
                        </div>

                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Chưa có thông báo nào</p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => markAsRead(notification.id)}
                              className={clsx(
                                "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                                !notification.read && "bg-primary-50"
                              )}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={clsx(
                                    "w-2 h-2 rounded-full mt-2",
                                    notification.read
                                      ? "bg-gray-300"
                                      : "bg-primary-500"
                                  )}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(
                                      notification.timestamp
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.profile?.firstName?.charAt(0) || "U"}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.profile?.firstName || "User"}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg py-2"
                      >
                        {userMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                {/* Auth Buttons */}
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Đăng nhập
                </Button>
                <Button size="small" onClick={() => navigate(ROUTES.REGISTER)}>
                  Đăng ký
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 lg:hidden"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActivePath(link.path)
                        ? isKidMode()
                          ? "bg-primary-100 text-primary-700"
                          : "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}

                {isAuthenticated && (
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      to={ROUTES.TOY_CREATE}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Thêm đồ chơi</span>
                    </Link>
                    <Link
                      to={ROUTES.CHAT}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Chat</span>
                    </Link>
                    <Link
                      to={ROUTES.FAVORITES}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Yêu thích</span>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
