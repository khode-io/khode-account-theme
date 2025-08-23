import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Page,
    useEnvironment,
    useAlerts,
    usePromise,
    getApplications,
    deleteConsent,
    ClientRepresentation
} from '@keycloak/keycloak-account-ui';
import type { AccountEnvironment } from '@keycloak/keycloak-account-ui';
import { FileText, CheckCircle, XCircle, Info, Trash2 } from 'lucide-react';

export const Applications: React.FC = () => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const { addAlert } = useAlerts();
    const [applications, setApplications] = useState<ClientRepresentation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch applications data
    usePromise((signal) => getApplications({ signal, context }), (data: ClientRepresentation[]) => {
        setApplications(data);
        setIsLoading(false);
    });

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

    const formatDate = (timestamp: number) => {
        if (!timestamp) return t("applications.never", "Never");
        return new Date(timestamp).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    if (isLoading) {
        return (
            <Page title={t("applications.title", "Applications")} description="">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">{t("applications.loading", "Loading applications...")}</span>
                </div>
            </Page>
        );
    }

    return (
        <Page title={t("applications.title", "Applications")} description="">
            <div className={`space-y-6 async-content ${!isLoading ? 'loaded' : ''}`}>
                {/* Header */}
                <div className="border-l-4 border-blue-600 pl-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {t("applications.title", "Applications")}
                    </h1>
                    <p className="text-gray-600">
                        {t("applications.description", "Manage applications that have access to your account")}
                    </p>
                </div>

                {/* Applications List */}
                {applications.length === 0 ? (
                    <div className="text-center py-12">
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
                ) : (
                    <div className="space-y-4">
                        {applications.map((application) => (
                            <div key={application.clientId} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        {/* Application Icon */}
                                        <div className="flex-shrink-0">
                                            {getApplicationIcon(application)}
                                        </div>

                                        {/* Application Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                                    {application.clientName || application.clientId}
                                                </h3>
                                                {getStatusBadge(application)}
                                            </div>

                                            {application.description && (
                                                <p className="text-sm text-gray-600 mb-3">
                                                    {application.description}
                                                </p>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">
                                                        {t("applications.clientId", "Client ID")}:
                                                    </span>
                                                    <span className="ml-2 text-gray-600 font-mono">
                                                        {application.clientId}
                                                    </span>
                                                </div>

                                                {application.effectiveUrl && (
                                                    <div>
                                                        <span className="font-medium text-gray-700">
                                                            {t("applications.url", "URL")}:
                                                        </span>
                                                        <a
                                                            href={application.effectiveUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-2 text-blue-600 hover:text-blue-800 truncate"
                                                        >
                                                            {application.effectiveUrl}
                                                        </a>
                                                    </div>
                                                )}

                                                {application.consent && (
                                                    <div>
                                                        <span className="font-medium text-gray-700">
                                                            {t("applications.lastAccess", "Last access")}:
                                                        </span>
                                                        <span className="ml-2 text-gray-600">
                                                            {formatDate(application.consent.lastUpdatedDate)}
                                                        </span>
                                                    </div>
                                                )}

                                                {application.consent && (
                                                    <div>
                                                        <span className="font-medium text-gray-700">
                                                            {t("applications.grantedOn", "Granted on")}:
                                                        </span>
                                                        <span className="ml-2 text-gray-600">
                                                            {formatDate(application.consent.createdDate)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Granted Permissions */}
                                            {application.consent?.grantedScopes && application.consent.grantedScopes.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                        {t("applications.permissions", "Granted permissions")}:
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {application.consent.grantedScopes.map((scope, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-blue-100 text-blue-800"
                                                            >
                                                                {scope.displayTest || scope.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Additional Features */}
                                            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                                                {application.offlineAccess && (
                                                    <span className="flex items-center">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        {t("applications.offlineAccess", "Offline access")}
                                                    </span>
                                                )}
                                                {application.userConsentRequired && (
                                                    <span className="flex items-center">
                                                        <Info className="w-3 h-3 mr-1" />
                                                        {t("applications.consentRequired", "Consent required")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex-shrink-0 ml-4">
                                        {application.consent?.grantedScopes && application.consent.grantedScopes.length > 0 && (
                                            <button
                                                onClick={() => handleRevokeConsent(application)}
                                                disabled={isLoading}
                                                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-xl text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                {t("applications.revokeAccess", "Revoke access")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Page>
    );
};

export default Applications;
