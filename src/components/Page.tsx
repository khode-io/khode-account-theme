import React from 'react';
import { CardSkeleton } from './Skeleton';

export interface PageProps {
    /**
 * The title of the page (optional)
 */
    title?: string;

    /**
     * Optional description text that appears below the title
     */
    description?: string;

    /**
     * The main content of the page
     */
    children: React.ReactNode;

    /**
     * Optional additional CSS classes to apply to the page container
     */
    className?: string;

    /**
     * Optional header actions (buttons, etc.) to display in the page header
     */
    headerActions?: React.ReactNode;

    /**
     * Whether to show a loading state
     */
    isLoading?: boolean;

    /**
     * Custom loading component
     */
    loadingComponent?: React.ReactNode;
}

/**
 * Custom Page component as an alternative to Keycloak's Page component
 * Built with Tailwind CSS for modern, responsive design
 * 
 * Features:
 * - Clean, modern design with accent border on title
 * - Responsive layout that works on all screen sizes
 * - Optional loading state with spinner
 * - Header actions support for buttons/controls
 * - Smooth transitions and animations
 * - Accessible markup with proper heading hierarchy
 * 
 * @example
 * ```tsx
 * <Page 
 *   title="Applications" 
 *   description="Manage applications that have access to your account"
 *   headerActions={<button>Add New</button>}
 *   isLoading={loading}
 * >
 *   <div>Your page content here</div>
 * </Page>
 * ```
 */
export const Page: React.FC<PageProps> = ({
    title,
    description,
    children,
    className = '',
    headerActions,
    isLoading = false,
    loadingComponent
}) => {
    // Default loading component using skeletons
    const defaultLoadingComponent = (
        <div className="space-y-6">
            <CardSkeleton showAvatar={true} lines={2} />
            <CardSkeleton showAvatar={true} lines={3} />
            <CardSkeleton showAvatar={false} lines={2} />
        </div>
    );

    return (
        <div className={`min-h-full ${className}`}>
            {/* Page Header - Only render if title, description, or headerActions exist */}
            {(title || description || headerActions) && (
                <div className="mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {/* Title and Description */}
                            {(title || description) && (
                                <div className="mb-4">
                                    {title && (
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {title}
                                        </h1>
                                    )}
                                    {description && (
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Header Actions */}
                        {headerActions && (
                            <div className="flex-shrink-0 ml-6">
                                {headerActions}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Page Content */}
            <div className="relative">
                {isLoading ? (
                    <div className="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center">
                        {loadingComponent || defaultLoadingComponent}
                    </div>
                ) : null}

                <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Page;
