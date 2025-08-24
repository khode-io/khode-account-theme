import {
    AccountEnvironment,
    UserRepresentation,
    UserProfileAttributeMetadata,
    getPersonalInfo,
    savePersonalInfo,
    useEnvironment,
    usePromise,
} from "@keycloak/keycloak-account-ui";
import { Page, TextField, SelectField, TextAreaField, Button, TextSkeleton, RoundedSkeleton } from "../components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { showPromiseToast } from "../utils";

export const PersonalInfo = () => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const [personalInfo, setPersonalInfo] = useState<UserRepresentation>();
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);

    usePromise(
        async (signal) => {
            const data = await getPersonalInfo({ signal, context });
            setIsDataLoading(false);
            return data;
        },
        setPersonalInfo
    );

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        const savePromise = savePersonalInfo(context, personalInfo);

        showPromiseToast(savePromise, {
            loading: t("personalInfo.save.loading", "Saving personal information..."),
            success: t("personalInfo.save.success", "Personal information updated successfully"),
            error: t("personalInfo.save.error", "Failed to update personal information")
        }).finally(() => {
            setIsLoading(false);
        });
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

    // Helper function to get input type based on attribute annotations and validators
    const getInputType = (attribute: UserProfileAttributeMetadata) => {
        // Check for explicit input type annotation
        if (attribute.annotations?.inputType) {
            return attribute.annotations.inputType;
        }

        // Check validators for specific types
        if (attribute.name === 'email' || attribute.validators?.email) return 'email';
        if (attribute.validators?.uri || attribute.name.toLowerCase().includes('url') || attribute.name.toLowerCase().includes('website')) return 'url';
        if (attribute.name.toLowerCase().includes('phone') || attribute.name.toLowerCase().includes('mobile') || attribute.name.toLowerCase().includes('tel')) return 'tel';
        if (attribute.name.toLowerCase().includes('number') || attribute.name.toLowerCase().includes('age') || attribute.validators?.integer || attribute.validators?.double) return 'number';
        if (attribute.name.toLowerCase().includes('password')) return 'password';
        if (attribute.name.toLowerCase().includes('search')) return 'search';

        // Check for options validator (indicates select field)
        if (attribute.validators?.options) return 'select';

        // Check for textarea annotation or long text fields
        if (attribute.annotations?.inputType === 'textarea' ||
            attribute.name.toLowerCase().includes('description') ||
            attribute.name.toLowerCase().includes('bio') ||
            attribute.name.toLowerCase().includes('about') ||
            attribute.name.toLowerCase().includes('comment') ||
            attribute.name.toLowerCase().includes('note')) {
            return 'textarea';
        }

        return 'text';
    };

    // Helper function to get options for select fields
    const getSelectOptions = (attribute: UserProfileAttributeMetadata) => {
        if (attribute.validators?.options?.options) {
            return attribute.validators.options.options.map((option: string) => ({
                value: option,
                label: option
            }));
        }
        return [];
    };

    // Helper function to get validation attributes
    const getValidationAttributes = (attribute: UserProfileAttributeMetadata) => {
        const validationAttrs: any = {};

        if (attribute.validators?.length) {
            if (attribute.validators.length.min) {
                validationAttrs.minLength = parseInt(attribute.validators.length.min);
            }
            if (attribute.validators.length.max) {
                validationAttrs.maxLength = parseInt(attribute.validators.length.max);
            }
        }

        return validationAttrs;
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
        const validationAttrs = getValidationAttributes(attribute);

        // Render select field for options-based attributes
        if (inputType === 'select') {
            const options = getSelectOptions(attribute);
            return (
                <SelectField
                    key={attribute.name}
                    label={displayName}
                    id={attribute.name}
                    name={attribute.name}
                    value={fieldValue}
                    options={options}
                    required={attribute.required}
                    readOnly={isReadOnly}
                    placeholder={!attribute.required ? `Select ${displayName.toLowerCase()}...` : undefined}
                    onChange={(e) => updateFieldValue(attribute.name, e.target.value)}
                    layout="horizontal"
                />
            );
        }

        // Render textarea field for long text content
        if (inputType === 'textarea') {
            return (
                <TextAreaField
                    key={attribute.name}
                    label={displayName}
                    id={attribute.name}
                    name={attribute.name}
                    value={fieldValue}
                    required={attribute.required}
                    readOnly={isReadOnly}
                    rows={4}
                    placeholder={`Enter ${displayName.toLowerCase()}...`}
                    onChange={(e) => updateFieldValue(attribute.name, e.target.value)}
                    layout="horizontal"
                    {...validationAttrs}
                />
            );
        }

        // Render regular text field
        return (
            <TextField
                key={attribute.name}
                label={displayName}
                type={inputType as any}
                id={attribute.name}
                name={attribute.name}
                value={fieldValue}
                required={attribute.required}
                readOnly={isReadOnly}
                helpText={isReadOnly && attribute.name === 'username' ? t("personalInfo.usernameHelp", "Username cannot be changed") : undefined}
                onChange={(e) => updateFieldValue(attribute.name, e.target.value)}
                layout="horizontal"
                {...validationAttrs}
            />
        );
    };

    return (
        <Page
            title={t("personalInfo.title", "Personal info")}
            description={t("personalInfo.description", "Manage your basic information")}
            className="mt-4 p-4"
        >
            <div className="space-y-6">

                {/* General Section */}
                <div id="general" className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    {isDataLoading ? (
                        <>
                            {/* General Header Skeleton */}
                            <div className="mb-6">
                                <TextSkeleton width="80px" height="28px" />
                            </div>

                            {/* Form Skeleton */}
                            <div className="space-y-6">
                                {/* Username Field Skeleton */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="md:col-span-1 pt-2">
                                        <TextSkeleton width="80px" height="14px" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <RoundedSkeleton height="42px" className="w-full" />
                                    </div>
                                </div>

                                {/* Email Field Skeleton */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="md:col-span-1 pt-2">
                                        <TextSkeleton width="50px" height="14px" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <RoundedSkeleton height="42px" className="w-full" />
                                    </div>
                                </div>

                                {/* First Name Field Skeleton */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="md:col-span-1 pt-2">
                                        <TextSkeleton width="85px" height="14px" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <RoundedSkeleton height="42px" className="w-full" />
                                    </div>
                                </div>

                                {/* Last Name Field Skeleton */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                    <div className="md:col-span-1 pt-2">
                                        <TextSkeleton width="80px" height="14px" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <RoundedSkeleton height="42px" className="w-full" />
                                    </div>
                                </div>

                                {/* Action Buttons Skeleton */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <RoundedSkeleton width="60px" height="42px" />
                                    </div>
                                    <div className="text-xs">
                                        <TextSkeleton width="120px" height="12px" />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* General Header */}
                            <div className="border-l-4 border-blue-600 pl-4 mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {t("personalInfo.general", "General")}
                                </h2>
                            </div>

                            {/* Real Form */}
                            <form onSubmit={onSubmit} className="space-y-6">
                                {/* Dynamic Fields based on User Profile Configuration */}
                                {userAttributes.length > 0 ? (
                                    userAttributes.map((attribute: UserProfileAttributeMetadata) => renderFormField(attribute))
                                ) : (
                                    // Fallback to basic fields if no metadata available
                                    <>
                                        {/* Username Field */}
                                        <TextField
                                            label={t("username", "Username")}
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={personalInfo?.username || ""}
                                            required
                                            readOnly
                                            helpText={t("personalInfo.usernameHelp", "Username cannot be changed")}
                                            layout="horizontal"
                                        />

                                        {/* Email Field */}
                                        <TextField
                                            label={t("email", "Email")}
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={personalInfo?.email || ""}
                                            required
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                            layout="horizontal"
                                        />

                                        {/* First Name Field */}
                                        <TextField
                                            label={t("firstName", "First name")}
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={personalInfo?.firstName || ""}
                                            required
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                                            layout="horizontal"
                                        />

                                        {/* Last Name Field */}
                                        <TextField
                                            label={t("lastName", "Last name")}
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={personalInfo?.lastName || ""}
                                            required
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                                            layout="horizontal"
                                        />
                                    </>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            loading={isLoading}
                                            loadingText={t("saving", "Saving...")}
                                        >
                                            {t("save", "Save")}
                                        </Button>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        * {t("personalInfo.requiredFields", "Required fields")}
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </Page>
    );
};
