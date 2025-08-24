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
  onClick?: () => void;
};

const NavLink = ({ path, children, icon, onClick }: NavLinkProps) => {
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
      onClick={(e) => {
        handleClick(e as unknown as ReactMouseEvent<HTMLAnchorElement, MouseEvent>);
        onClick?.();
      }}
      className={`
        flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
        ${isActive
          ? 'bg-active-light text-accent-primary'
          : 'text-text-secondary hover:text-text-primary hover:bg-hover-light'
        }
      `}
    >
      <span className={`mr-3 transition-colors ${isActive ? 'text-accent-primary' : 'text-text-tertiary group-hover:text-text-secondary'}`}>
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
  onCloseMobileMenu?: () => void;
}

export const PageNav = ({ onCloseMobileMenu }: PageNavProps) => {
  const { t } = useTranslation();

  // Get all navigation items from routes
  const navigationItems = routes[0].children?.filter((r) => r.path) || [];

  return (
    <nav className="h-full flex flex-col">
      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-1 p-1">
          {navigationItems.map(({ path }) => (
            <NavLink
              key={path}
              path={path!}
              icon={getNavIcon(path!)}
              onClick={onCloseMobileMenu}
            >
              {getNavLabel(path!, t)}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer Links - Always show */}
      <div className="flex-shrink-0 pt-4 border-t border-border-primary">
        {/* Desktop: Row layout */}
        <div className="hidden md:flex justify-between text-xs text-text-tertiary px-3">
          <a href="#" className="hover:text-text-secondary transition-colors py-1">
            Privacy
          </a>
          <a href="#" className="hover:text-text-secondary transition-colors py-1">
            Terms
          </a>
          <a href="#" className="hover:text-text-secondary transition-colors py-1">
            Help
          </a>
        </div>

        {/* Mobile: Column layout */}
        <div className="md:hidden space-y-2 px-3">
          <a href="#" className="block text-xs text-text-tertiary hover:text-text-secondary transition-colors py-1">
            Privacy
          </a>
          <a href="#" className="block text-xs text-text-tertiary hover:text-text-secondary transition-colors py-1">
            Terms
          </a>
          <a href="#" className="block text-xs text-text-tertiary hover:text-text-secondary transition-colors py-1">
            Help
          </a>
        </div>
      </div>
    </nav>
  );
};
