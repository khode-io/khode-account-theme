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
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
        );
    };

    const getStatusBadge = (application: ClientRepresentation) => {
        if (application.inUse) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t("applications.active", "Active")}
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-gray-100 text-gray-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
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
            <div className="space-y-6">
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
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        {t("applications.offlineAccess", "Offline access")}
                                                    </span>
                                                )}
                                                {application.userConsentRequired && (
                                                    <span className="flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
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
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                {t("applications.revokeAccess", "Revoke access")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Security Info Panel */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-2xl">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-blue-800 mb-1">
                                {t("applications.security.title", "Security information")}
                            </h3>
                            <p className="text-sm text-blue-700">
                                {t("applications.security.description", "Applications listed here have been granted access to your account. You can revoke access at any time by clicking the 'Revoke access' button. Revoking access will prevent the application from accessing your account data.")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default Applications;
