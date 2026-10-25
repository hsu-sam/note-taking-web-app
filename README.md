# note-taking-web-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

## Google Sign-In

Google sign-in uses Supabase OAuth. In the Supabase dashboard, enable the
Google provider under **Authentication → Sign In / Providers** and enter the
OAuth client ID and secret from a Google Cloud web OAuth client. Set the
authorized redirect URI in Google Cloud to the Supabase callback URL shown in
the provider settings (typically `https://<project-ref>.supabase.co/auth/v1/callback`).

Add the app URLs to **Authentication → URL Configuration → Redirect URLs** in
Supabase, for example:

- `http://localhost:5173/**` for local development
- `https://your-app-domain.example/**` for production

The app returns from Google to `/login` and then routes the user to the intended
page, or to Home when there is no saved destination.
