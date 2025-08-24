import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useEnvironment,
    getGroups,
    Group
} from '@keycloak/keycloak-account-ui';
import { Page } from '../components';
import type { AccountEnvironment } from '@keycloak/keycloak-account-ui';
import { Users, XCircle, Info, CheckCircle, ChevronRight, User } from 'lucide-react';

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
            <div className="w-8 h-8 bg-success-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-success-600" />
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
                    <span className="ml-3 text-text-secondary">{t("groups.loading", "Loading groups...")}</span>
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
                    <div className="border-l-4 border-accent-primary pl-4 mb-6">
                        <h1 className="text-2xl font-bold text-text-primary mb-2">
                            {t("groups.title", "Groups")}
                        </h1>
                        <p className="text-text-secondary">
                            {t("groups.description", "Groups you are a member of")}
                        </p>
                    </div>

                    {/* Error Message */}
                    <div className="bg-error-50 border-l-4 border-error-400 p-4 rounded-2xl">
                        <div className="flex items-start">
                            <XCircle className="w-5 h-5 text-error-400 mt-0.5 mr-3" />
                            <div>
                                <h3 className="text-sm font-medium text-error-800 mb-1">
                                    {t("groups.error.title", "Unable to load groups")}
                                </h3>
                                <p className="text-sm text-error-700">
                                    {t("groups.error.description", "You don't have permission to view group information, or the groups feature is not available for your account.")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="bg-primary-50 border-l-4 border-primary-400 p-4 rounded-2xl">
                        <div className="flex items-start">
                            <Info className="w-5 h-5 text-primary-400 mt-0.5 mr-3" />
                            <div>
                                <h3 className="text-sm font-medium text-primary-800 mb-1">
                                    {t("groups.info.title", "About Groups")}
                                </h3>
                                <p className="text-sm text-primary-700">
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
                <div className="border-l-4 border-accent-primary pl-4 mb-6">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        {t("groups.title", "Groups")}
                    </h1>
                    <p className="text-text-secondary">
                        {t("groups.description", "Groups you are a member of")}
                    </p>
                </div>

                {/* Groups List */}
                {groups.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 text-text-tertiary mb-4">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">
                            {t("groups.empty.title", "No group memberships")}
                        </h3>
                        <p className="text-text-tertiary">
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
                                    className="bg-surface border border-border-primary rounded-2xl p-4 shadow-sm"
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
                                                <h3 className="text-lg font-medium text-text-primary">
                                                    {displayName}
                                                </h3>

                                                {/* Level Badge */}
                                                {level > 0 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-primary-100 text-primary-800">
                                                        {t("groups.level", "Level")} {level}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-1 text-sm">
                                                <div>
                                                    <span className="font-medium text-text-secondary">
                                                        {t("groups.path", "Path")}:
                                                    </span>
                                                    <span className="ml-2 text-text-secondary font-mono">
                                                        {group.path || '/'}
                                                    </span>
                                                </div>

                                                {group.id && (
                                                    <div>
                                                        <span className="font-medium text-text-secondary">
                                                            {t("groups.id", "ID")}:
                                                        </span>
                                                        <span className="ml-2 text-text-secondary font-mono text-xs">
                                                            {group.id}
                                                        </span>
                                                    </div>
                                                )}

                                                {parentPath && (
                                                    <div>
                                                        <span className="font-medium text-text-secondary">
                                                            {t("groups.parent", "Parent")}:
                                                        </span>
                                                        <span className="ml-2 text-text-secondary font-mono">
                                                            {parentPath}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Group Type Indicators */}
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {level === 0 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        {t("groups.rootGroup", "Root Group")}
                                                    </span>
                                                )}

                                                {level > 0 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-purple-100 text-purple-800">
                                                        <ChevronRight className="w-3 h-3 mr-1" />
                                                        {t("groups.subGroup", "Sub Group")}
                                                    </span>
                                                )}

                                                <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-secondary-100 text-secondary-800">
                                                    <User className="w-3 h-3 mr-1" />
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
                    <div className="bg-surface-secondary border border-border-primary rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-text-primary mb-3">
                            {t("groups.statistics", "Membership Statistics")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-accent-primary">
                                    {groups.length}
                                </div>
                                <div className="text-text-secondary">
                                    {t("groups.totalGroups", "Total Groups")}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {groups.filter(g => getGroupLevel(g.path) === 0).length}
                                </div>
                                <div className="text-text-secondary">
                                    {t("groups.rootGroups", "Root Groups")}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {groups.filter(g => getGroupLevel(g.path) > 0).length}
                                </div>
                                <div className="text-text-secondary">
                                    {t("groups.subGroups", "Sub Groups")}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Panel */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-2xl">
                    <div className="flex items-start">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5 mr-3" />
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
