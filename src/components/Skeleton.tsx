import React from 'react';

export interface SkeletonProps {
    /** Width of the skeleton */
    width?: string | number;
    /** Height of the skeleton */
    height?: string | number;
    /** Shape of the skeleton */
    variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
    /** Additional CSS classes */
    className?: string;
    /** Animation type */
    animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
    width,
    height,
    variant = 'text',
    className = '',
    animation = 'pulse'
}) => {
    // Base classes for all skeletons
    const baseClasses = 'bg-gray-200';

    // Animation classes
    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'animate-pulse', // Could be enhanced with custom wave animation
        none: ''
    };

    // Variant-specific classes and dimensions
    const getVariantClasses = () => {
        switch (variant) {
            case 'text':
                return {
                    classes: 'rounded',
                    defaultWidth: '100%',
                    defaultHeight: '1rem'
                };
            case 'rectangular':
                return {
                    classes: 'rounded-lg',
                    defaultWidth: '100%',
                    defaultHeight: '8rem'
                };
            case 'circular':
                return {
                    classes: 'rounded-full',
                    defaultWidth: '2.5rem',
                    defaultHeight: '2.5rem'
                };
            case 'rounded':
                return {
                    classes: 'rounded-xl',
                    defaultWidth: '100%',
                    defaultHeight: '6rem'
                };
            default:
                return {
                    classes: 'rounded',
                    defaultWidth: '100%',
                    defaultHeight: '1rem'
                };
        }
    };

    const variantConfig = getVariantClasses();

    // Style object for width and height
    const style: React.CSSProperties = {
        width: width || variantConfig.defaultWidth,
        height: height || variantConfig.defaultHeight
    };

    return (
        <div
            className={`
                ${baseClasses}
                ${variantConfig.classes}
                ${animationClasses[animation]}
                ${className}
            `.trim()}
            style={style}
        />
    );
};

// Convenience components for common skeleton patterns
export const TextSkeleton: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton {...props} variant="text" />
);

export const CircleSkeleton: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton {...props} variant="circular" />
);

export const RectangleSkeleton: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton {...props} variant="rectangular" />
);

export const RoundedSkeleton: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
    <Skeleton {...props} variant="rounded" />
);

// Complex skeleton patterns for common use cases
export interface CardSkeletonProps {
    /** Whether to show avatar */
    showAvatar?: boolean;
    /** Number of text lines */
    lines?: number;
    /** Whether to show action buttons */
    showActions?: boolean;
    /** Additional CSS classes */
    className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
    showAvatar = true,
    lines = 3,
    showActions = false,
    className = ''
}) => (
    <div className={`p-6 border border-gray-200 rounded-2xl bg-white ${className}`}>
        <div className="flex items-start space-x-4">
            {showAvatar && (
                <CircleSkeleton width="3rem" height="3rem" />
            )}
            <div className="flex-1 space-y-3">
                <TextSkeleton height="1.25rem" width="60%" />
                {Array.from({ length: lines }).map((_, index) => (
                    <TextSkeleton
                        key={index}
                        height="1rem"
                        width={index === lines - 1 ? '40%' : '100%'}
                    />
                ))}
                {showActions && (
                    <div className="flex space-x-2 pt-2">
                        <RoundedSkeleton width="5rem" height="2rem" />
                        <RoundedSkeleton width="4rem" height="2rem" />
                    </div>
                )}
            </div>
        </div>
    </div>
);

export interface ListSkeletonProps {
    /** Number of items to show */
    items?: number;
    /** Whether items have avatars */
    showAvatars?: boolean;
    /** Whether items have actions */
    showActions?: boolean;
    /** Additional CSS classes */
    className?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
    items = 3,
    showAvatars = true,
    showActions = false,
    className = ''
}) => (
    <div className={`space-y-4 ${className}`}>
        {Array.from({ length: items }).map((_, index) => (
            <CardSkeleton
                key={index}
                showAvatar={showAvatars}
                showActions={showActions}
                lines={2}
            />
        ))}
    </div>
);

export interface TableSkeletonProps {
    /** Number of rows */
    rows?: number;
    /** Number of columns */
    columns?: number;
    /** Additional CSS classes */
    className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
    rows = 5,
    columns = 4,
    className = ''
}) => (
    <div className={`space-y-3 ${className}`}>
        {/* Header */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, index) => (
                <TextSkeleton key={`header-${index}`} height="1rem" width="80%" />
            ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
                key={`row-${rowIndex}`}
                className="grid gap-4 py-2"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
                {Array.from({ length: columns }).map((_, colIndex) => (
                    <TextSkeleton
                        key={`cell-${rowIndex}-${colIndex}`}
                        height="1rem"
                        width={colIndex === 0 ? '90%' : '70%'}
                    />
                ))}
            </div>
        ))}
    </div>
);

export interface FormSkeletonProps {
    /** Number of form fields */
    fields?: number;
    /** Whether to show submit button */
    showSubmit?: boolean;
    /** Additional CSS classes */
    className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
    fields = 4,
    showSubmit = true,
    className = ''
}) => (
    <div className={`space-y-6 ${className}`}>
        {Array.from({ length: fields }).map((_, index) => (
            <div key={index} className="space-y-2">
                <TextSkeleton height="1rem" width="25%" />
                <RoundedSkeleton height="2.5rem" />
            </div>
        ))}
        {showSubmit && (
            <div className="pt-4">
                <RoundedSkeleton width="8rem" height="2.5rem" />
            </div>
        )}
    </div>
);

export { Skeleton };
