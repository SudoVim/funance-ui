# funance-ui

React frontend for [funance](https://github.com/SudoVim/funance).

## Requirements

Node.js 22.12 or newer. Vite 8 does not run on Node 18.

## Scripts

- `npm start` starts the Vite dev server at [http://localhost:5173](http://localhost:5173).
- `npm run build` type-checks with `tsc` and writes a production bundle to `dist/`.
- `npm test` runs Vitest in watch mode. `npx vitest run` runs the suite once.
- `npm run check-format` checks Prettier. `npm run format` writes it.

## Run locally against funance

funance serves the API at `http://localhost:8005` when started with its Docker Compose file (`web` publishes port 8005). Its CORS list already allows `http://localhost:5173`.

```bash
# in the funance repo
make build
make shell
./manage.py migrate
./manage.py createsuperuser --username <username> --email <email>
```

Leave the API running, then in this repo:

```bash
npm install
npm start
```

The UI calls `http://localhost:8005/api/v1/` unless `VITE_API_URL` is set. Set `VITE_API_CROSS_SITE=true` when the UI and API are on different sites and the browser should send `Sec-Fetch-Site: cross-site`. Copy those into `.env` (Vite only exposes variables prefixed with `VITE_`).

Sign in with the Django user. Login is `POST /api/v1/accounts/login` and uses Knox: the response is `{ "token", "expiry" }`, and later requests send `Authorization: Token <token>`.

## What still needs a funance API

Login, logout, the current account, fund create/list/get/update, and holding-account create/list/get/update are wired to endpoints that exist today. Fund allocations and holding-account actions are not. Those screens stay empty until funance adds the endpoints described in the pull request. Two existing endpoints are also broken on the server and are called out there: `FundSerializer` references a `shares` field the `Fund` model no longer has, and `HoldingAccount.number` is required in the database but missing from `HoldingAccountSerializer`.
