import { Suspense, useState, useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PageNav } from "./PageNav";
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
    <div className="min-h-screen bg-white">
      {/* Platform Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Mobile Menu Button - Only visible on mobile */}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-3 md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">{environment.realm} | Account</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* User menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center p-2 text-gray-400 hover:text-gray-600 focus:outline-none rounded-md"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-red-600" />
                  </div>
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                        onClick={() => {
                          closeDropdown();
                          navigate('personal-info');
                        }}
                      >
                        <User className="w-4 h-4 mr-3 text-gray-500" />
                        Profile
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                        onClick={() => {
                          closeDropdown();
                          navigate('security');
                        }}
                      >
                        <Lock className="w-4 h-4 mr-3 text-gray-500" />
                        Security
                      </button>
                      <hr className="my-1 border-gray-200" />
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        role="menuitem"
                        onClick={() => {
                          closeDropdown();
                          handleSignOut();
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-3 text-red-500" />
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
        <div className="flex py-4">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20 h-fit overflow-hidden">
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            }>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
