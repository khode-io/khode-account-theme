import {
    AccountEnvironment,
    Page,
    UserRepresentation,
    UserProfileAttributeMetadata,
    getPersonalInfo,
    savePersonalInfo,
    useAlerts,
    useEnvironment,
    usePromise,
} from "@keycloak/keycloak-account-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const PersonalInfo = () => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const [personalInfo, setPersonalInfo] = useState<UserRepresentation>();
    const { addAlert, addError } = useAlerts();
    const [isLoading, setIsLoading] = useState(false);

    usePromise((signal) => getPersonalInfo({ signal, context }), setPersonalInfo);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            await savePersonalInfo(context, personalInfo);
            addAlert(t("personalInfo.save.success", "Personal information updated successfully"));
        } catch (error) {
            console.error(error);
            addError(t("personalInfo.save.error", "Failed to update personal information"));
        } finally {
            setIsLoading(false);
        }
    };

    // Get user profile attributes from metadata
    const userAttributes = personalInfo?.userProfileMetadata?.attributes || [];

    // Helper function to get field value
    const getFieldValue = (attributeName: string) => {
        if (attributeName === 'username') return personalInfo?.username || '';
        if (attributeName === 'email') return personalInfo?.email || '';
        if (attributeName === 'firstName') return personalInfo?.firstName || '';
        if (attributeName === 'lastName') return personalInfo?.lastName || '';

        // For custom attributes, check the attributes object
        return personalInfo?.attributes?.[attributeName]?.[0] || '';
    };

    // Helper function to update field value
    const updateFieldValue = (attributeName: string, value: string) => {
        if (attributeName === 'username') {
            setPersonalInfo({ ...personalInfo, username: value });
        } else if (attributeName === 'email') {
            setPersonalInfo({ ...personalInfo, email: value });
        } else if (attributeName === 'firstName') {
            setPersonalInfo({ ...personalInfo, firstName: value });
        } else if (attributeName === 'lastName') {
            setPersonalInfo({ ...personalInfo, lastName: value });
        } else {
            // For custom attributes
            const newAttributes = { ...personalInfo?.attributes };
            newAttributes[attributeName] = [value];
            setPersonalInfo({ ...personalInfo, attributes: newAttributes });
        }
    };

    // Helper function to get input type based on attribute name and validators
    const getInputType = (attribute: UserProfileAttributeMetadata) => {
        if (attribute.name === 'email') return 'email';
        if (attribute.validators?.email) return 'email';
        if (attribute.validators?.uri) return 'url';
        if (attribute.name.toLowerCase().includes('phone')) return 'tel';
        return 'text';
    };

    // Helper function to get proper display name
    const getDisplayName = (attribute: UserProfileAttributeMetadata) => {
        // Use displayName if available and not a template
        if (attribute.displayName && !attribute.displayName.includes('${')) {
            return attribute.displayName;
        }

        // Fallback to translated standard field names
        switch (attribute.name) {
            case 'username':
                return t("username", "Username");
            case 'email':
                return t("email", "Email");
            case 'firstName':
                return t("firstName", "First name");
            case 'lastName':
                return t("lastName", "Last name");
            default:
                // For custom attributes, try to make the name more readable
                return attribute.name
                    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                    .replace(/^./, (str: string) => str.toUpperCase()) // Capitalize first letter
                    .trim();
        }
    };

    // Helper function to render a form field
    const renderFormField = (attribute: UserProfileAttributeMetadata) => {
        const fieldValue = getFieldValue(attribute.name);
        const isReadOnly = attribute.readOnly || attribute.name === 'username';
        const inputType = getInputType(attribute);
        const displayName = getDisplayName(attribute);

        return (
            <div key={attribute.name} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-1">
                    <label
                        htmlFor={attribute.name}
                        className="block text-sm font-medium text-gray-700"
                    >
                        {displayName} {attribute.required && '*'}
                    </label>
                </div>
                <div className="md:col-span-2">
                    <input
                        type={inputType}
                        id={attribute.name}
                        name={attribute.name}
                        required={attribute.required}
                        readOnly={isReadOnly}
                        value={fieldValue}
                        onChange={(e) => updateFieldValue(attribute.name, e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isReadOnly
                            ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                            : ''
                            }`}
                    />
                    {isReadOnly && attribute.name === 'username' && (
                        <p className="mt-1 text-xs text-gray-500">
                            {t("personalInfo.usernameHelp", "Username cannot be changed")}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Page
            title={t("personalInfo.title", "Personal info")}
            description={t("personalInfo.description", "Manage your basic information")}
        >
            <div className="space-y-6">

                {/* General Section */}
                <div id="general" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="border-l-4 border-blue-600 pl-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {t("personalInfo.general", "General")}
                        </h2>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Dynamic Fields based on User Profile Configuration */}
                        {userAttributes.length > 0 ? (
                            userAttributes.map((attribute: UserProfileAttributeMetadata) => renderFormField(attribute))
                        ) : (
                            // Fallback to basic fields if no metadata available
                            <>
                                {/* Username Field */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="md:col-span-1">
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                            {t("username", "Username")} *
                                        </label>
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={personalInfo?.username || ""}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            {t("personalInfo.usernameHelp", "Username cannot be changed")}
                                        </p>
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="md:col-span-1">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            {t("email", "Email")} *
                                        </label>
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={personalInfo?.email || ""}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* First Name Field */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="md:col-span-1">
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                            {t("firstName", "First name")} *
                                        </label>
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            required
                                            value={personalInfo?.firstName || ""}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Last Name Field */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="md:col-span-1">
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                            {t("lastName", "Last name")} *
                                        </label>
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            required
                                            value={personalInfo?.lastName || ""}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <div className="flex items-center">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t("saving", "Saving...")}
                                        </>
                                    ) : (
                                        t("save", "Save")
                                    )}
                                </button>
                            </div>

                            <div className="text-xs text-gray-500">
                                * {t("personalInfo.requiredFields", "Required fields")}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Page>
    );
};
