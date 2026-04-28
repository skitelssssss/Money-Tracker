export function healthcheck(_req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
}
