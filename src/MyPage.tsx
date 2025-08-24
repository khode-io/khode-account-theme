import {
  AccountEnvironment,
  UserRepresentation,
  getPersonalInfo,
  savePersonalInfo,
  useEnvironment,
  usePromise,
} from "@keycloak/keycloak-account-ui";
import { Page, Button } from "./components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { showSuccessToast, showErrorToast } from "./utils";

export const MyPage = () => {
  const { t } = useTranslation();
  const context = useEnvironment<AccountEnvironment>();
  const [personalInfo, setPersonalInfo] = useState<UserRepresentation>();

  const [isLoading, setIsLoading] = useState(false);

  usePromise((signal) => getPersonalInfo({ signal, context }), setPersonalInfo);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await savePersonalInfo(context, personalInfo);
      showSuccessToast(t("myPage.save.success"));
    } catch (error) {
      console.error(error);
      showErrorToast("Not able to save personal info");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page
      title={"My personal info page"}
      description={"Example of a personal info page"}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
          <p className="text-gray-600">Manage your account details and preferences</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={personalInfo?.email || ""}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            {/* First Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={personalInfo?.firstName || ""}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, firstName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={personalInfo?.lastName || ""}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your last name"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
                loadingText="Saving..."
              >
                {t("save")}
              </Button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Changes will be saved immediately to your account
        </div>
      </div>
    </Page>
  );
};
