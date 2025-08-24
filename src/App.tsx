import { Suspense, useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { PageNav } from "./PageNav";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components";
import { useEnvironment } from "@keycloak/keycloak-account-ui";
import { Menu, User, ChevronDown, Lock, LogOut } from "lucide-react";

function App() {
  const { environment, keycloak } = useEnvironment();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    keycloak.logout({});
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <ThemeProvider defaultTheme="light">
      {/* Root container with proper height */}
      <div className="h-screen flex flex-col bg-background">

        {/* Fixed Header */}
        <header className="flex-shrink-0 sticky top-0 z-30 border-b border-border-primary bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-hover-medium mr-3 md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold text-text-primary">
                  {environment.realm} | Account
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* User menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center p-2 text-text-tertiary hover:text-text-secondary focus:outline-none rounded-md"
                  >
                    <div className="w-8 h-8 bg-error-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-error-600" />
                    </div>
                    <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-hover-medium transition-colors"
                          role="menuitem"
                          onClick={() => {
                            closeDropdown();
                            navigate('personal-info');
                          }}
                        >
                          <User className="w-4 h-4 mr-3 text-text-tertiary" />
                          Profile
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-text-secondary hover:bg-hover-medium transition-colors"
                          role="menuitem"
                          onClick={() => {
                            closeDropdown();
                            navigate('security');
                          }}
                        >
                          <Lock className="w-4 h-4 mr-3 text-text-tertiary" />
                          Security
                        </button>
                        <hr className="my-1 border-border-primary" />
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                          role="menuitem"
                          onClick={() => {
                            closeDropdown();
                            handleSignOut();
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-3 text-error-500" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Takes remaining height and allows scrolling */}
        <div className="flex-1 flex min-h-0">
          {/* Container wrapper for both sidebar and main content */}
          <div className="w-full max-w-7xl mx-auto flex min-h-0">
            {/* Desktop Sidebar - Fixed width, starts from container left edge */}
            <aside className="hidden md:flex flex-shrink-0 w-64">
              <div className="w-full p-4">
                <PageNav />
              </div>
            </aside>

            {/* Mobile Navigation Overlay */}
            <>
              {/* Backdrop */}
              <div
                className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
                  }`}
                onClick={closeMobileMenu}
              />
              {/* Mobile Sidebar */}
              <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface shadow-lg md:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="h-full flex flex-col">
                  <div className="flex-shrink-0 p-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-text-primary">
                        {environment.realm}
                      </h2>
                      <button
                        onClick={closeMobileMenu}
                        className="p-2 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-hover-medium"
                        aria-label="Close navigation menu"
                      >
                        ×
                      </button>
                    </div>
                    <div className="border-b border-border-primary"></div>
                  </div>
                  <div className="flex-1 p-4 pt-0 overflow-y-auto min-h-0">
                    <PageNav onCloseMobileMenu={closeMobileMenu} />
                  </div>
                </div>
              </div>
            </>

            {/* Main Content - Scrollable area */}
            <main className="flex-1 min-w-0 overflow-y-auto main-content lg:px-24">
              <div className="px-4 sm:px-6 lg:px-8">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
                  </div>
                }>
                  <Outlet />
                </Suspense>
              </div>
            </main>
          </div>
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgb(var(--color-surface))',
              color: 'rgb(var(--color-text-secondary))',
              border: '1px solid rgb(var(--color-border-primary))',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: 'rgb(var(--color-success-600))',
                secondary: 'rgb(var(--color-text-inverse))',
              },
            },
            error: {
              iconTheme: {
                primary: 'rgb(var(--color-error-600))',
                secondary: 'rgb(var(--color-text-inverse))',
              },
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
