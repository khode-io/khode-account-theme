import React from 'react';

export interface TextAreaFieldProps {
    /**
     * The label text for the field
     */
    label?: string;

    /**
     * The textarea id and name
     */
    id?: string;

    /**
     * The textarea name attribute
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
     * Help text to display below the textarea
     */
    helpText?: string;

    /**
     * Error message to display
     */
    error?: string;

    /**
     * Number of rows for the textarea
     */
    rows?: number;

    /**
     * Minimum length for textarea validation
     */
    minLength?: number;

    /**
     * Maximum length for textarea validation
     */
    maxLength?: number;

    /**
     * Additional CSS classes for the textarea
     */
    className?: string;

    /**
     * Additional CSS classes for the container
     */
    containerClassName?: string;

    /**
     * Layout variant - 'stacked' (label above textarea) or 'horizontal' (label beside textarea)
     */
    layout?: 'stacked' | 'horizontal';

    /**
     * Change handler
     */
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;

    /**
     * Blur handler
     */
    onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;

    /**
     * Focus handler
     */
    onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

/**
 * TextAreaField component with modern styling using Tailwind CSS
 * 
 * Features:
 * - Clean, modern design with rounded corners
 * - Support for multiline text input
 * - Required field indicators
 * - Read-only and disabled states
 * - Error states with validation styling
 * - Help text support
 * - Horizontal and stacked layouts
 * - Accessible markup with proper labeling
 * - Character count validation
 * 
 * @example
 * ```tsx
 * <TextAreaField
 *   label="Description"
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   rows={4}
 *   maxLength={500}
 *   helpText="Describe yourself in a few sentences"
 * />
 * ```
 */
export const TextAreaField: React.FC<TextAreaFieldProps> = ({
    label,
    id,
    name,
    value = '',
    placeholder,
    required = false,
    readOnly = false,
    disabled = false,
    helpText,
    error,
    rows = 3,
    minLength,
    maxLength,
    className = '',
    containerClassName = '',
    layout = 'horizontal',
    onChange,
    onBlur,
    onFocus
}) => {
    // Generate id if not provided
    const fieldId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Base textarea classes
    const baseTextAreaClasses = `
    w-full px-3 py-2 border rounded-xl shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus 
    transition-colors bg-surface text-text-primary resize-vertical
  `.trim();

    // State-specific classes
    const stateClasses = error
        ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
        : readOnly || disabled
            ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed border-border-primary'
            : 'border-border-primary hover:border-border-secondary';

    const textAreaClasses = `${baseTextAreaClasses} ${stateClasses} ${className}`;

    // Container classes based on layout
    const containerClasses = layout === 'horizontal'
        ? `grid grid-cols-1 md:grid-cols-3 gap-4 items-start ${containerClassName}`
        : `space-y-2 ${containerClassName}`;

    const labelClasses = layout === 'horizontal'
        ? 'md:col-span-1 block text-sm font-medium text-text-secondary'
        : 'block text-sm font-medium text-text-secondary';

    const textAreaContainerClasses = layout === 'horizontal'
        ? 'md:col-span-2'
        : '';

    // Character count display
    const showCharacterCount = maxLength && value.length > 0;
    const characterCountText = showCharacterCount ? `${value.length}/${maxLength}` : '';
    const isOverLimit = maxLength && value.length > maxLength;

    return (
        <div className={containerClasses}>
            {/* Label */}
            {label && (
                <div className={layout === 'horizontal' ? 'md:col-span-1' : ''}>
                    <label htmlFor={fieldId} className={labelClasses}>
                        {label} {required && <span className="text-error-500">*</span>}
                    </label>
                </div>
            )}

            {/* TextArea Container */}
            <div className={textAreaContainerClasses}>
                <textarea
                    id={fieldId}
                    name={name || fieldId}
                    value={value}
                    placeholder={placeholder}
                    required={required}
                    readOnly={readOnly}
                    disabled={disabled}
                    rows={rows}
                    minLength={minLength}
                    maxLength={maxLength}
                    className={textAreaClasses}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    aria-describedby={
                        (helpText || error) ? `${fieldId}-help` : undefined
                    }
                    aria-invalid={error ? 'true' : 'false'}
                />

                {/* Character Count */}
                {showCharacterCount && (
                    <div className={`mt-1 text-xs text-right ${isOverLimit ? 'text-error-600' : 'text-text-tertiary'}`}>
                        {characterCountText}
                    </div>
                )}

                {/* Help Text or Error */}
                {(helpText || error) && (
                    <p
                        id={`${fieldId}-help`}
                        className={`mt-1 text-xs ${error ? 'text-error-600' : 'text-text-tertiary'
                            }`}
                    >
                        {error || helpText}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TextAreaField;
