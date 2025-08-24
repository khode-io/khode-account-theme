import React from 'react';

export interface SelectFieldProps {
    /**
     * The label text for the field
     */
    label?: string;

    /**
     * The select id and name
     */
    id?: string;

    /**
     * The select name attribute
     */
    name?: string;

    /**
     * The current value
     */
    value?: string;

    /**
     * The options to display
     */
    options: Array<{ value: string; label: string }>;

    /**
     * Placeholder text for empty option
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
     * Help text to display below the select
     */
    helpText?: string;

    /**
     * Error message to display
     */
    error?: string;

    /**
     * Additional CSS classes for the select
     */
    className?: string;

    /**
     * Additional CSS classes for the container
     */
    containerClassName?: string;

    /**
     * Layout variant - 'stacked' (label above select) or 'horizontal' (label beside select)
     */
    layout?: 'stacked' | 'horizontal';

    /**
     * Change handler
     */
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;

    /**
     * Blur handler
     */
    onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;

    /**
     * Focus handler
     */
    onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

/**
 * SelectField component with modern styling using Tailwind CSS
 * 
 * Features:
 * - Clean, modern design with rounded corners
 * - Support for options with custom labels and values
 * - Required field indicators
 * - Read-only and disabled states
 * - Error states with validation styling
 * - Help text support
 * - Horizontal and stacked layouts
 * - Accessible markup with proper labeling
 * 
 * @example
 * ```tsx
 * <SelectField
 *   label="Premium Status"
 *   value={isPremium}
 *   options={[
 *     { value: 'Yes', label: 'Yes' },
 *     { value: 'No', label: 'No' }
 *   ]}
 *   onChange={(e) => setIsPremium(e.target.value)}
 *   required
 * />
 * ```
 */
export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    id,
    name,
    value = '',
    options = [],
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
    const fieldId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

    // Base select classes
    const baseSelectClasses = `
    w-full px-3 py-2 border rounded-xl shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus 
    transition-colors bg-surface text-text-primary
  `.trim();

    // State-specific classes
    const stateClasses = error
        ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
        : readOnly || disabled
            ? 'bg-surface-secondary text-text-tertiary cursor-not-allowed border-border-primary'
            : 'border-border-primary hover:border-border-secondary';

    const selectClasses = `${baseSelectClasses} ${stateClasses} ${className}`;

    // Container classes based on layout
    const containerClasses = layout === 'horizontal'
        ? `grid grid-cols-1 md:grid-cols-3 gap-4 items-start ${containerClassName}`
        : `space-y-2 ${containerClassName}`;

    const labelClasses = layout === 'horizontal'
        ? 'md:col-span-1 block text-sm font-medium text-text-secondary'
        : 'block text-sm font-medium text-text-secondary';

    const selectContainerClasses = layout === 'horizontal'
        ? 'md:col-span-2'
        : '';

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

            {/* Select Container */}
            <div className={selectContainerClasses}>
                <select
                    id={fieldId}
                    name={name || fieldId}
                    value={value}
                    required={required}
                    disabled={disabled || readOnly}
                    className={selectClasses}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    aria-describedby={
                        (helpText || error) ? `${fieldId}-help` : undefined
                    }
                    aria-invalid={error ? 'true' : 'false'}
                >
                    {/* Placeholder option */}
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}

                    {/* Options */}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

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

export default SelectField;
