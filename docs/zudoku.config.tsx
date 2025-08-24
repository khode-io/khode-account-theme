import type { ZudokuConfig } from "zudoku";

const config: ZudokuConfig = {
  basePath: "/khode-account-theme",
  site: {
    title: "Khode Account Theme",
  },
  metadata: {
    title: "Khode Account Theme",
    keywords: ["Keycloak", "Theme", "React", "TypeScript", "Tailwind CSS"],
    authors: ["Khode-io"],
    creator: "Khode-io",
    publisher: "Khode-io",
    description: "Modern, customizable Keycloak Account UI theme built with React, TypeScript, and Tailwind CSS",
  },
  navigation: [
    {
      type: "category",
      label: "Documentation",
      items: [
        {
          type: "category",
          label: "Getting Started",
          icon: "sparkles",
          collapsed: true,
          collapsible: false,
          items: [
            "/introduction",
          ],
        },
        {
          type: "category",
          label: "Development",
          icon: "palette",
          collapsed: true,
          collapsible: false,
          items: [
            "/getting-started",
            "/logo-branding",
            "/deployment",
            "/contributing",
          ],
        },
        {
          type: "category",
          label: "Resources",
          icon: "link",
          collapsed: true,
          collapsible: false,
          items: [
            {
              type: "link",
              icon: "github",
              label: "GitHub Repository",
              to: "https://github.com/khode-io/khode-account-theme",
            },
            {
              type: "link",
              icon: "bug",
              label: "Report Issues",
              to: "https://github.com/khode-io/khode-account-theme/issues",
            },
            {
              type: "link",
              icon: "message-circle",
              label: "Discussions",
              to: "https://github.com/khode-io/khode-account-theme/discussions",
            },
            {
              type: "link",
              icon: "shield",
              label: "Keycloak Docs",
              to: "https://www.keycloak.org/documentation",
            },
          ],
        },
      ],
    },
  ],
  redirects: [{ from: "/", to: "/introduction" }],
};

export default config;
