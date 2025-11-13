import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Mail, Edit3, BookOpen, LogOut, Menu, X, User, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

// Festival detection function
const getCurrentFestival = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  if ((month === 10 && day >= 20) || (month === 11 && day <= 15)) {
    return { name: "Diwali", colors: { primary: "#FF9933", secondary: "#FFD700", accent: "#FF6B35" } };
  }
  if (month === 3 && day >= 1 && day <= 20) {
    return { name: "Holi", colors: { primary: "#EC4899", secondary: "#A855F7", accent: "#3B82F6" } };
  }
  if ((month === 9 && day >= 20) || (month === 10 && day <= 15)) {
    return { name: "Durga Puja", colors: { primary: "#DC2626", secondary: "#F59E0B", accent: "#F97316" } };
  }
  if (month === 8 && day === 15) {
    return { name: "Independence Day", colors: { primary: "#FF9933", secondary: "#FFFFFF", accent: "#138808" } };
  }
  if (month === 1 && day === 26) {
    return { name: "Republic Day", colors: { primary: "#FF9933", secondary: "#FFFFFF", accent: "#138808" } };
  }
  if (month === 12 && day >= 20 && day <= 31) {
    return { name: "Christmas", colors: { primary: "#DC2626", secondary: "#16A34A", accent: "#B91C1C" } };
  }
  
  return null;
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("auto");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      applyTheme(userData.theme_preference || "auto");
    } catch (error) {
      setUser(null);
      applyTheme("auto");
    }
  };

  const applyTheme = (themePref) => {
    setActiveTheme(themePref);
    
    const root = document.documentElement;
    
    if (themePref === "dark") {
      root.style.setProperty('--bg-primary', '#1F2937');
      root.style.setProperty('--bg-secondary', '#111827');
      root.style.setProperty('--bg-card', '#374151');
      root.style.setProperty('--text-primary', '#F9FAFB');
      root.style.setProperty('--text-secondary', '#E5E7EB');
      root.style.setProperty('--text-muted', '#9CA3AF');
      root.style.setProperty('--accent-from', '#F97316');
      root.style.setProperty('--accent-to', '#EC4899');
      root.style.setProperty('--border-color', '#4B5563');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('festive-theme', 'light-theme');
    } else if (themePref === "festive") {
      root.style.setProperty('--bg-primary', '#FFF7ED');
      root.style.setProperty('--bg-secondary', '#FFEDD5');
      root.style.setProperty('--bg-card', '#FFFFFF');
      root.style.setProperty('--text-primary', '#1F2937');
      root.style.setProperty('--text-secondary', '#374151');
      root.style.setProperty('--text-muted', '#6B7280');
      root.style.setProperty('--accent-from', '#F97316');
      root.style.setProperty('--accent-to', '#EC4899');
      root.style.setProperty('--border-color', '#FED7AA');
      document.body.classList.add('festive-theme');
      document.body.classList.remove('dark-theme', 'light-theme');
    } else if (themePref === "auto") {
      const festival = getCurrentFestival();
      if (festival) {
        root.style.setProperty('--bg-primary', '#FFF7ED');
        root.style.setProperty('--bg-secondary', '#FFEDD5');
        root.style.setProperty('--bg-card', '#FFFFFF');
        root.style.setProperty('--text-primary', '#1F2937');
        root.style.setProperty('--text-secondary', '#374151');
        root.style.setProperty('--text-muted', '#6B7280');
        root.style.setProperty('--accent-from', festival.colors.primary);
        root.style.setProperty('--accent-to', festival.colors.accent);
        root.style.setProperty('--border-color', '#FED7AA');
        document.body.classList.add('festive-theme');
        document.body.classList.remove('dark-theme', 'light-theme');
      } else {
        root.style.setProperty('--bg-primary', '#FFFBF5');
        root.style.setProperty('--bg-secondary', '#FFF7ED');
        root.style.setProperty('--bg-card', '#FFFFFF');
        root.style.setProperty('--text-primary', '#1F2937');
        root.style.setProperty('--text-secondary', '#374151');
        root.style.setProperty('--text-muted', '#6B7280');
        root.style.setProperty('--accent-from', '#F97316');
        root.style.setProperty('--accent-to', '#EC4899');
        root.style.setProperty('--border-color', '#FED7AA');
        document.body.classList.add('light-theme');
        document.body.classList.remove('festive-theme', 'dark-theme');
      }
    } else {
      // Light theme (default)
      root.style.setProperty('--bg-primary', '#FFFBF5');
      root.style.setProperty('--bg-secondary', '#FFF7ED');
      root.style.setProperty('--bg-card', '#FFFFFF');
      root.style.setProperty('--text-primary', '#1F2937');
      root.style.setProperty('--text-secondary', '#374151');
      root.style.setProperty('--text-muted', '#6B7280');
      root.style.setProperty('--accent-from', '#F97316');
      root.style.setProperty('--accent-to', '#EC4899');
      root.style.setProperty('--border-color', '#FED7AA');
      document.body.classList.add('light-theme');
      document.body.classList.remove('festive-theme', 'dark-theme');
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
    setUser(null);
  };

  const isModerator = user?.email === "alt.f4workablesolutions@gmail.com";

  const navigationItems = [
    { title: "Home", url: createPageUrl("Home"), icon: Home },
    { title: "Forum", url: createPageUrl("Forum"), icon: BookOpen },
    { title: "Contact Us", url: createPageUrl("Contact"), icon: Mail },
    { title: "Write a Blog", url: createPageUrl("Write"), icon: Edit3 },
  ];

  return (
    <div className="min-h-screen themed-app">
      <style>{`
        :root {
          --bg-primary: #FFFBF5;
          --bg-secondary: #FFF7ED;
          --bg-card: #FFFFFF;
          --text-primary: #1F2937;
          --text-secondary: #374151;
          --text-muted: #6B7280;
          --accent-from: #F97316;
          --accent-to: #EC4899;
          --border-color: #FED7AA;
        }

        .themed-app {
          background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          color: var(--text-primary);
          min-height: 100vh;
        }

        .dark-theme {
          background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
        }

        .dark-theme .bg-white,
        .dark-theme [class*="bg-white"] {
          background: var(--bg-card) !important;
          color: var(--text-primary) !important;
        }

        .dark-theme .bg-gray-50,
        .dark-theme .bg-gray-100,
        .dark-theme .bg-orange-50,
        .dark-theme .bg-pink-50,
        .dark-theme .bg-red-50,
        .dark-theme .bg-green-50,
        .dark-theme .bg-blue-50,
        .dark-theme .bg-purple-50,
        .dark-theme .bg-gradient-to-br,
        .dark-theme [class*="bg-gradient-"] {
          background: #374151 !important;
          color: var(--text-primary) !important;
        }

        .dark-theme .text-gray-900,
        .dark-theme .text-gray-800 {
          color: var(--text-primary) !important;
        }

        .dark-theme .text-gray-700,
        .dark-theme .text-gray-600 {
          color: var(--text-secondary) !important;
        }

        .dark-theme .text-gray-500,
        .dark-theme .text-gray-400 {
          color: var(--text-muted) !important;
        }

        .dark-theme input,
        .dark-theme textarea,
        .dark-theme select,
        .dark-theme button[class*="outline"] {
          background: #374151 !important;
          color: var(--text-primary) !important;
          border-color: var(--border-color) !important;
        }

        .light-theme {
          background: linear-gradient(135deg, #FFFBF5 0%, #FFF7ED 100%);
        }

        .light-theme .bg-white {
          background: #FFFFFF !important;
          color: #1F2937 !important;
        }

        .light-theme .text-gray-900 {
          color: #1F2937 !important;
        }

        .light-theme .text-gray-700 {
          color: #374151 !important;
        }

        .light-theme .text-gray-600 {
          color: #4B5563 !important;
        }

        .festive-theme {
          background: linear-gradient(135deg, 
            #FFF7ED 0%, 
            #FFEDD5 25%,
            #FED7AA 50%,
            #FFEDD5 75%,
            #FFF7ED 100%
          );
          animation: festiveGradient 10s ease infinite;
          background-size: 200% 200%;
        }

        @keyframes festiveGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .festive-theme .bg-white {
          background: #FFFFFF !important;
          color: #1F2937 !important;
        }

        .festive-theme .text-gray-900 {
          color: #1F2937 !important;
        }

        .accent-gradient {
          background: linear-gradient(to right, var(--accent-from), var(--accent-to));
        }

        .accent-text {
          background: linear-gradient(to right, var(--accent-from), var(--accent-to));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .lotus-pattern {
          background-image: radial-gradient(circle at 20% 30%, rgba(255, 153, 51, 0.03) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.03) 0%, transparent 50%);
        }

        .themed-header {
          background: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(12px);
        }

        .dark-theme .themed-header {
          background: rgba(31, 41, 55, 0.8) !important;
        }
      `}</style>

      <header className="sticky top-0 z-50 themed-header border-b shadow-sm" style={{ borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-full flex items-center justify-center"
              >
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690cadaa994f43d665ce990e/a9f298972_download-removebg-preview1.png" 
                  alt="Jaipuria Blogs Logo" 
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold accent-text">
                  Jaipuria Blogs
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Community Stories</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.url
                      ? "accent-gradient text-white shadow-md"
                      : "hover:bg-opacity-10"
                  }`}
                  style={location.pathname !== item.url ? { color: 'var(--text-secondary)' } : {}}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {isModerator && (
                    <Link to={createPageUrl("Moderation")} className="hidden md:block">
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Moderate
                      </Button>
                    </Link>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <div className="w-8 h-8 accent-gradient rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-3 py-2 border-b">
                        <p className="font-medium text-sm">{user.full_name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("MyPosts")} className="cursor-pointer">
                          My Posts
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Profile")} className="cursor-pointer">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Settings")} className="cursor-pointer">
                          🎨 Theme Settings
                        </Link>
                      </DropdownMenuItem>
                      {isModerator && (
                        <DropdownMenuItem asChild>
                          <Link to={createPageUrl("Moderation")} className="cursor-pointer md:hidden">
                            <Shield className="w-4 h-4 mr-2" />
                            Moderation
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
                  className="accent-gradient text-white"
                >
                  Sign In
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
            >
              <nav className="px-4 py-3 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      location.pathname === item.url
                        ? "accent-gradient text-white"
                        : ""
                    }`}
                    style={location.pathname !== item.url ? { color: 'var(--text-secondary)' } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
                {isModerator && (
                  <Link
                    to={createPageUrl("Moderation")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Moderation</span>
                  </Link>
                )}
                {user && (
                  <Link
                    to={createPageUrl("Settings")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="text-lg">🎨</span>
                    <span className="font-medium">Theme Settings</span>
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="lotus-pattern">
        {children}
      </main>

      <footer className="bg-gradient-to-r from-purple-900 via-orange-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690cadaa994f43d665ce990e/a9f298972_download-removebg-preview1.png" 
                  alt="Logo" 
                  className="w-10 h-10"
                />
                <h3 className="text-2xl font-bold">Jaipuria Blogs</h3>
              </div>
              <p className="text-orange-200 text-sm leading-relaxed mb-2">
                Conscious Transformation
              </p>
              <p className="text-orange-200 text-sm leading-relaxed italic">
                From Ignorance to Knowledge
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl("Home")} className="text-orange-200 hover:text-white transition-colors">Home</Link></li>
                <li><Link to={createPageUrl("Forum")} className="text-orange-200 hover:text-white transition-colors">Forum</Link></li>
                <li><Link to={createPageUrl("Contact")} className="text-orange-200 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                  𝕏
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                  📷
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                  in
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-orange-200">
            <p>© 2025 Jaipuria Blogs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
