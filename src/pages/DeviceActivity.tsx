import {
    AccountEnvironment,
    DeviceRepresentation,
    getDevices,
    deleteSession,
    useAlerts,
    useEnvironment,
    usePromise,
} from "@keycloak/keycloak-account-ui";
import { Page, Button } from "../components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    CheckCircle,
    Smartphone,
    Monitor,
    Apple,
    LogOut,
    MapPin,
    Clock,
    MonitorSpeaker
} from "lucide-react";

export const DeviceActivity = () => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const [devices, setDevices] = useState<DeviceRepresentation[]>([]);
    const { addAlert, addError } = useAlerts();
    const [isLoading, setIsLoading] = useState(false);

    const refreshDevices = async () => {
        try {
            const devicesData = await getDevices({ context });
            setDevices(devicesData);
        } catch (error) {
            console.error('Failed to refresh devices:', error);
        }
    };

    usePromise((signal) => getDevices({ signal, context }), setDevices);

    // Helper function to format date
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    // Helper function to get default icon
    const getDefaultIcon = () => {
        return <CheckCircle className="w-5 h-5" />;
    };

    // Helper function to get device icon
    const getDeviceIcon = (device: DeviceRepresentation) => {
        if (device.mobile) {
            return <Smartphone className="w-6 h-6" />;
        }
        return <Monitor className="w-6 h-6" />;
    };

    // Helper function to get OS icon
    const getOSIcon = (os?: string) => {
        if (!os || os.trim() === '') return getDefaultIcon();
        const osLower = os.toLowerCase();
        if (osLower.includes('windows')) {
            return <Monitor className="w-5 h-5" />;
        } else if (osLower.includes('mac') || osLower.includes('ios')) {
            return <Apple className="w-5 h-5" />;
        } else if (osLower.includes('android')) {
            return <Smartphone className="w-5 h-5" />;
        } else if (osLower.includes('linux')) {
            return <MonitorSpeaker className="w-5 h-5" />;
        }
        return getDefaultIcon();
    };

    // Helper function to get browser icon
    const getBrowserIcon = (browser?: string) => {
        if (!browser || browser.trim() === '') return getDefaultIcon();
        const browserLower = browser.toLowerCase();
        if (browserLower.includes('chrome')) {
            return <Monitor className="w-5 h-5" />;
        } else if (browserLower.includes('firefox')) {
            return <Monitor className="w-5 h-5" />;
        } else if (browserLower.includes('safari')) {
            return <Apple className="w-5 h-5" />;
        } else if (browserLower.includes('edge')) {
            return <Monitor className="w-5 h-5" />;
        }
        return getDefaultIcon();
    };

    const handleSignOutSession = async (sessionId: string) => {
        setIsLoading(true);
        try {
            await deleteSession(context, sessionId);
            addAlert(t("deviceActivity.signOut.success", "Session signed out successfully"));
            await refreshDevices();
        } catch (error) {
            console.error('Failed to sign out session:', error);
            addError(t("deviceActivity.signOut.error", "Failed to sign out session"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOutAllSessions = async () => {
        setIsLoading(true);
        try {
            // Sign out all sessions (no session ID means all sessions)
            await deleteSession(context);
            addAlert(t("deviceActivity.signOutAll.success", "All sessions signed out successfully"));
            await refreshDevices();
        } catch (error) {
            console.error('Failed to sign out all sessions:', error);
            addError(t("deviceActivity.signOutAll.error", "Failed to sign out all sessions"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOutDevice = async (device: DeviceRepresentation) => {
        setIsLoading(true);
        try {
            // Sign out all sessions for this device
            for (const session of device.sessions || []) {
                if (!session.current) { // Don't sign out current session
                    await deleteSession(context, session.id);
                }
            }
            addAlert(t("deviceActivity.signOut.success", "Device sessions signed out successfully"));
            await refreshDevices();
        } catch (error) {
            console.error('Failed to sign out device:', error);
            addError(t("deviceActivity.signOut.error", "Failed to sign out device"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Page
            title={t("deviceActivity.title", "Device activity")}
            description={t("deviceActivity.description", "Monitor and manage your signed-in devices")}
            className="mt-4"
        >
            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="border-l-4 border-blue-600 pl-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {t("deviceActivity.activeDevices", "Active devices")}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {t("deviceActivity.activeDevices.description", "Devices that have been used to sign in to your account")}
                            </p>
                        </div>

                        {/* Sign out all sessions button */}
                        {devices.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleSignOutAllSessions}
                                loading={isLoading}
                                loadingText={t("deviceActivity.signingOut", "Signing out...")}
                                leftIcon={<LogOut className="w-4 h-4" />}
                                className="border-red-300 text-red-700 hover:bg-red-50 focus:ring-red-500"
                            >
                                {t("deviceActivity.signOutAll", "Sign out all sessions")}
                            </Button>
                        )}
                    </div>

                    {/* Device List */}
                    <div className="space-y-4">
                        {devices.length > 0 ? (
                            devices.map((device) => (
                                <div
                                    key={device.id}
                                    className={`p-4 rounded-2xl border transition-colors ${device.current
                                        ? 'border-blue-200 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            {/* Device Icon */}
                                            <div className={`p-3 rounded-xl ${device.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {getDeviceIcon(device)}
                                            </div>

                                            {/* Device Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {device.device || t("deviceActivity.unknownDevice", "Unknown Device")}
                                                    </h3>
                                                    {device.current && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-medium bg-green-100 text-green-800">
                                                            {t("deviceActivity.currentDevice", "Current device")}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* OS and Browser Info */}
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                                    <div className="flex items-center space-x-1">
                                                        {getOSIcon(device.os)}
                                                        <span>
                                                            {device.os || 'Unknown OS'} {device.osVersion || ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        {getBrowserIcon(device.browser)}
                                                        <span>{device.browser || 'Unknown Browser'}</span>
                                                    </div>
                                                </div>

                                                {/* Location and Last Access */}
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{device.ipAddress || 'Unknown IP'}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>
                                                            {t("deviceActivity.lastAccess", "Last access")}: {formatDate(device.lastAccess)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Sessions */}
                                                {device.sessions && device.sessions.length > 0 && (
                                                    <div className="mt-3">
                                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                                            {t("deviceActivity.activeSessions", "Active sessions")} ({device.sessions.length})
                                                        </p>
                                                        <div className="space-y-2">
                                                            {device.sessions.slice(0, 3).map((session) => (
                                                                <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl text-xs">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="font-medium">
                                                                            {session.browser || 'Unknown Browser'}
                                                                        </span>
                                                                        <span className="text-gray-500">
                                                                            {formatDate(session.started)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        {session.current ? (
                                                                            <span className="text-green-600 font-medium">
                                                                                {t("deviceActivity.current", "Current")}
                                                                            </span>
                                                                        ) : (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => handleSignOutSession(session.id)}
                                                                                disabled={isLoading}
                                                                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                                                title={t("deviceActivity.signOutSession", "Sign out this session")}
                                                                            >
                                                                                {t("deviceActivity.signOut", "Sign out")}
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {device.sessions.length > 3 && (
                                                                <p className="text-xs text-gray-500">
                                                                    {t("deviceActivity.moreSessions", "And {{count}} more sessions", { count: device.sessions.length - 3 })}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {!device.current && (
                                            <div className="flex-shrink-0">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSignOutDevice(device)}
                                                    loading={isLoading}
                                                    loadingText={t("deviceActivity.signingOut", "Signing out...")}
                                                    leftIcon={<LogOut className="w-4 h-4" />}
                                                    className="border-red-300 text-red-700 hover:bg-red-50 focus:ring-red-500"
                                                >
                                                    {t("deviceActivity.signOutDevice", "Sign out device")}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Monitor className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500">
                                    {t("deviceActivity.noDevices", "No devices found")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Page>
    );
};
