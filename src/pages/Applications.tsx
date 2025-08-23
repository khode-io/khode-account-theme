import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useEnvironment,
    useAlerts,
    usePromise,
    getApplications,
    deleteConsent,
    ClientRepresentation
} from '@keycloak/keycloak-account-ui';
import { Page, Button, TextSkeleton, CardSkeleton } from '../components';
import type { AccountEnvironment } from '@keycloak/keycloak-account-ui';
import { FileText, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export const Applications: React.FC = () => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const { addAlert } = useAlerts();
    const [applications, setApplications] = useState<ClientRepresentation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);

    // Fetch applications data
    usePromise(
        async (signal) => {
            const data = await getApplications({ signal, context });
            setIsDataLoading(false);
            return data;
        },
        (data: ClientRepresentation[]) => {
            setApplications(data);
        }
    );

    const refreshApplications = async () => {
        try {
            setIsLoading(true);
            const data = await getApplications({ context });
            setApplications(data);
        } catch (error) {
            addAlert(t("applications.fetchError", "Failed to fetch applications"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevokeConsent = async (application: ClientRepresentation) => {
        if (!application.consent?.grantedScopes?.length) {
            return;
        }

        if (!window.confirm(t("applications.revokeConsent.confirm", "Are you sure you want to revoke access for this application?"))) {
            return;
        }

        try {
            setIsLoading(true);
            await deleteConsent(context, application.clientId);
            addAlert(t("applications.revokeConsent.success", "Access revoked successfully"));
            await refreshApplications();
        } catch (error) {
            addAlert(t("applications.revokeConsent.error", "Failed to revoke access"));
        } finally {
            setIsLoading(false);
        }
    };



    const getApplicationIcon = (application: ClientRepresentation) => {
        if (application.logoUri) {
            return (
                <img
                    src={application.logoUri}
                    alt={application.clientName || application.clientId}
                    className="w-8 h-8 rounded"
                />
            );
        }

        // Default application icon
        return (
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
            </div>
        );
    };

    const getStatusBadge = (application: ClientRepresentation) => {
        if (application.inUse) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {t("applications.active", "Active")}
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-gray-100 text-gray-800">
                <XCircle className="w-3 h-3 mr-1" />
                {t("applications.inactive", "Inactive")}
            </span>
        );
    };

    return (
        <Page
            title={t("applications.title", "Applications")}
            description={t("applications.description", "Manage applications that have access to your account")}
            className="mt-4 p-4"
        >
            <div className="space-y-6">
                {/* Applications Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    {isDataLoading ? (
                        <>
                            {/* Header Skeleton */}
                            <div className="mb-6">
                                <TextSkeleton width="120px" height="28px" />
                                <div className="mt-2">
                                    <TextSkeleton width="380px" height="14px" />
                                </div>
                            </div>

                            {/* Applications List Skeleton */}
                            <div className="space-y-4">
                                <CardSkeleton showAvatar={true} lines={2} showActions={true} />
                                <CardSkeleton showAvatar={true} lines={1} showActions={true} />
                                <CardSkeleton showAvatar={true} lines={2} showActions={true} />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Real Header */}
                            <div className="border-l-4 border-blue-600 pl-4 mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {t("applications.title", "Applications")}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {t("applications.description", "Manage applications that have access to your account")}
                                </p>
                            </div>

                            {/* Real Applications List */}
                            <div className="space-y-4">
                                {applications.length > 0 ? (
                                    applications.map((application) => (
                                        <div
                                            key={application.clientId}
                                            className="p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    {/* Application Icon */}
                                                    <div className="p-3 rounded-xl border bg-blue-50 border-blue-200">
                                                        {getApplicationIcon(application)}
                                                    </div>

                                                    {/* Application Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h3 className="text-lg font-medium text-gray-900">
                                                                {application.clientName || application.clientId}
                                                            </h3>
                                                            {getStatusBadge(application)}
                                                        </div>

                                                        <p className="text-sm text-gray-600">
                                                            {t("applications.clientId", "Client ID")}: <span className="font-mono">{application.clientId}</span>
                                                        </p>

                                                        {application.effectiveUrl && (
                                                            <>
                                                                {/* Desktop URL */}
                                                                <p className="hidden md:block text-sm text-gray-600">
                                                                    {t("applications.url", "URL")}: <a href={application.effectiveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{application.effectiveUrl}</a>
                                                                </p>
                                                                {/* Mobile URL */}
                                                                <p className="block md:hidden text-sm text-gray-600">
                                                                    {t("applications.url", "URL")}: <span className="text-blue-600 break-all">{application.effectiveUrl}</span>
                                                                </p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex-shrink-0">
                                                    {application.consent?.grantedScopes && application.consent.grantedScopes.length > 0 && (
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleRevokeConsent(application)}
                                                            loading={isLoading}
                                                            loadingText={t("applications.revoking", "Revoking...")}
                                                            leftIcon={<Trash2 className="w-4 h-4" />}
                                                            className="border-red-300 text-red-700 hover:bg-red-50 focus:ring-red-500"
                                                        >
                                                            {t("applications.revokeAccess", "Revoke access")}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {t("applications.empty.title", "No applications")}
                                        </h3>
                                        <p className="text-gray-500">
                                            {t("applications.empty.description", "You haven't granted access to any applications yet.")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Page>
    );
};

export default Applications;
