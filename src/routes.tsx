import type { IndexRouteObject, RouteObject } from "react-router-dom";
import App from "./App";
import { environment } from "./environment";
import {
  Resources,
} from "@keycloak/keycloak-account-ui";
// import { MyPage } from "./MyPage";
import { PersonalInfo } from "./pages/PersonalInfo";
import { DeviceActivity } from "./pages/DeviceActivity";
import { LinkedAccounts } from "./pages/LinkedAccounts";
import { SigningIn } from "./pages/SigningIn";
import { Applications } from "./pages/Applications";
import { Groups } from "./pages/Groups";

export const DeviceActivityRoute: RouteObject = {
  path: "device-activity",
  element: <DeviceActivity />,
};

export const LinkedAccountsRoute: RouteObject = {
  path: "linked-accounts",
  element: <LinkedAccounts />,
};

export const SigningInRoute: RouteObject = {
  path: "security",
  element: <SigningIn />,
};

export const ApplicationsRoute: RouteObject = {
  path: "applications",
  element: <Applications />,
};

export const GroupsRoute: RouteObject = {
  path: "groups",
  element: <Groups />,
};

export const ResourcesRoute: RouteObject = {
  path: "resources",
  element: <Resources />,
};

export const IndexRoute: IndexRouteObject = {
  index: true,
  element: <PersonalInfo />,
};

export const PersonalInfoRoute: RouteObject = {
  path: "personal-info",
  element: <PersonalInfo />,
};

// export const MyPageRoute: RouteObject = {
//   path: "myPage",
//   element: <MyPage />,
// };

export const RootRoute: RouteObject = {
  path: decodeURIComponent(new URL(environment.baseUrl).pathname),
  element: <App />,
  errorElement: <>Error</>,
  children: [
    IndexRoute,
    PersonalInfoRoute,
    SigningInRoute,
    LinkedAccountsRoute,
    DeviceActivityRoute,
    ApplicationsRoute,
    // GroupsRoute,
    // ResourcesRoute,
    // MyPageRoute,
  ],
};

export const routes: RouteObject[] = [RootRoute];
