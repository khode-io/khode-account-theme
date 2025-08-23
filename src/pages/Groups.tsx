import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Page,
    useEnvironment,
    getGroups,
    Group
} from '@keycloak/keycloak-account-ui';
import type { AccountEnvironment } from '@keycloak/keycloak-account-ui';

export const Groups: React.FC = () => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const [groups, setGroups] = useState<Group[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Fetch groups data with error handling
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await getGroups({ context });
                setGroups(data);
                setHasError(false);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
                setHasError(true);
            } finally {
                setHasLoaded(true);
            }
        };

        fetchGroups();
    }, [context]);



    const getGroupIcon = () => {
        return (
            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
        );
    };

    const getGroupLevel = (path: string) => {
        if (!path) return 0;
        // Count the number of '/' characters to determine nesting level
        return (path.match(/\//g) || []).length;
    };

    const getGroupDisplayName = (group: Group) => {
        // Extract the group name from the path (last segment)
        if (group.path) {
            const segments = group.path.split('/').filter(segment => segment.length > 0);
            return segments[segments.length - 1] || group.name;
        }
        return group.name;
    };

    const getParentPath = (path: string) => {
        if (!path) return '';
        const segments = path.split('/').filter(segment => segment.length > 0);
        if (segments.length <= 1) return '';
        return '/' + segments.slice(0, -1).join('/');
    };

    const sortGroupsByPath = (groups: Group[]) => {
        return [...groups].sort((a, b) => {
            const pathA = a.path || '';
            const pathB = b.path || '';
            return pathA.localeCompare(pathB);
        });
    };

    // Show loading spinner if data hasn't been loaded yet
    if (!hasLoaded) {
        return (
            <Page title={t("groups.title", "Groups")} description="">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">{t("groups.loading", "Loading groups...")}</span>
                </div>
            </Page>
        );
    }

    // Show error message if API call failed
    if (hasError) {
        return (
            <Page title={t("groups.title", "Groups")} description="">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="border-l-4 border-blue-600 pl-4 mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {t("groups.title", "Groups")}
                        </h1>
                        <p className="text-gray-600">
                            {t("groups.description", "Groups you are a member of")}
                        </p>
                    </div>

                    {/* Error Message */}
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-2xl">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-red-800 mb-1">
                                    {t("groups.error.title", "Unable to load groups")}
                                </h3>
                                <p className="text-sm text-red-700">
                                    {t("groups.error.description", "You don't have permission to view group information, or the groups feature is not available for your account.")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-2xl">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-blue-800 mb-1">
                                    {t("groups.info.title", "About Groups")}
                                </h3>
                                <p className="text-sm text-blue-700">
                                    {t("groups.info.noAccess", "Groups are used to organize users and manage permissions. If you need access to group information, please contact your administrator.")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        );
    }

    const sortedGroups = sortGroupsByPath(groups);

    return (
        <Page title={t("groups.title", "Groups")} description="">
            <div className="space-y-6">
                {/* Header */}
                <div className="border-l-4 border-blue-600 pl-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {t("groups.title", "Groups")}
                    </h1>
                    <p className="text-gray-600">
                        {t("groups.description", "Groups you are a member of")}
                    </p>
                </div>

                {/* Groups List */}
                {groups.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {t("groups.empty.title", "No group memberships")}
                        </h3>
                        <p className="text-gray-500">
                            {t("groups.empty.description", "You are not a member of any groups yet.")}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedGroups.map((group) => {
                            const level = getGroupLevel(group.path);
                            const displayName = getGroupDisplayName(group);
                            const parentPath = getParentPath(group.path);

                            return (
                                <div
                                    key={group.id || group.path}
                                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                                    style={{ marginLeft: `${level * 20}px` }}
                                >
                                    <div className="flex items-center space-x-4">
                                        {/* Group Icon */}
                                        <div className="flex-shrink-0">
                                            {getGroupIcon()}
                                        </div>

                                        {/* Group Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-3 mb-1">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {displayName}
                                                </h3>

                                                {/* Level Badge */}
                                                {level > 0 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-blue-100 text-blue-800">
                                                        {t("groups.level", "Level")} {level}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-1 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">
                                                        {t("groups.path", "Path")}:
                                                    </span>
                                                    <span className="ml-2 text-gray-600 font-mono">
                                                        {group.path || '/'}
                                                    </span>
                                                </div>

                                                {group.id && (
                                                    <div>
                                                        <span className="font-medium text-gray-700">
                                                            {t("groups.id", "ID")}:
                                                        </span>
                                                        <span className="ml-2 text-gray-600 font-mono text-xs">
                                                            {group.id}
                                                        </span>
                                                    </div>
                                                )}

                                                {parentPath && (
                                                    <div>
                                                        <span className="font-medium text-gray-700">
                                                            {t("groups.parent", "Parent")}:
                                                        </span>
                                                        <span className="ml-2 text-gray-600 font-mono">
                                                            {parentPath}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Group Type Indicators */}
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {level === 0 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-green-100 text-green-800">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        {t("groups.rootGroup", "Root Group")}
                                                    </span>
                                                )}

                                                {level > 0 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-purple-100 text-purple-800">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        {t("groups.subGroup", "Sub Group")}
                                                    </span>
                                                )}

                                                <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-gray-100 text-gray-800">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    {t("groups.member", "Member")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Statistics Panel */}
                {groups.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                            {t("groups.statistics", "Membership Statistics")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {groups.length}
                                </div>
                                <div className="text-gray-600">
                                    {t("groups.totalGroups", "Total Groups")}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {groups.filter(g => getGroupLevel(g.path) === 0).length}
                                </div>
                                <div className="text-gray-600">
                                    {t("groups.rootGroups", "Root Groups")}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {groups.filter(g => getGroupLevel(g.path) > 0).length}
                                </div>
                                <div className="text-gray-600">
                                    {t("groups.subGroups", "Sub Groups")}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Panel */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-2xl">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-blue-800 mb-1">
                                {t("groups.info.title", "About Groups")}
                            </h3>
                            <p className="text-sm text-blue-700">
                                {t("groups.info.description", "Groups are used to organize users and manage permissions. Your group memberships determine what resources and features you can access. Group hierarchy is shown with indentation, where sub-groups are nested under their parent groups.")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default Groups;
