# Deploying the demo to the VPS

- Host: https://luckycorner.elevex.digital (HTTPS handled by the Caddy container in `/docker/n8n-with-ai-assistant-h6yk`)
- Caddy route: `reverse_proxy 172.16.5.1:3100` (Docker gateway, so only the host and containers can reach the app)
- Pushes to `main` build with `NITRO_PRESET=node-server` and rsync `.output/` to `/opt/luckycorner/app/`, then restart the `luckycorner` systemd service.
- Required GitHub secrets: `VPS_HOST`, `VPS_USER` (`deploy`), `VPS_SSH_KEY` (private key for that user), optional `VPS_PORT`.
- Service file: `deploy/luckycorner.service` (copy to `/etc/systemd/system/`).
- Logs: `sudo journalctl -u luckycorner -f`
