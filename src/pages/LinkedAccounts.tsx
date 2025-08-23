import {
    AccountEnvironment,
    Page,
    LinkedAccountRepresentation,
    getLinkedAccounts,
    linkAccount,
    unLinkAccount,
    useAlerts,
    useEnvironment,
    usePromise,
} from "@keycloak/keycloak-account-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const LinkedAccounts = () => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccountRepresentation[]>([]);
    const { addAlert, addError } = useAlerts();
    const [isLoading, setIsLoading] = useState(false);

    const refreshLinkedAccounts = async () => {
        try {
            const accountsData = await getLinkedAccounts({ context });
            setLinkedAccounts(accountsData);
        } catch (error) {
            console.error('Failed to refresh linked accounts:', error);
        }
    };

    usePromise((signal) => getLinkedAccounts({ signal, context }), setLinkedAccounts);

    // Helper function to get provider icon
    const getProviderIcon = (account: LinkedAccountRepresentation) => {
        const provider = account.providerAlias.toLowerCase();

        if (provider.includes('google')) {
            return (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
            );
        } else if (provider.includes('facebook')) {
            return (
                <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            );
        } else if (provider.includes('github')) {
            return (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            );
        } else if (provider.includes('twitter') || provider.includes('x')) {
            return (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            );
        } else if (provider.includes('linkedin')) {
            return (
                <svg className="w-6 h-6" fill="#0A66C2" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            );
        } else if (provider.includes('microsoft') || provider.includes('azure')) {
            return (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                </svg>
            );
        } else if (provider.includes('apple')) {
            return (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
            );
        } else if (provider.includes('bitbucket')) {
            return (
                <svg className="w-6 h-6" fill="#0052CC" viewBox="0 0 24 24">
                    <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z" />
                </svg>
            );
        }

        // Default provider icon
        return (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        );
    };

    // Helper function to get provider color
    const getProviderColor = (account: LinkedAccountRepresentation) => {
        const provider = account.providerAlias.toLowerCase();

        if (provider.includes('google')) return 'text-red-600 bg-red-50 border-red-200';
        if (provider.includes('facebook')) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (provider.includes('github')) return 'text-gray-900 bg-gray-50 border-gray-200';
        if (provider.includes('twitter') || provider.includes('x')) return 'text-black bg-gray-50 border-gray-200';
        if (provider.includes('linkedin')) return 'text-blue-700 bg-blue-50 border-blue-200';
        if (provider.includes('microsoft') || provider.includes('azure')) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (provider.includes('apple')) return 'text-gray-900 bg-gray-50 border-gray-200';
        if (provider.includes('bitbucket')) return 'text-blue-700 bg-blue-50 border-blue-200';

        return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    const handleLinkAccount = async (account: LinkedAccountRepresentation) => {
        setIsLoading(true);
        try {
            const result = await linkAccount(context, account);
            if (result.accountLinkUri) {
                // Redirect to the provider's linking page
                window.location.href = result.accountLinkUri;
            } else {
                addAlert(t("linkedAccounts.link.success", "Account linked successfully"));
                await refreshLinkedAccounts();
            }
        } catch (error) {
            console.error('Failed to link account:', error);
            addError(t("linkedAccounts.link.error", "Failed to link account"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlinkAccount = async (account: LinkedAccountRepresentation) => {
        setIsLoading(true);
        try {
            await unLinkAccount(context, account);
            addAlert(t("linkedAccounts.unlink.success", "Account unlinked successfully"));
            await refreshLinkedAccounts();
        } catch (error) {
            console.error('Failed to unlink account:', error);
            addError(t("linkedAccounts.unlink.error", "Failed to unlink account"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Page
            title={t("linkedAccounts.title", "Linked accounts")}
            description={t("linkedAccounts.description", "Manage your linked social and identity provider accounts")}
        >
            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="border-l-4 border-blue-600 pl-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {t("linkedAccounts.availableProviders", "Available identity providers")}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {t("linkedAccounts.availableProviders.description", "Link your account with social and identity providers for easier sign-in")}
                        </p>
                    </div>

                    {/* Accounts List */}
                    <div className="space-y-4">
                        {linkedAccounts.length > 0 ? (
                            linkedAccounts.map((account) => (
                                <div
                                    key={account.providerAlias}
                                    className={`p-4 rounded-2xl border transition-colors ${account.connected
                                        ? ''
                                        : 'border-gray-200 bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {/* Provider Icon */}
                                            <div className={`p-3 rounded-xl border ${getProviderColor(account)}`}>
                                                {getProviderIcon(account)}
                                            </div>

                                            {/* Provider Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {account.displayName || account.providerName}
                                                    </h3>
                                                    {account.connected && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-medium bg-green-100 text-green-800">
                                                            {t("linkedAccounts.connected", "Connected")}
                                                        </span>
                                                    )}
                                                </div>

                                                {account.connected && account.linkedUsername && (
                                                    <p className="text-sm text-gray-600">
                                                        {t("linkedAccounts.linkedAs", "Linked as")}: <span className="font-medium">{account.linkedUsername}</span>
                                                    </p>
                                                )}

                                                {!account.connected && (
                                                    <>
                                                        {/* Desktop description */}
                                                        <p className="hidden md:block text-sm text-gray-600">
                                                            {t("linkedAccounts.notConnected", "Not connected - click to link your {{provider}} account", { provider: account.displayName || account.providerName })}
                                                        </p>
                                                        {/* Mobile status */}
                                                        <p className="block md:hidden text-sm text-gray-500">
                                                            {t("linkedAccounts.notConnectedShort", "Not connected")}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex-shrink-0">
                                            {account.connected ? (
                                                <button
                                                    onClick={() => handleUnlinkAccount(account)}
                                                    disabled={isLoading}
                                                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-xl text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            {t("linkedAccounts.unlinking", "Unlinking...")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                            </svg>
                                                            {t("linkedAccounts.unlink", "Unlink")}
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleLinkAccount(account)}
                                                    disabled={isLoading}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            {t("linkedAccounts.linking", "Linking...")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                                            </svg>
                                                            {t("linkedAccounts.link", "Link account")}
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                </svg>
                                <p className="text-gray-500">
                                    {t("linkedAccounts.noProviders", "No identity providers are configured")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Page>
    );
};
