# ScanRuler desktop (Windows)

An Electron wrapper that runs the ScanRuler web app as a standalone Windows
program, fully offline. It serves the Vite build from `../dist` over an
`app://` scheme so the workers and WebAssembly modules load as on the web.

## Build

```sh
npm ci            # in the repo root, once
cd desktop
npm ci
npm run dist      # builds the web app, then the exes
```

Output in `desktop/release/`:

- `ScanRuler <version>.exe` — portable, no install
- `ScanRuler Setup <version>.exe` — installer

`npm start` runs the app from `../dist` without packaging.

If `ELECTRON_RUN_AS_NODE` is set in your environment, unset it first, or
Electron starts as plain Node.

## Release

CI runs only for releases. Set `version` in `desktop/package.json` (keep it
the same as the root `package.json`), commit, then tag and push:

```sh
git tag desktop-v0.9.2
git push origin desktop-v0.9.2
```

The [Desktop release](../.github/workflows/desktop-release.yml) workflow
runs the tests, builds both exes on Windows and attaches them to a GitHub
release of that tag.

## Upstream updates

`upstream` is CNC Kitchen's repo. To take a new version:

```sh
git pull upstream main
```

then bump `desktop/package.json` to the new version, rebuild and test.

## Differences from scanruler.com

- Short links (`/s/<name>`) need the website and do not open here.
- The exes are not code-signed; Windows SmartScreen warns on first run.

ScanRuler is AGPL-3.0; see [../LICENSE](../LICENSE).
