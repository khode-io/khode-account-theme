import {
    AccountEnvironment,
    DeviceRepresentation,
    getDevices,
    deleteSession,
    useEnvironment,
    usePromise,
} from "@keycloak/keycloak-account-ui";
import { Page, Button, Dialog, TextSkeleton, CardSkeleton } from "../components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { showSuccessToast, showErrorToast } from "../utils";
import {
    Smartphone,
    Monitor,
    RefreshCw,
} from "lucide-react";

export const DeviceActivity = () => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const [devices, setDevices] = useState<DeviceRepresentation[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        sessionId?: string;
        isSignOutAll?: boolean;
    }>({ isOpen: false });

    const refreshDevices = async () => {
        try {
            const devicesData = await getDevices({ context });
            setDevices(devicesData);
        } catch (error) {
            console.error('Failed to refresh devices:', error);
        }
    };

    usePromise(
        async (signal) => {
            const data = await getDevices({ signal, context });
            setIsDataLoading(false);
            return data;
        },
        setDevices
    );

    // Helper function to format date
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    // Helper function to format clients
    const formatClients = (clients: any) => {
        if (!clients) return 'Account Console';

        // If clients is an array of client objects
        if (Array.isArray(clients)) {
            if (clients.length === 0) return 'Account Console';

            const clientNames = clients.map(client => {
                // Handle the specific structure: { clientId, clientName, ... }
                if (client.clientName && !client.clientName.startsWith('${')) {
                    return client.clientName;
                } else if (client.clientId) {
                    // Convert clientId to readable name
                    return client.clientId
                        .split('-')
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                }
                return 'Unknown Client';
            });

            return clientNames.join(', ');
        }

        // If clients is a single object
        if (typeof clients === 'object') {
            if (clients.clientName && !clients.clientName.startsWith('${')) {
                return clients.clientName;
            } else if (clients.clientId) {
                return clients.clientId
                    .split('-')
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }
            return 'Account Console';
        }

        // If clients is a string
        if (typeof clients === 'string') {
            return clients;
        }

        return 'Account Console';
    };



    // Helper function to get device icon
    const getDeviceIcon = (device: DeviceRepresentation) => {
        if (device.mobile) {
            return <Smartphone className="w-6 h-6" />;
        }
        return <Monitor className="w-6 h-6" />;
    };




    const handleSignOutSession = async (sessionId: string) => {
        setConfirmDialog({
            isOpen: true,
            sessionId: sessionId,
            isSignOutAll: false
        });
    };

    const confirmSignOutSession = async () => {
        if (!confirmDialog.sessionId) return;

        setIsLoading(true);
        try {
            await deleteSession(context, confirmDialog.sessionId);
            showSuccessToast(t("deviceActivity.signOut.success", "Session signed out successfully"));
            await refreshDevices();
        } catch (error) {
            console.error('Failed to sign out session:', error);
            showErrorToast(t("deviceActivity.signOut.error", "Failed to sign out session"));
        } finally {
            setIsLoading(false);
            setConfirmDialog({ isOpen: false });
        }
    };

    const handleSignOutAllSessions = async () => {
        setConfirmDialog({
            isOpen: true,
            isSignOutAll: true
        });
    };

    const confirmSignOutAllSessions = async () => {
        setIsLoading(true);
        try {
            // Sign out all sessions (no session ID means all sessions)
            await deleteSession(context);
            showSuccessToast(t("deviceActivity.signOutAll.success", "All sessions signed out successfully"));
            await refreshDevices();
        } catch (error) {
            console.error('Failed to sign out all sessions:', error);
            showErrorToast(t("deviceActivity.signOutAll.error", "Failed to sign out all sessions"));
        } finally {
            setIsLoading(false);
            setConfirmDialog({ isOpen: false });
        }
    };



    return (
        <Page
            title={t("deviceActivity.title", "Signed in devices")}
            description={t("deviceActivity.description", "Monitor and manage your signed-in devices")}
            className="mt-4 p-4"
        >
            <div className="space-y-6">
                {/* Header Section */}
                <div className="rounded-2xl border border-border-primary p-6 shadow-sm">
                    {isDataLoading ? (
                        <>
                            {/* Header Skeleton */}
                            <div className="mb-6">
                                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                                    <div className="flex-1">
                                        <TextSkeleton width="160px" height="28px" />
                                        <div className="mt-2">
                                            <TextSkeleton width="320px" height="14px" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                                        <TextSkeleton width="80px" height="20px" />
                                        <TextSkeleton width="140px" height="42px" className="rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            {/* Device Sessions Skeleton */}
                            <div className="space-y-4">
                                <CardSkeleton showAvatar={true} lines={3} showActions={true} />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Real Header */}
                            <div className="mb-6">
                                {/* Header - Mobile Stacked, Desktop Side-by-Side */}
                                <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                                    <div className="border-l-4 border-accent-primary pl-4">
                                        <h2 className="text-xl font-semibold text-text-primary">
                                            {t("deviceActivity.activeDevices", "Active devices")}
                                        </h2>
                                        <p className="text-sm text-text-secondary mt-1">
                                            {t("deviceActivity.activeDevices.description", "Devices that have been used to sign in to your account")}
                                        </p>
                                    </div>

                                    {/* Actions - Mobile Full Width, Desktop Auto */}
                                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                                        <button
                                            onClick={refreshDevices}
                                            className="flex items-center justify-center sm:justify-start text-accent-primary hover:text-accent-primary-hover text-sm font-medium"
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            <span className="hidden sm:inline">Refresh the page</span>
                                            <span className="sm:hidden">Refresh</span>
                                        </button>
                                        {devices.length > 0 && (
                                            <Button
                                                variant="primary"
                                                onClick={handleSignOutAllSessions}
                                                loading={isLoading}
                                                loadingText={t("deviceActivity.signingOut", "Signing out...")}
                                                fullWidth={true}
                                                className="sm:w-auto"
                                            >
                                                <span className="hidden sm:inline">Sign out all devices</span>
                                                <span className="sm:hidden">Sign out all</span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Real Sessions List */}
                            <div className="space-y-4">
                                {devices.length > 0 ? (
                                    devices.flatMap((device) => {
                                        if (device.sessions && device.sessions.length > 0) {
                                            return device.sessions.map((session) => {
                                                return (
                                                    <div
                                                        key={`${device.id}-${session.id}`}
                                                        className="p-4 sm:p-6 rounded-2xl border border-border-primary hover:bg-hover-light transition-colors"
                                                    >
                                                        {/* Mobile Layout - Stacked */}
                                                        <div className="block sm:hidden">
                                                            <div className="flex items-start space-x-3 mb-4">
                                                                <div className="p-2">
                                                                    {getDeviceIcon(device)}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="text-base font-semibold text-text-primary mb-1">
                                                                        {device.device || device.os || "Unknown Device"}
                                                                    </h3>
                                                                    <p className="text-sm text-text-secondary">
                                                                        {session.browser || device.browser || "Unknown Browser"}
                                                                    </p>
                                                                    {session.current && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                                                                            Current session
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Mobile Info Grid */}
                                                            <div className="space-y-3 text-sm mb-4">
                                                                <div>
                                                                    <span className="font-medium text-text-secondary">IP address</span>
                                                                    <div className="text-text-primary font-mono">
                                                                        {session.ipAddress || device.ipAddress || 'Unknown IP'}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-text-secondary">Last accessed</span>
                                                                    <div className="text-text-primary">
                                                                        {formatDate(session.lastAccess || device.lastAccess)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-text-secondary">Clients</span>
                                                                    <div className="text-text-primary">
                                                                        {formatClients(session.clients)}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Mobile Action */}
                                                            {!session.current && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleSignOutSession(session.id)}
                                                                    loading={isLoading}
                                                                    loadingText={t("deviceActivity.signingOut", "Signing out...")}
                                                                    className="border-border-secondary text-text-secondary hover:bg-hover-light w-full"
                                                                >
                                                                    Sign out
                                                                </Button>
                                                            )}
                                                        </div>

                                                        {/* Desktop Layout - Clean and Compact */}
                                                        <div className="hidden sm:block">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex items-start space-x-4 flex-1">
                                                                    {/* Device Icon */}
                                                                    <div className="flex-shrink-0 text-accent-primary">
                                                                        {getDeviceIcon(device)}
                                                                    </div>

                                                                    {/* Device Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center space-x-3 mb-4">
                                                                            <h3 className="text-lg font-semibold text-text-primary">
                                                                                {device.device || device.os || "Mac"} / {session.browser || device.browser || "Unknown Browser"}
                                                                            </h3>
                                                                            {session.current && (
                                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                                    Current session
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        {/* Session Details Grid - Exactly like screenshot */}
                                                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                                                            <div>
                                                                                <div className="font-medium text-text-secondary mb-1">IP address</div>
                                                                                <div className="text-text-primary font-mono">
                                                                                    {session.ipAddress || device.ipAddress || 'Unknown IP'}
                                                                                </div>
                                                                            </div>

                                                                            <div>
                                                                                <div className="font-medium text-text-secondary mb-1">Last accessed</div>
                                                                                <div className="text-text-primary">
                                                                                    {formatDate(session.lastAccess || device.lastAccess)}
                                                                                </div>
                                                                            </div>

                                                                            <div>
                                                                                <div className="font-medium text-text-secondary mb-1">Started</div>
                                                                                <div className="text-text-primary">
                                                                                    {formatDate(session.started)}
                                                                                </div>
                                                                            </div>

                                                                            <div>
                                                                                <div className="font-medium text-text-secondary mb-1">Expires</div>
                                                                                <div className="text-text-primary">
                                                                                    {formatDate(session.expires)}
                                                                                </div>
                                                                            </div>

                                                                            <div className="col-span-2">
                                                                                <div className="font-medium text-text-secondary mb-1">Clients</div>
                                                                                <div className="text-text-primary">
                                                                                    {formatClients(session.clients)}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Desktop Actions */}
                                                                {!session.current && (
                                                                    <div className="flex-shrink-0 ml-6">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => handleSignOutSession(session.id)}
                                                                            loading={isLoading}
                                                                            loadingText={t("deviceActivity.signingOut", "Signing out...")}
                                                                            className="border-border-secondary text-text-secondary hover:bg-hover-light"
                                                                        >
                                                                            Sign out
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        } else {
                                            // Return empty array if no sessions
                                            return [];
                                        }
                                    })
                                ) : (
                                    <div className="text-center py-8">
                                        <Monitor className="w-12 h-12 mx-auto text-text-tertiary mb-4" />
                                        <p className="text-text-tertiary">
                                            {t("deviceActivity.noDevices", "No devices found")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false })}
                title={confirmDialog.isSignOutAll
                    ? t("deviceActivity.signOutAll.confirm.title", "Sign out all devices?")
                    : t("deviceActivity.signOut.confirm.title", "Sign out session?")
                }
                confirmText={confirmDialog.isSignOutAll
                    ? t("deviceActivity.signOutAll.confirm.button", "Sign out all")
                    : t("deviceActivity.signOut.confirm.button", "Sign out")
                }
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={confirmDialog.isSignOutAll ? confirmSignOutAllSessions : confirmSignOutSession}
                loading={isLoading}
                loadingText={t("deviceActivity.signingOut", "Signing out...")}
                type="warning"
            >
                {confirmDialog.isSignOutAll ? (
                    <p>
                        {t("deviceActivity.signOutAll.confirm.message",
                            "This will sign you out of all devices and sessions. You will need to sign in again.")}
                    </p>
                ) : (
                    <p>
                        {t("deviceActivity.signOut.confirm.message",
                            "Are you sure you want to sign out of this session?")}
                    </p>
                )}
            </Dialog>
        </Page>
    );
};
