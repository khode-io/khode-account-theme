import React from 'react';

export interface TextFieldProps {
    /**
     * The label text for the field
     */
    label?: string;

    /**
     * The input type (text, email, password, etc.)
     */
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'search';

    /**
     * The input id and name
     */
    id?: string;

    /**
     * The input name attribute
     */
    name?: string;

    /**
     * The current value
     */
    value?: string;

    /**
     * Placeholder text
     */
    placeholder?: string;

    /**
     * Whether the field is required
     */
    required?: boolean;

    /**
     * Whether the field is read-only
     */
    readOnly?: boolean;

    /**
     * Whether the field is disabled
     */
    disabled?: boolean;

    /**
     * Help text to display below the input
     */
    helpText?: string;

    /**
     * Error message to display
     */
    error?: string;

    /**
     * Additional CSS classes for the input
     */
    className?: string;

    /**
     * Additional CSS classes for the container
     */
    containerClassName?: string;

    /**
     * Layout variant - 'stacked' (label above input) or 'horizontal' (label beside input)
     */
    layout?: 'stacked' | 'horizontal';

    /**
     * Change handler
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

    /**
     * Blur handler
     */
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

    /**
     * Focus handler
     */
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * TextField component with modern styling using Tailwind CSS
 * 
 * Features:
 * - Clean, modern design with rounded corners
 * - Support for different input types
 * - Required field indicators
 * - Read-only and disabled states
 * - Error states with validation styling
 * - Help text support
 * - Horizontal and stacked layouts
 * - Accessible markup with proper labeling
 * 
 * @example
 * ```tsx
 * <TextField
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   required
 *   helpText="We'll never share your email"
 * />
 * ```
 */
export const TextField: React.FC<TextFieldProps> = ({
    label,
    type = 'text',
    id,
    name,
    value = '',
    placeholder,
    required = false,
    readOnly = false,
    disabled = false,
    helpText,
    error,
    className = '',
    containerClassName = '',
    layout = 'horizontal',
    onChange,
    onBlur,
    onFocus
}) => {
    // Generate id if not provided
    const fieldId = id || name || `field-${Math.random().toString(36).substr(2, 9)}`;

    // Base input classes
    const baseInputClasses = `
    w-full px-3 py-2 border rounded-xl shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition-colors bg-white text-gray-900
  `.trim();

    // State-specific classes
    const stateClasses = error
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : readOnly || disabled
            ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-300'
            : 'border-gray-300 hover:border-gray-400';

    const inputClasses = `${baseInputClasses} ${stateClasses} ${className}`;

    // Container classes based on layout
    const containerClasses = layout === 'horizontal'
        ? `grid grid-cols-1 md:grid-cols-3 gap-4 items-start ${containerClassName}`
        : `space-y-2 ${containerClassName}`;

    const labelClasses = layout === 'horizontal'
        ? 'md:col-span-1 block text-sm font-medium text-gray-700'
        : 'block text-sm font-medium text-gray-700';

    const inputContainerClasses = layout === 'horizontal'
        ? 'md:col-span-2'
        : '';

    return (
        <div className={containerClasses}>
            {/* Label */}
            {label && (
                <div className={layout === 'horizontal' ? 'md:col-span-1' : ''}>
                    <label htmlFor={fieldId} className={labelClasses}>
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                </div>
            )}

            {/* Input Container */}
            <div className={inputContainerClasses}>
                <input
                    type={type}
                    id={fieldId}
                    name={name || fieldId}
                    value={value}
                    placeholder={placeholder}
                    required={required}
                    readOnly={readOnly}
                    disabled={disabled}
                    className={inputClasses}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    aria-describedby={
                        (helpText || error) ? `${fieldId}-help` : undefined
                    }
                    aria-invalid={error ? 'true' : 'false'}
                />

                {/* Help Text or Error */}
                {(helpText || error) && (
                    <p
                        id={`${fieldId}-help`}
                        className={`mt-1 text-xs ${error ? 'text-red-600' : 'text-gray-500'
                            }`}
                    >
                        {error || helpText}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TextField;
