# Custom Keycloak Account UI

This is a template to build a custom Keycloak Account UI using the [Keycloak Account UI](https://npmjs.com/package/@keycloak/keycloak-account-ui) package.

## Getting started

To use HMR (Hot module replacement) in development, run the following command:

```bash
pnpm i
pnpm run dev
```
Then start the Keycloak server:

```bash
pnpm run start-keycloak
```

open the admin-console in your browser (http://localhost:8080/), when you the go to the `Manage Account` by clicking on the name in the toolbar, you will see the custom UI.

## Build

To build the application for production, run the following command:

```bash
mvn install
```
This will create a "jar" file in the `target` directory that you can deploy to your Keycloak server by copying it to the `providers` directory.

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