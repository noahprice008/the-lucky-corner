# Deploying the demo to the VPS

- Host: https://luckycorner.elevex.digital
- Pushes to `main` build with `NITRO_PRESET=node-server` and rsync `.output/` to `/opt/luckycorner/app/`, then restart the `luckycorner` systemd service on port 3100 (behind nginx).
- Required GitHub secrets: `VPS_HOST`, `VPS_USER` (`deploy`), `VPS_SSH_KEY` (private key for that user), optional `VPS_PORT`.
- Server setup files: `deploy/luckycorner.service` and `deploy/nginx-luckycorner.conf`.
- Logs: `sudo journalctl -u luckycorner -f`
