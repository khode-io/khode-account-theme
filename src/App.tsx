import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { PageNav } from "./PageNav";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Header } from "./components";
import { X } from "lucide-react";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <ThemeProvider defaultTheme="light">
      {/* Root container with proper height */}
      <div className="h-screen flex flex-col bg-background">

        {/* Header Component */}
        <Header onToggleMobileMenu={toggleMobileMenu} />

        {/* Main Layout - Full width with sidebar positioned absolutely */}
        <div className="flex-1 relative bg-background min-h-0">
          {/* Desktop Sidebar - Positioned to align with header content */}
          <aside className="hidden md:block fixed left-0 top-16 bottom-0 z-20">
            {/* Calculate sidebar position to align with header content */}
            <div className="w-64 h-full" style={{
              marginLeft: `max(0px, calc((100vw - 1280px) / 2 + 1rem))`
            }}>
              <div className="h-full p-4">
                <PageNav />
              </div>
            </div>
          </aside>

          {/* Main Content Area - Full width with proper left margin for sidebar */}
          <main className="absolute inset-0 overflow-y-auto md:ml-64">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
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
                    My Account
                  </h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-hover-medium"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-6 h-6" />
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
