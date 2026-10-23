const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'servers.json');
app.use(cors());
app.use(express.json({ limit: '32kb' }));
fs.mkdirSync(DATA_DIR, { recursive: true });
function readServers() {
  try { const v = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); return Array.isArray(v) ? v : []; }
  catch (_) { return []; }
}
function writeServers(list) { fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2)); }
app.get('/health', (_req, res) => res.json({ ok: true, service: 'PixelCraft Online Catalog' }));
app.get('/api/servers', (_req, res) => {
  const list = readServers().filter(s => s && s.code).map(s => ({
    id: s.id, name: s.name, code: s.code, maxPlayers: s.maxPlayers,
    online: s.online !== false, updatedAt: s.updatedAt
  }));
  res.set('Cache-Control', 'no-store');
  res.json({ servers: list });
});
app.post('/api/servers', (req, res) => {
  const name = String(req.body.name || 'PixelCraft сервер').trim().slice(0, 32);
  const code = String(req.body.code || '').trim().slice(0, 80);
  const maxPlayers = Math.max(2, Math.min(32, Number(req.body.maxPlayers) || 4));
  if (!/^pcraft-[a-z0-9-]{4,64}$/i.test(code)) return res.status(400).json({ error: 'Invalid server code' });
  const list = readServers();
  const now = new Date().toISOString();
  const item = { id: code.toLowerCase(), name: name || 'PixelCraft сервер', code, maxPlayers, online: true, updatedAt: now };
  const index = list.findIndex(s => s.id === item.id);
  if (index >= 0) list[index] = item; else list.push(item);
  writeServers(list.slice(-500));
  res.status(201).json({ ok: true, server: item });
});
app.post('/api/servers/:id/heartbeat', (req, res) => {
  const list = readServers(); const item = list.find(s => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Server not found' });
  item.online = true; item.updatedAt = new Date().toISOString(); writeServers(list);
  res.json({ ok: true });
});
app.delete('/api/servers/:id', (req, res) => {
  const list = readServers(); const next = list.filter(s => s.id !== req.params.id);
  writeServers(next); res.json({ ok: true, removed: next.length !== list.length });
});
app.listen(PORT, () => console.log(`PixelCraft catalog listening on ${PORT}`));
