# KLINCAM WMS Operations Runbook

## Deployment Strategy

We use a **Blue/Green** inspired deployment via Helm and GitHub Actions.

### Deploy to Staging
Triggered automatically on merge to `main`.
1. CI builds Docker images tag: `sha-<commit_hash>`.
2. Terraform validates infrastructure state.
3. Helm upgrades the `klincam-staging` release.

### Promote to Production
Triggered manually via GitHub Release.
1. Create a Release in GitHub (e.g., `v1.0.0`).
2. GitHub Action runs integration tests against Staging.
3. If pass, Helm upgrades `klincam-prod` with the new image tag.

## Rollback Procedure

If a critical bug is found in Production:

1. **Identify the previous stable version** (e.g., `v1.2.3`).
2. **Execute Rollback**:
   ```bash
   helm rollback klincam-prod 0 -n production
   ```
   *Note: `0` rolls back to the previous revision.*
3. **Verify**: Check health endpoints `https://api.klincam.com/health`.

## Database Restoration

In case of data corruption:

1. **Stop the Application**: Scale API deployment to 0.
   ```bash
   kubectl scale deploy/backend --replicas=0 -n production
   ```
2. **Restore RDS**:
   - Go to AWS Console -> RDS -> Snapshots.
   - Select latest snapshot -> Restore.
   - Update Route53 CNAME or App config to point to new DB instance.
3. **Restart Application**: Scale API deployment back up.

## Common Incidents

### High Latency / 502 Errors
- **Check Pod Health**: `kubectl get pods -n production`
- **Check Logs**: `kubectl logs -l app=backend -n production --tail=100`
- **Check Database**: CPU/Connections metrics in RDS console.

### Truck Telemetry Missing
- **Check IoT Ingestion Queue**: Inspect RabbitMQ queue depth.
- **Check Worker Logs**: `kubectl logs -l app=telemetry-worker -n production`
