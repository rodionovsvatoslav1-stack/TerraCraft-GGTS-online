# PixelCraft Online Catalog — starter backend

This is the first backend piece: a persistent public server directory API. It does **not** host the game worlds yet. The current PixelCraft peer-to-peer host still has to stay online for friends to join.

## Run locally
1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000/health` and `http://localhost:3000/api/servers`.

The catalog writes `data/servers.json`. For deployment, use a host with persistent disk/storage; ephemeral filesystems can lose the catalog on restart.

## Connect the HTML client
In `PixelCraft_Survival_v21.html`, find `const MP_CATALOG_URL = '';` and set it to the deployed base URL, without a trailing slash, e.g. `https://your-catalog.example.com`. Do not use `localhost` in an APK intended to connect from a phone.

## Important limitations
- The API is a starter prototype and currently has no authentication, moderation, or rate limiting; do not expose it publicly as-is for a large audience.
- A listing is metadata, not proof that a peer is reachable.
- This catalog does not make the world run 24/7. A dedicated game server and persistent world storage are a separate next step.
