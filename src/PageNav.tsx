import { MouseEvent as ReactMouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { useHref, useLinkClickHandler, useLocation, useMatches } from "react-router-dom";
import { routes } from "./routes";
import {
  User,
  Link,
  Users,
  FolderOpen,
  Home,
  Lock,
  TabletSmartphone,
  X,
  LayoutGrid
} from "lucide-react";

// Navigation icons using Lucide React
const NavIcons = {
  "personal-info": <User className="w-5 h-5" />,
  "device-activity": <TabletSmartphone className="w-5 h-5" />,
  "linked-accounts": <Link className="w-5 h-5" />,
  "security": <Lock className="w-5 h-5" />,
  "applications": <LayoutGrid className="w-5 h-5" />,
  "groups": <Users className="w-5 h-5" />,
  "resources": <FolderOpen className="w-5 h-5" />,
  "myPage": <Home className="w-5 h-5" />,
};

type NavLinkProps = {
  path: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

const NavLink = ({ path, children, icon }: NavLinkProps) => {
  const location = useLocation();
  const matches = useMatches();
  const href = useHref(path);
  const handleClick = useLinkClickHandler(path);

  // More robust active state detection using React Router's match system
  const isActive = matches.some(match => {
    // Check if the current route matches this path
    const routePath = match.pathname;

    // Handle index route (myPage)
    if (path === 'myPage') {
      return routePath === match.params?.['*'] ||
        routePath === '/' ||
        match.id === 'routes/myPage' ||
        (match as any)?.route?.index === true;
    }

    // Handle personal-info as regular route and index route
    if (path === 'personal-info') {
      return routePath.endsWith('/personal-info') ||
        routePath.includes('personal-info') ||
        (match as any)?.route?.index === true;
    }

    // Handle nested paths like account-security/signingIn
    if (path.includes('/')) {
      return routePath.includes(path) ||
        routePath.endsWith(path) ||
        match.pathname.endsWith(path);
    }

    // Handle simple paths
    return routePath.includes(path) ||
      routePath.endsWith(`/${path}`) ||
      routePath === path;
  }) || location.pathname.includes(path);

  return (
    <a
      href={href}
      onClick={(e) => handleClick(e as unknown as ReactMouseEvent<HTMLAnchorElement, MouseEvent>)}
      className={`
        flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
        ${isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      <span className={`mr-3 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
        {icon}
      </span>
      {children}
    </a>
  );
};

const getNavIcon = (path: string) => {
  // Handle direct path mapping first
  if (NavIcons[path as keyof typeof NavIcons]) {
    return NavIcons[path as keyof typeof NavIcons];
  }

  // Then handle nested paths
  const key = path.includes('/') ? path.split('/').pop() : path;
  return NavIcons[key as keyof typeof NavIcons] || NavIcons["personal-info"];
};

const getNavLabel = (path: string, t: (key: string) => string) => {
  const labels: Record<string, string> = {
    "personal-info": 'Personal Info',
    "security": 'Security',
    "device-activity": 'Device Activity',
    "linked-accounts": 'Linked Accounts',
    "applications": 'Applications',
    "groups": 'Groups',
    "resources": 'Resources',
    "myPage": 'My Page',
  };

  const key = path.includes('/') ? path.split('/').pop() : path;
  return labels[key || ''] || labels[path] || t(path?.substring(path.lastIndexOf("/") + 1, path.length) || '');
};

interface PageNavProps {
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
  realmName?: string;
}

export const PageNav = ({ isMobileMenuOpen = false, onCloseMobileMenu, realmName }: PageNavProps) => {
  const { t } = useTranslation();

  // Get all navigation items from routes (keeping original items)
  const navigationItems = routes[0].children?.filter((r) => r.path) || [];

  // Close mobile menu when clicking outside or on a nav item
  const closeMobileMenu = () => onCloseMobileMenu?.();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <nav className={`
        transition-transform duration-300 ease-in-out overflow-hidden
        md:relative md:translate-x-0 md:block md:h-[calc(100vh-6.5rem)] md:p-4
        ${isMobileMenuOpen
          ? 'fixed inset-y-0 left-0 z-50 w-64 bg-white translate-x-0 shadow-lg h-screen p-4'
          : 'fixed inset-y-0 left-0 z-50 w-64 bg-white -translate-x-full md:translate-x-0 h-screen p-4'
        }
      `}>
        {/* Mobile header with realm name and close button */}
        {isMobileMenuOpen && (
          <div className="flex items-center justify-between mb-6 md:hidden px-3">
            <div className="flex-1 flex justify-center">
              {realmName && (
                <h2 className="text-lg font-semibold text-gray-900">{realmName}</h2>
              )}
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ml-2"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Separator line */}
        {isMobileMenuOpen && realmName && (
          <div className="border-b border-gray-200 mb-4 md:hidden"></div>
        )}

        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="space-y-1 pr-1">
              {navigationItems.map(({ path }) => (
                <div key={path} onClick={closeMobileMenu}>
                  <NavLink
                    path={path!}
                    icon={getNavIcon(path!)}
                  >
                    {getNavLabel(path!, t)}
                  </NavLink>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex-shrink-0 pt-4 border-t border-gray-200 mt-2">
            <div className="flex justify-evenly text-xs text-gray-500">
              <a href="#" className="hover:text-gray-700 transition-colors py-1">Privacy</a>
              <a href="#" className="hover:text-gray-700 transition-colors py-1">Terms</a>
              <a href="#" className="hover:text-gray-700 transition-colors py-1">Help</a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

