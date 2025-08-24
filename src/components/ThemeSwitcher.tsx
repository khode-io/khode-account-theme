import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type ThemeMode } from '../contexts/ThemeContext';

interface ThemeSwitcherProps {
    /**
     * Size of the theme switcher
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Whether to show labels
     */
    showLabels?: boolean;

    /**
     * Layout orientation
     */
    orientation?: 'horizontal' | 'vertical';

    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Theme Switcher Component
 * 
 * Provides a UI for switching between light, dark, and auto themes.
 * Uses the ThemeContext to manage theme state.
 * 
 * @example
 * ```tsx
 * // Simple theme switcher
 * <ThemeSwitcher />
 * 
 * // With labels and custom size
 * <ThemeSwitcher size="lg" showLabels={true} />
 * 
 * // Vertical layout
 * <ThemeSwitcher orientation="vertical" showLabels={true} />
 * ```
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
    size = 'md',
    showLabels = false,
    orientation = 'horizontal',
    className = ''
}) => {
    const { theme, setTheme } = useTheme();

    const themes: Array<{ value: ThemeMode; label: string; icon: React.ReactNode }> = [
        { value: 'light', label: 'Light', icon: <Sun /> },
        { value: 'dark', label: 'Dark', icon: <Moon /> },
        { value: 'auto', label: 'Auto', icon: <Monitor /> },
    ];

    const sizeClasses = {
        sm: 'p-1.5 text-xs',
        md: 'p-2 text-sm',
        lg: 'p-3 text-base'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const containerClasses = `
    inline-flex rounded-lg bg-surface-secondary border border-border-primary
    ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}
    ${className}
  `.trim();

    return (
        <div className={containerClasses} role="radiogroup" aria-label="Theme selection">
            {themes.map(({ value, label, icon }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`
            ${sizeClasses[size]}
            flex items-center justify-center
            rounded-md transition-all duration-200
            focus:outline-none
            ${theme === value
                            ? 'bg-accent-primary text-text-inverse shadow-sm'
                            : 'text-text-tertiary hover:text-text-secondary hover:bg-hover-light'
                        }
            ${showLabels ? 'gap-2' : ''}
            ${orientation === 'vertical' ? 'w-full' : ''}
          `}
                    role="radio"
                    aria-checked={theme === value}
                    aria-label={`Switch to ${label.toLowerCase()} theme`}
                    title={`${label} theme`}
                >
                    <span className={iconSizes[size]}>
                        {icon}
                    </span>
                    {showLabels && (
                        <span className="font-medium">
                            {label}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

/**
 * Compact Theme Toggle
 * 
 * A simpler version that just toggles between light and dark themes.
 */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { setTheme, isDark } = useTheme();

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className={`
        p-2 rounded-md transition-all duration-200
        text-text-tertiary hover:text-text-secondary hover:bg-hover-light
        focus:outline-none
        ${className}
      `}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
            {isDark ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
};

export default ThemeSwitcher;
