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
      <div className="min-h-screen bg-background">
        {/* Platform Header */}
        <header className="sticky top-0 z-30 border-b border-border-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                {/* Mobile Menu Button - Only visible on mobile */}
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-hover-medium mr-3 md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold text-text-primary">{environment.realm} | Account</h1>
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

        {/* Main Container */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-0">
          <div className="flex pt-4">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <PageNav />
              </div>
            </div>

            {/* Mobile Navigation - Only shown on mobile */}
            <div className="md:hidden">
              <PageNav
                isMobileMenuOpen={isMobileMenuOpen}
                onCloseMobileMenu={closeMobileMenu}
                realmName={environment.realm}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-[600px] sm:px-4 lg:px-24">
              <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
                </div>
              }>
                <Outlet />
              </Suspense>
            </div>
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
