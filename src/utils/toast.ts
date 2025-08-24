import toast from 'react-hot-toast';

/**
 * Utility functions for consistent toast notifications across the application
 */

export const showSuccessToast = (message: string, options?: { duration?: number }) => {
    return toast.success(message, {
        duration: options?.duration || 4000,
        position: 'top-right',
        style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
        },
    });
};

export const showErrorToast = (message: string, options?: { duration?: number }) => {
    return toast.error(message, {
        duration: options?.duration || 5000,
        position: 'top-right',
        style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
        },
    });
};

export const showInfoToast = (message: string, options?: { duration?: number }) => {
    return toast(message, {
        duration: options?.duration || 4000,
        position: 'top-right',
        icon: 'ℹ️',
        style: {
            background: '#eff6ff',
            color: '#1e40af',
            border: '1px solid #bfdbfe',
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
            background: '#fffbeb',
            color: '#92400e',
            border: '1px solid #fed7aa',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
    });
};

export const showLoadingToast = (message: string) => {
    return toast.loading(message, {
        position: 'top-right',
        style: {
            background: '#f9fafb',
            color: '#374151',
            border: '1px solid #e5e7eb',
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
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
            },
            iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
            },
        },
        error: {
            style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
            },
            iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
            },
        },
        loading: {
            style: {
                background: '#f9fafb',
                color: '#374151',
                border: '1px solid #e5e7eb',
            },
        },
    });
};
