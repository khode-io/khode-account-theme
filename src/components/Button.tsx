import React from 'react';

export interface ButtonProps {
    /**
     * The button content (text, icons, etc.)
     */
    children: React.ReactNode;

    /**
     * Button variant/style
     */
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';

    /**
     * Button size
     */
    size?: 'sm' | 'md' | 'lg';

    /**
     * Button type
     */
    type?: 'button' | 'submit' | 'reset';

    /**
     * Whether the button is disabled
     */
    disabled?: boolean;

    /**
     * Whether the button is in a loading state
     */
    loading?: boolean;

    /**
     * Loading text to show when loading is true
     */
    loadingText?: string;

    /**
     * Icon to display before the text
     */
    leftIcon?: React.ReactNode;

    /**
     * Icon to display after the text
     */
    rightIcon?: React.ReactNode;

    /**
     * Whether the button should take full width
     */
    fullWidth?: boolean;

    /**
 * Additional CSS classes
 */
    className?: string;

    /**
     * Title attribute for tooltip
     */
    title?: string;

    /**
     * Click handler
     */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

    /**
     * Focus handler
     */
    onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;

    /**
     * Blur handler
     */
    onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}

/**
 * Button component with modern styling using Tailwind CSS
 * 
 * Features:
 * - Multiple variants (primary, secondary, danger, outline, ghost)
 * - Different sizes (sm, md, lg)
 * - Loading states with spinner
 * - Icon support (left and right)
 * - Disabled states
 * - Full width option
 * - Accessible markup
 * - Smooth transitions and hover effects
 * 
 * @example
 * ```tsx
 * <Button variant="primary" loading={isLoading} loadingText="Saving...">
 *   Save Changes
 * </Button>
 * 
 * <Button variant="danger" leftIcon={<TrashIcon />}>
 *   Delete
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    title,
    onClick,
    onFocus,
    onBlur
}) => {
    // Base button classes
    const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `.trim();

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    // Variant classes using theme colors
    const variantClasses = {
        primary: `
      bg-accent-primary text-text-inverse border border-transparent
      hover:bg-accent-primary-hover focus:ring-accent-primary
      disabled:hover:bg-accent-primary
    `.trim(),
        secondary: `
      bg-surface-secondary text-text-primary border border-border-primary
      hover:bg-surface-tertiary focus:ring-accent-secondary
      disabled:hover:bg-surface-secondary
    `.trim(),
        danger: `
      bg-error-600 text-text-inverse border border-transparent
      hover:bg-error-700 focus:ring-error-500
      disabled:hover:bg-error-600
    `.trim(),
        outline: `
      bg-surface text-text-secondary border border-border-primary
      hover:bg-hover-light focus:ring-accent-primary
      disabled:hover:bg-surface
    `.trim(),
        ghost: `
      bg-transparent text-text-secondary border border-transparent
      hover:bg-hover-medium focus:ring-accent-secondary
      disabled:hover:bg-transparent
    `.trim()
    };

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    // Combine all classes
    const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClasses}
    ${className}
  `.trim();

    // Loading spinner component
    const LoadingSpinner = () => (
        <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    // Button content
    const buttonContent = loading ? (
        <>
            <LoadingSpinner />
            {loadingText || children}
        </>
    ) : (
        <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
    );

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={buttonClasses}
            title={title}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            {buttonContent}
        </button>
    );
};

export default Button;
