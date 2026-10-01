# Teleport Prank - Website

The landing page for the Teleport browser extension, presented as "Teleport Prank". It is a static site with no build step, so it works on any static host.

Developed by [marklibres.site](https://marklibres.site).

## What is on the page

- Hero with a tilted popup screenshot, the mascot, the "PRANK MODE ON!" sticker, city photo cards and a download button
- How it works (3 steps)
- **Live demo**: the real extension popup running in the page, with clickable landmark stickers (Paris, New York, Tokyo, London, Singapore) that set the demo location
- Features and use cases
- Install guide with a browser-aware extensions link and a copy button
- FAQ
- Download banner with the mascot
- Light theme and a responsive layout for phones

## Run it locally

Open `index.html` in a browser. No server is needed. To serve it over http instead:

```
npx serve .
```

When opened as a local file, the demo map uses Esri tiles. When hosted over http(s), it uses OpenStreetMap tiles.

## Structure

```
|-- index.html          # The page
|-- styles.css          # Site styles
|-- script.js           # Browser-aware install link and copy button
|-- demo.js             # Hosts the live demo and the "What a website sees" panel
|-- assets/
|   |-- icon.png        # Extension icon
|   |-- screenshot.png  # Hero screenshot of the popup
|   |-- hero-bg.jpg     # Hero background artwork
|   |-- mascot/         # Mascot poses (transparent WebP)
|   |-- stickers/       # Prank Mode bubble and city photo cards (transparent WebP)
|   `-- pack/           # Wordmark, landmark stickers and mascot emotes (transparent WebP)
|-- demo/               # The live demo (see below)
|   |-- popup.html      # Generated from app/popup.html
|   |-- popup.js        # Generated, obfuscated copy of the app's popup code
|   |-- styles.css      # Generated from app/styles.css
|   |-- leaflet.js/.css # Generated copies of the map library
|   `-- demo-shim.js    # Hand-written stand-in for the extension APIs
`-- downloads/
    `-- teleport-v1.0.0.zip   # Generated package, git-ignored (published as a GitHub release)
```

## How the live demo works

The demo runs the same popup code as the extension inside an iframe. Because a web page has no extension APIs, `demo/demo-shim.js` provides a small replacement for `chrome.storage`, `chrome.tabs`, `chrome.scripting` and `chrome.runtime`. Settings are kept in the visitor's own page storage, and nothing changes their real browser location.

The page listens for messages from the demo and shows what a website would receive in the "What a website sees" panel. The landmark sticker buttons work the other way: `demo.js` posts a `teleport-set-location` message to the frame, and `demo-shim.js` passes the coordinates to the popup's own `setLocation` function.

## Updating the site

Most files under `demo/` and `downloads/` are generated from the app. Do not edit them by hand. After changing the app, run this from the `app/` folder:

```
npm run pack
```

That rebuilds the extension, refreshes `website/demo/` (except `demo-shim.js`) and replaces the zip in `website/downloads/`.

To also commit and push the refreshed demo to this repo in one step, run `npm run publish-site` from `app/` instead. See the app README for its options. It only commits files under `demo/`, so commit changes to the rest of the site yourself.

When you release a new version:
1. Update the version in `app/manifest.json`.
2. Run `npm run pack`.
3. Create a GitHub release for the new version and attach `app/dist/teleport-v<version>.zip` to it.
4. Update the download links in `index.html` to the release asset URL, and update the "Version" text in the hero.

Things you edit by hand: `index.html`, `styles.css`, `script.js`, `demo.js`, `demo/demo-shim.js` and `assets/`.

To refresh `assets/screenshot.png`, take a new screenshot of the popup (640 px wide works best) and replace the file.

## Deploying

Upload the contents of this folder to any static host, such as Netlify, Cloudflare Pages, GitHub Pages or your own server. Set the publish directory to `website`. There is nothing to build.

The generated files in `demo/` must be included in what you deploy, so they are not git-ignored. Zip files are git-ignored, so the download links must point to the GitHub release, not to `downloads/`.

## License

Proprietary. All rights reserved. See the license in the `app` folder. The demo bundles Leaflet under its own BSD 2-Clause license, and map data is from OpenStreetMap contributors.
