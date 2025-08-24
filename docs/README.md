# Khode Account Theme Documentation

This directory contains the documentation website built with [Zudoku](https://zudoku.dev/).

## Local Development

```bash
cd docs
npm install
npm run dev
```

Visit http://localhost:3000 to view the documentation locally.

## GitHub Pages Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Setup GitHub Pages

1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. The workflow will automatically deploy on the next push to `main`

### Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in your repository
2. Select "Deploy Documentation" workflow
3. Click "Run workflow" → "Run workflow"

## Build Locally

```bash
cd docs
npm run build
```

The built site will be in the `dist/` directory.

## Configuration

The documentation is configured in `zudoku.config.tsx`. You can customize:

- Site title and description
- Navigation structure
- Logo and branding
- API documentation

## Adding Content

1. Add new `.mdx` files to the `pages/` directory
2. Update navigation in `zudoku.config.tsx`
3. Push changes to trigger automatic deployment

## Troubleshooting

If deployment fails:

1. Check the **Actions** tab for error logs
2. Ensure all dependencies are properly installed
3. Verify the build works locally with `npm run build`
4. Check that GitHub Pages is enabled in repository settings