import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeSwitcher";
import { useEnvironment } from "@keycloak/keycloak-account-ui";
import { Menu, User, ChevronDown, Lock, LogOut } from "lucide-react";

interface HeaderProps {
    onToggleMobileMenu: () => void;
}

export const Header = ({ onToggleMobileMenu }: HeaderProps) => {
    const { keycloak } = useEnvironment();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSignOut = () => {
        keycloak.logout({});
    };

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
        <header className="flex-shrink-0 sticky top-0 z-30 border-b border-border-primary bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={onToggleMobileMenu}
                            className="p-2 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-hover-medium mr-3 md:hidden"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center lg:ml-2.5">
                            {/* Company Logo */}
                            <img
                                src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                                alt="Google Logo"
                                className="w-16 h-16 mr-3 object-contain"
                            />
                            <h1 className="text-lg font-semibold text-text-primary mb-1">
                                Account
                            </h1>
                        </div>
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
    );
};
