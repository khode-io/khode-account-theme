import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = 'light'
}) => {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        // Try to get theme from localStorage first
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('khode-theme') as ThemeMode;
            return stored || defaultTheme;
        }
        return defaultTheme;
    });

    const [isDark, setIsDark] = useState(false);

    // Update document theme attribute and localStorage
    useEffect(() => {
        const root = document.documentElement;

        // Save to localStorage
        localStorage.setItem('khode-theme', theme);

        // Apply theme to document
        root.setAttribute('data-theme', theme);

        // Determine if dark mode should be active
        const shouldBeDark = theme === 'dark' ||
            (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        setIsDark(shouldBeDark);
    }, [theme]);

    // Listen for system theme changes when in auto mode
    useEffect(() => {
        if (theme !== 'auto') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            setIsDark(mediaQuery.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const value: ThemeContextType = {
        theme,
        setTheme,
        isDark,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Theme utilities for easy color access
export const themeColors = {
    // Primary colors
    primary: {
        50: 'rgb(var(--color-primary-50))',
        100: 'rgb(var(--color-primary-100))',
        200: 'rgb(var(--color-primary-200))',
        300: 'rgb(var(--color-primary-300))',
        400: 'rgb(var(--color-primary-400))',
        500: 'rgb(var(--color-primary-500))',
        600: 'rgb(var(--color-primary-600))',
        700: 'rgb(var(--color-primary-700))',
        800: 'rgb(var(--color-primary-800))',
        900: 'rgb(var(--color-primary-900))',
        950: 'rgb(var(--color-primary-950))',
    },

    // Semantic colors
    background: 'rgb(var(--color-background))',
    surface: 'rgb(var(--color-surface))',
    text: {
        primary: 'rgb(var(--color-text-primary))',
        secondary: 'rgb(var(--color-text-secondary))',
        tertiary: 'rgb(var(--color-text-tertiary))',
    },
    border: {
        primary: 'rgb(var(--color-border-primary))',
        secondary: 'rgb(var(--color-border-secondary))',
        focus: 'rgb(var(--color-border-focus))',
    },
    accent: {
        primary: 'rgb(var(--color-accent-primary))',
        primaryHover: 'rgb(var(--color-accent-primary-hover))',
    },
    status: {
        success: 'rgb(var(--color-status-success))',
        warning: 'rgb(var(--color-status-warning))',
        error: 'rgb(var(--color-status-error))',
        info: 'rgb(var(--color-status-info))',
    },
};

// Hook for getting CSS custom property values
export const useThemeColor = (colorPath: string): string => {
    const [color, setColor] = useState('');

    useEffect(() => {
        const updateColor = () => {
            const value = getComputedStyle(document.documentElement)
                .getPropertyValue(`--color-${colorPath}`)
                .trim();
            setColor(value ? `rgb(${value})` : '');
        };

        updateColor();

        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    updateColor();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => observer.disconnect();
    }, [colorPath]);

    return color;
};
