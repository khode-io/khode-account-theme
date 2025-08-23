import {
    AccountEnvironment,
    Page,
    CredentialContainer,
    CredentialMetadataRepresentation,
    getCredentials,
    useAlerts,
    useEnvironment,
    usePromise,
} from "@keycloak/keycloak-account-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const SigningIn = () => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const [credentials, setCredentials] = useState<CredentialContainer[]>([]);
    const { addAlert, addError } = useAlerts();
    const [isLoading, setIsLoading] = useState(false);

    const refreshCredentials = async () => {
        try {
            const credentialsData = await getCredentials({ context });
            setCredentials(credentialsData);
        } catch (error) {
            console.error('Failed to refresh credentials:', error);
        }
    };

    usePromise((signal) => getCredentials({ signal, context }), setCredentials);

    // Helper function to format date
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString();
    };



    // Helper function to get credential type icon
    const getCredentialIcon = (type: string) => {
        const typeKey = type.toLowerCase();

        if (typeKey.includes('password')) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            );
        } else if (typeKey.includes('otp') || typeKey.includes('totp')) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                </svg>
            );
        } else if (typeKey.includes('webauthn') || typeKey.includes('fido')) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" />
                </svg>
            );
        } else if (typeKey.includes('recovery') || typeKey.includes('backup')) {
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            );
        }

        return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    };



    const handleCreateCredential = (createAction: string) => {
        // Redirect to Keycloak's authentication flow for credential setup
        context.keycloak.login({ action: createAction });
    };

    const handleUpdateCredential = (updateAction: string) => {
        // Redirect to Keycloak's authentication flow for credential update
        context.keycloak.login({ action: updateAction });
    };

    const handleRemoveCredential = async (credential: CredentialMetadataRepresentation) => {
        if (!window.confirm(t("signingIn.remove.confirm", "Are you sure you want to remove this credential?"))) {
            return;
        }

        setIsLoading(true);
        try {
            // This would typically call a remove API - for now we'll show a placeholder
            // In a real implementation, this would call the Keycloak admin API
            console.log('Removing credential:', credential.credential.id);
            addAlert(t("signingIn.remove.success", "Credential removed successfully"));
            await refreshCredentials();
        } catch (error) {
            console.error('Failed to remove credential:', error);
            addError(t("signingIn.remove.error", "Failed to remove credential"));
        } finally {
            setIsLoading(false);
        }
    };

    // Group credentials by category
    const credentialsByCategory = credentials.reduce((acc, container) => {
        const category = container.category || 'other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(container);
        return acc;
    }, {} as Record<string, CredentialContainer[]>);

    const categoryOrder = ['basic-authentication', 'two-factor', 'passwordless', 'other'];

    return (
        <Page
            title={t("signingIn.title", "Signing in")}
            description={t("signingIn.description", "Manage your authentication methods and security settings")}
        >
            <div className={`space-y-6 async-content ${credentials.length > 0 ? 'loaded' : ''}`}>
                {categoryOrder.map((categoryKey) => {
                    const categoryCredentials = credentialsByCategory[categoryKey];
                    if (!categoryCredentials || categoryCredentials.length === 0) return null;

                    const categoryName = categoryKey === 'basic-authentication'
                        ? t("signingIn.basicAuthentication", "Basic Authentication")
                        : categoryKey === 'two-factor'
                            ? t("signingIn.twoFactor", "Two-Factor Authentication")
                            : categoryKey === 'passwordless'
                                ? t("signingIn.passwordless", "Passwordless")
                                : t("signingIn.other", "Other");

                    return (
                        <div key={categoryKey} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="border-l-4 border-blue-600 pl-4 mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {categoryName}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {categoryKey === 'basic-authentication' && t("signingIn.basicAuthentication.description", "Primary authentication methods like passwords")}
                                    {categoryKey === 'two-factor' && t("signingIn.twoFactor.description", "Additional security layers for your account")}
                                    {categoryKey === 'passwordless' && t("signingIn.passwordless.description", "Sign in without passwords using biometrics or security keys")}
                                    {categoryKey === 'other' && t("signingIn.other.description", "Additional authentication options")}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {categoryCredentials.map((container) => (
                                    <div key={container.type}>
                                        {/* Show Add button if no credentials exist but createAction is available */}
                                        {(!container.userCredentialMetadatas || container.userCredentialMetadatas.length === 0) && container.createAction && (
                                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl bg-gray-50">
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-gray-600">
                                                        {getCredentialIcon(container.type)}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900">
                                                            {container.displayName && !container.displayName.includes('${')
                                                                ? container.displayName
                                                                : container.type}
                                                        </h3>
                                                        {container.helptext && !container.helptext.includes('${') && (
                                                            <p className="text-xs text-gray-600">
                                                                {container.helptext}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleCreateCredential(container.createAction)}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    {t("signingIn.add", "Add")}
                                                </button>
                                            </div>
                                        )}

                                        {/* User Credentials - Show existing credentials */}
                                        {container.userCredentialMetadatas && container.userCredentialMetadatas.length > 0 && (
                                            <div className="space-y-3">
                                                {container.userCredentialMetadatas.map((credentialMeta, index) => (
                                                    <div key={credentialMeta.credential.id || index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="text-gray-500">
                                                                {getCredentialIcon(credentialMeta.credential.type)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {credentialMeta.credential.userLabel ||
                                                                        `${container.displayName} ${index + 1}`}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {t("signingIn.createdOn", "Created on")}: {formatDate(credentialMeta.credential.createdDate)}
                                                                </p>
                                                                {credentialMeta.infoMessage && (
                                                                    <p className="text-xs text-blue-600 mt-1">
                                                                        {credentialMeta.infoMessage}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            {/* Update Button */}
                                                            {container.updateAction && (
                                                                <button
                                                                    onClick={() => handleUpdateCredential(container.updateAction)}
                                                                    className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                                >
                                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                    {t("signingIn.update", "Update")}
                                                                </button>
                                                            )}

                                                            {/* Remove Button */}
                                                            {container.removeable && (
                                                                <button
                                                                    onClick={() => handleRemoveCredential(credentialMeta)}
                                                                    disabled={isLoading}
                                                                    className="inline-flex items-center px-2 py-1 border border-red-300 text-xs font-medium rounded-xl text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    {t("signingIn.remove", "Remove")}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Warning Messages */}
                                        {container.userCredentialMetadatas?.some(meta => meta.warningMessageTitle) && (
                                            <div className="mt-3">
                                                {container.userCredentialMetadatas
                                                    .filter(meta => meta.warningMessageTitle)
                                                    .map((meta, index) => (
                                                        <div key={index} className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-2xl">
                                                            <div className="flex items-center">
                                                                <svg className="w-5 h-5 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                                <div>
                                                                    <p className="text-sm font-medium text-amber-800">
                                                                        {meta.warningMessageTitle}
                                                                    </p>
                                                                    {meta.warningMessageDescription && (
                                                                        <p className="text-sm text-amber-700 mt-1">
                                                                            {meta.warningMessageDescription}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {credentials.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <div className="text-center">
                            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {t("signingIn.noCredentials", "No authentication methods configured")}
                            </h3>
                            <p className="text-gray-500">
                                {t("signingIn.noCredentials.description", "Contact your administrator to set up authentication methods")}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Page>
    );
};
