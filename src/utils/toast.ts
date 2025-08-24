import toast from 'react-hot-toast';

/**
 * Utility functions for consistent toast notifications across the application
 * Uses CSS custom properties for theme-aware colors
 */

// Helper function to get CSS custom property value
const getCSSVar = (property: string): string => {
    if (typeof window === 'undefined') return '';
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(property)
        .trim();
    return value ? `rgb(${value})` : '';
};

export const showSuccessToast = (message: string, options?: { duration?: number }) => {
    return toast.success(message, {
        duration: options?.duration || 4000,
        position: 'top-right',
        style: {
            background: getCSSVar('--color-success-50') || '#f0fdf4',
            color: getCSSVar('--color-success-800') || '#166534',
            border: `1px solid ${getCSSVar('--color-success-200') || '#bbf7d0'}`,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        iconTheme: {
            primary: getCSSVar('--color-success-600') || '#10b981',
            secondary: getCSSVar('--color-text-inverse') || '#fff',
        },
    });
};

export const showErrorToast = (message: string, options?: { duration?: number }) => {
    return toast.error(message, {
        duration: options?.duration || 5000,
        position: 'top-right',
        style: {
            background: getCSSVar('--color-error-50') || '#fef2f2',
            color: getCSSVar('--color-error-800') || '#991b1b',
            border: `1px solid ${getCSSVar('--color-error-200') || '#fecaca'}`,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        iconTheme: {
            primary: getCSSVar('--color-error-600') || '#ef4444',
            secondary: getCSSVar('--color-text-inverse') || '#fff',
        },
    });
};

export const showInfoToast = (message: string, options?: { duration?: number }) => {
    return toast(message, {
        duration: options?.duration || 4000,
        position: 'top-right',
        icon: 'ℹ️',
        style: {
            background: getCSSVar('--color-primary-50') || '#eff6ff',
            color: getCSSVar('--color-primary-800') || '#1e40af',
            border: `1px solid ${getCSSVar('--color-primary-200') || '#bfdbfe'}`,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
    });
};

export const showWarningToast = (message: string, options?: { duration?: number }) => {
    return toast(message, {
        duration: options?.duration || 4500,
        position: 'top-right',
        icon: '⚠️',
        style: {
            background: getCSSVar('--color-warning-50') || '#fffbeb',
            color: getCSSVar('--color-warning-800') || '#92400e',
            border: `1px solid ${getCSSVar('--color-warning-200') || '#fed7aa'}`,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
    });
};

export const showLoadingToast = (message: string) => {
    return toast.loading(message, {
        position: 'top-right',
        style: {
            background: getCSSVar('--color-surface-secondary') || '#f9fafb',
            color: getCSSVar('--color-text-secondary') || '#374151',
            border: `1px solid ${getCSSVar('--color-border-primary') || '#e5e7eb'}`,
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
    });
};

/**
 * Promise-based toast that shows loading, then success or error
 */
export const showPromiseToast = <T>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
    }
) => {
    return toast.promise(promise, messages, {
        position: 'top-right',
        style: {
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        success: {
            style: {
                background: getCSSVar('--color-success-50') || '#f0fdf4',
                color: getCSSVar('--color-success-800') || '#166534',
                border: `1px solid ${getCSSVar('--color-success-200') || '#bbf7d0'}`,
            },
            iconTheme: {
                primary: getCSSVar('--color-success-600') || '#10b981',
                secondary: getCSSVar('--color-text-inverse') || '#fff',
            },
        },
        error: {
            style: {
                background: getCSSVar('--color-error-50') || '#fef2f2',
                color: getCSSVar('--color-error-800') || '#991b1b',
                border: `1px solid ${getCSSVar('--color-error-200') || '#fecaca'}`,
            },
            iconTheme: {
                primary: getCSSVar('--color-error-600') || '#ef4444',
                secondary: getCSSVar('--color-text-inverse') || '#fff',
            },
        },
        loading: {
            style: {
                background: getCSSVar('--color-surface-secondary') || '#f9fafb',
                color: getCSSVar('--color-text-secondary') || '#374151',
                border: `1px solid ${getCSSVar('--color-border-primary') || '#e5e7eb'}`,
            },
        },
    });
};
