# Khode Account Theme

A modern, customizable Keycloak Account UI theme built with React, TypeScript, and Tailwind CSS.

![Khode Account Theme](https://img.shields.io/badge/Keycloak-26.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.16-blue)

## Features

- **Modern UI/UX** - Clean, intuitive interface with responsive design
- **Dark/Light Theme** - Automatic and manual theme switching
- **Mobile-First** - Optimized for all device sizes
- **Customizable** - Easy branding, colors, and logo customization
- **Fast Development** - Hot Module Replacement for instant updates
- **Secure** - Built on Keycloak's robust authentication system
- **i18n Ready** - Internationalization support

## Quick Start

```bash
# Clone and install
git clone https://github.com/khode-io/khode-account-theme.git
cd khode-account-theme
pnpm install

# Start development
pnpm run dev          # Terminal 1: React dev server
pnpm run start-keycloak  # Terminal 2: Keycloak server
```

Visit [http://localhost:8080](http://localhost:8080) → Admin Console → "Manage Account" to see your custom theme.

## Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Getting Started](./docs/pages/getting-started.md)** - Installation and setup guide
- **[Logo & Branding](./docs/pages/logo-branding.mdx)** - Customize logos and colors
- **[Customization Guide](./docs/pages/customization-guide.mdx)** - Advanced customization
- **[Contributing](./docs/pages/contributing.mdx)** - How to contribute to the project
- **[API Reference](./docs/pages/api-reference.mdx)** - Technical documentation
- **[Deployment](./docs/pages/deployment.mdx)** - Production deployment guide
- **[Troubleshooting](./docs/pages/troubleshooting.mdx)** - Common issues and solutions

## Build for Production

```bash
# Build the complete theme JAR
mvn clean install

# Deploy to Keycloak
cp target/khode-account-26.0.0.jar /path/to/keycloak/providers/
```

## GitHub Actions

This project includes automated CI/CD workflows:

### Continuous Integration
- Runs on every push to `main`/`develop` branches and pull requests
- Builds the frontend and verifies the Maven compilation
- Ensures code quality and build integrity

### Release Workflow
- Triggered by pushing a git tag (e.g., `v1.0.0`) or manually via workflow dispatch
- Builds the complete project and creates a GitHub release
- Uploads the JAR artifact to the release for easy deployment

To create a release:
```bash
git tag v1.0.0
git push origin v1.0.0
```