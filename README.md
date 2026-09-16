<table><tr><td><img src=".github/assets/trentorch-web-logo.jpg" width="50" height="50" alt="TrenTorch-Web logo" /></td><td><h1>TrenTorch-Web</h1></td></tr></table>

[![CI](https://github.com/TrenTorch/TrenTorch-Web/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/TrenTorch/TrenTorch-Web/actions/workflows/ci.yml)
[![Contributors](https://img.shields.io/badge/contributors-3-orange.svg)](#team-engineers)
[![License](https://img.shields.io/badge/license-PolyForm--Noncommercial--1.0.0-blue.svg)](LICENSE)

Learn PyTorch and Frontier ML by building your own PyTorch, in the browser.

The web version of [TrenTorch](https://github.com/TrenTorch/TrenTorch): the same from-scratch, module-by-module curriculum, without a local install.

Built with [SvelteKit](https://svelte.dev/docs/kit).

## Development

```bash
npm install
npm run dev -- --open
```

## Checks before pushing

```bash
npm run check   # svelte-check (types)
npm run lint     # prettier + eslint
npm run test     # vitest
npm run build    # production build
```

CI runs all of the above on every push and pull request.

## Recreating the scaffold

```bash
npx sv@0.17.0 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography" vitest="usages:unit" --install npm .
```

---

## Team Engineers

Recomputed nightly from real issue/PR activity via [`.github/workflows/update-contributors.yml`](.github/workflows/update-contributors.yml). Want to show up here? Open an issue or a PR: the first-contribution bot will say hello, and this grid picks you up on the next nightly run.

<table width="100%" style="width:100%">
  <tbody>
    <tr>
      <td align="center" valign="top" width="25.0%">
        <a href="https://github.com/maanas1234"><img src="https://avatars.githubusercontent.com/maanas1234?v=4" class="contributor-avatar" width="80px;" alt="maanas1234"/></a>
        <br />
        <b>maanas1234</b>
        <br />
        <sub><strong>Maintainer</strong></sub>
        <br />
        <sub>Spots bugs, corrects them and contributes</sub>
        <br />
        <sub>Issues: 4 &middot; PRs: 32</sub>
      </td>
      <td align="center" valign="top" width="25.0%">
        <a href="https://github.com/Shashank-Tripathi-07"><img src=".github/assets/rocky-avatar.png" class="contributor-avatar" width="80px;" alt="Shashank-Tripathi-07"/></a>
        <br />
        <b>Shashank-Tripathi-07</b>
        <br />
        <sub><strong>Principal Maintainer</strong></sub>
        <br />
        <sub>Spots bugs, corrects them and contributes</sub>
        <br />
        <sub>Issues: 1 &middot; PRs: 32</sub>
      </td>
      <td align="center" valign="top" width="25.0%">
        <a href="https://github.com/ShivtejG236"><img src="https://avatars.githubusercontent.com/ShivtejG236?v=4" class="contributor-avatar" width="80px;" alt="ShivtejG236"/></a>
        <br />
        <b>ShivtejG236</b>
        <br />
        <sub><strong>Maintainer</strong></sub>
        <br />
        <sub>Spots bugs, corrects them and contributes</sub>
        <br />
        <sub>Issues: 0 &middot; PRs: 1</sub>
      </td>
    </tr>
  </tbody>
</table>

---

## License

[PolyForm Noncommercial License 1.0.0](LICENSE): free for personal, educational, and noncommercial use. Not licensed for commercial use.
