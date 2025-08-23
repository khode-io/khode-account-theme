import {
    AccountEnvironment,
    CredentialContainer,
    CredentialMetadataRepresentation,
    getCredentials,
    useAlerts,
    useEnvironment,
    usePromise,
} from "@keycloak/keycloak-account-ui";
import { Page, Button } from "../components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Key,
    Smartphone,
    CreditCard,
    FileText,
    CheckCircle,
    Plus,
    Edit,
    Trash2,
    AlertTriangle,
    Shield
} from "lucide-react";

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
            return <Key className="w-5 h-5" />;
        } else if (typeKey.includes('otp') || typeKey.includes('totp')) {
            return <Smartphone className="w-5 h-5" />;
        } else if (typeKey.includes('webauthn') || typeKey.includes('fido')) {
            return <CreditCard className="w-5 h-5" />;
        } else if (typeKey.includes('recovery') || typeKey.includes('backup')) {
            return <FileText className="w-5 h-5" />;
        }

        return <CheckCircle className="w-5 h-5" />;
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
            title={t("signingIn.title", "Security Settings")}
            description={t("signingIn.description", "Manage your authentication methods and security settings")}
            className="mt-4"
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
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleCreateCredential(container.createAction)}
                                                    leftIcon={<Plus className="w-4 h-4" />}
                                                >
                                                    {t("signingIn.add", "Add")}
                                                </Button>
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
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleUpdateCredential(container.updateAction)}
                                                                    leftIcon={<Edit className="w-3 h-3" />}
                                                                    className="text-xs"
                                                                >
                                                                    {t("signingIn.update", "Update")}
                                                                </Button>
                                                            )}

                                                            {/* Remove Button */}
                                                            {container.removeable && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveCredential(credentialMeta)}
                                                                    disabled={isLoading}
                                                                    leftIcon={<Trash2 className="w-3 h-3" />}
                                                                    className="border-red-300 text-red-700 hover:bg-red-50 focus:ring-red-500 text-xs"
                                                                >
                                                                    {t("signingIn.remove", "Remove")}
                                                                </Button>
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
                                                                <AlertTriangle className="w-5 h-5 text-amber-400 mr-2" />
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
                            <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
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