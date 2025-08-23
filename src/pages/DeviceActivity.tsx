import {
    AccountEnvironment,
    Page,
    DeviceRepresentation,
    getDevices,
    deleteSession,
    useAlerts,
    useEnvironment,
    usePromise,
} from "@keycloak/keycloak-account-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
        return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        );
    };

    // Helper function to get device icon
    const getDeviceIcon = (device: DeviceRepresentation) => {
        if (device.mobile) {
            return (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                </svg>
            );
        }
        return (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        );
    };

    // Helper function to get OS icon
    const getOSIcon = (os?: string) => {
        if (!os || os.trim() === '') return getDefaultIcon();
        const osLower = os.toLowerCase();
        if (osLower.includes('windows')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351" />
                </svg>
            );
        } else if (osLower.includes('mac') || osLower.includes('ios')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
            );
        } else if (osLower.includes('android')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.5046C15.5027 8.2006 13.8386 7.9746 12 7.9746c-1.8386 0-3.5027.2260-4.1479.8368L5.8298 5.2668a.4161.4161 0 00-.5972-.1518.416.416 0 00-.1518.5972L7.0681 9.3214C4.9867 10.6235 3.8013 12.6301 3.8013 14.8707v.7173c0 .3985.3216.7201.7201.7201h14.9572c.3985 0 .7201-.3216.7201-.7201v-.7173c0-2.2406-1.1854-4.2472-3.2668-5.5493" />
                </svg>
            );
        } else if (osLower.includes('linux')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 01-.088.094c-.188.159-.406.266-.787.271-.572.012-.943-.725-1.029-1.308a.99.99 0 01.037-.457c.06-.208.156-.404.303-.533.148-.129.34-.195.528-.195z" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        );
    };

    // Helper function to get browser icon
    const getBrowserIcon = (browser?: string) => {
        if (!browser || browser.trim() === '') return getDefaultIcon();
        const browserLower = browser.toLowerCase();
        if (browserLower.includes('chrome')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001c-.002.002-.002.002-.004.003l-8.344-.001A5.474 5.474 0 0 1 6.545 12c0-.85.194-1.651.533-2.364zm-3.928 12.238A11.947 11.947 0 0 0 24 12c0-1.25-.191-2.457-.545-3.6H12c-.85 0-1.651.194-2.364.533A5.474 5.474 0 0 1 12 6.545z" />
                </svg>
            );
        } else if (browserLower.includes('firefox')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.768 19.441c-2.171 2.171-5.071 3.372-8.168 3.372-6.379 0-11.547-5.168-11.547-11.547C-0.947 5.168 4.221 0 10.6 0c3.097 0 5.997 1.201 8.168 3.372 2.171 2.171 3.372 5.071 3.372 8.168 0 3.097-1.201 5.997-3.372 8.168z" />
                </svg>
            );
        } else if (browserLower.includes('safari')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm0-1c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11z" />
                </svg>
            );
        } else if (browserLower.includes('edge')) {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.86 17.86c.14-.24.14-.54 0-.78l-9.15-15.68c-.14-.24-.4-.4-.71-.4-.31 0-.57.16-.71.4L2.14 17.08c-.14.24-.14.54 0 .78.14.24.4.4.71.4h18.3c.31 0 .57-.16.71-.4z" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        );
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
                            <button
                                onClick={handleSignOutAllSessions}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-xl text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t("deviceActivity.signingOut", "Signing out...")}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        {t("deviceActivity.signOutAll", "Sign out all sessions")}
                                    </>
                                )}
                            </button>
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
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span>{device.ipAddress || 'Unknown IP'}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
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
                                                                            <button
                                                                                onClick={() => handleSignOutSession(session.id)}
                                                                                disabled={isLoading}
                                                                                className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                title={t("deviceActivity.signOutSession", "Sign out this session")}
                                                                            >
                                                                                {t("deviceActivity.signOut", "Sign out")}
                                                                            </button>
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
                                                <button
                                                    onClick={() => handleSignOutDevice(device)}
                                                    disabled={isLoading}
                                                    className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-xl text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            {t("deviceActivity.signingOut", "Signing out...")}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                            </svg>
                                                            {t("deviceActivity.signOutDevice", "Sign out device")}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500">
                                    {t("deviceActivity.noDevices", "No devices found")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Security Info Panel */}
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-amber-700 rounded-2xl">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium">
                                {t("deviceActivity.securityTip", "Security tip")}
                            </p>
                            <p className="text-sm mt-1">
                                {t("deviceActivity.securityTip.description", "If you see a device you don't recognize, sign it out immediately and change your password.")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};
