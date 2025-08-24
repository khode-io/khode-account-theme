import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface DialogProps {
    /** Whether the dialog is open */
    isOpen: boolean;
    /** Function to call when dialog should be closed */
    onClose: () => void;
    /** Dialog title */
    title: string;
    /** Dialog content/message */
    children: React.ReactNode;
    /** Type of dialog - affects icon and colors */
    type?: 'confirm' | 'warning' | 'error' | 'info' | 'success';
    /** Text for the primary action button */
    confirmText?: string;
    /** Text for the cancel button */
    cancelText?: string;
    /** Function to call when confirm button is clicked */
    onConfirm?: () => void;
    /** Function to call when cancel button is clicked */
    onCancel?: () => void;
    /** Whether the confirm action is loading */
    loading?: boolean;
    /** Loading text to show when loading */
    loadingText?: string;
    /** Whether to show the cancel button */
    showCancel?: boolean;
    /** Size of the dialog */
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    title,
    children,
    type = 'confirm',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    loading = false,
    loadingText = 'Processing...',
    showCancel = true,
    size = 'md'
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    };

    // Icon based on type
    const getIcon = () => {
        switch (type) {
            case 'warning':
                return <AlertTriangle className="w-6 h-6 text-warning-600" />;
            case 'error':
                return <AlertCircle className="w-6 h-6 text-error-600" />;
            case 'success':
                return <CheckCircle className="w-6 h-6 text-success-600" />;
            case 'info':
                return <Info className="w-6 h-6 text-primary-600" />;
            case 'confirm':
            default:
                return <AlertTriangle className="w-6 h-6 text-warning-600" />;
        }
    };

    // Button variant based on type
    const getConfirmVariant = () => {
        switch (type) {
            case 'error':
            case 'warning':
                return 'danger' as const;
            case 'success':
                return 'primary' as const;
            case 'info':
            case 'confirm':
            default:
                return 'primary' as const;
        }
    };

    // Dialog size classes
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'max-w-sm';
            case 'md':
                return 'max-w-md';
            case 'lg':
                return 'max-w-lg';
            case 'xl':
                return 'max-w-xl';
            default:
                return 'max-w-md';
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={handleBackdropClick}
        >
            <div
                className={`
                    relative w-full ${getSizeClasses()} 
                    bg-surface rounded-2xl shadow-xl 
                    transform transition-all duration-200 ease-out
                    animate-in fade-in-0 zoom-in-95
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                    <div className="flex items-center space-x-3">
                        {getIcon()}
                        <h3 className="text-lg font-semibold text-text-primary">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-tertiary hover:text-text-secondary transition-colors p-1 rounded-lg hover:bg-hover-medium"
                        disabled={loading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    <div className="text-text-secondary mb-6">
                        {children}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                        {showCancel && (
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                {cancelText}
                            </Button>
                        )}
                        {onConfirm && (
                            <Button
                                variant={getConfirmVariant()}
                                onClick={handleConfirm}
                                loading={loading}
                                loadingText={loadingText}
                                className="w-full sm:w-auto"
                            >
                                {confirmText}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Convenience components for specific dialog types
export const ConfirmDialog: React.FC<Omit<DialogProps, 'type'>> = (props) => (
    <Dialog {...props} type="confirm" />
);

export const WarningDialog: React.FC<Omit<DialogProps, 'type'>> = (props) => (
    <Dialog {...props} type="warning" />
);

export const ErrorDialog: React.FC<Omit<DialogProps, 'type'>> = (props) => (
    <Dialog {...props} type="error" />
);

export const InfoDialog: React.FC<Omit<DialogProps, 'type'>> = (props) => (
    <Dialog {...props} type="info" />
);

export const SuccessDialog: React.FC<Omit<DialogProps, 'type'>> = (props) => (
    <Dialog {...props} type="success" />
);

export { Dialog };
