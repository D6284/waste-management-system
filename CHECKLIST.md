# Production Hardening Checklist

## Security
- [ ] **Secret Management**: Ensure all secrets (DB creds, API keys) are moved to AWS Secrets Manager.
- [ ] **IAM Roles**: Review Least Privilege access for EKS nodes and RDS.
- [ ] **Network**: Verify Security Groups restrict DB access to only the EKS VPC CIDR.
- [ ] **Image Scanning**: Run Trivy scan on final Docker images; fix critical/high vulnerabilities.
- [ ] **Auth**: Rotate JWT signing keys and ensure HTTPS only for all endpoints.

## Infrastructure
- [ ] **Terraform State**: Confirm remote state locking (DynamoDB) and encryption (S3) are enabled.
- [ ] **Backups**: Verify RDS automated snapshots are active (7-day retention min).
- [ ] **Scaling**: Configure HPA (Horizontal Pod Autoscaler) for Backend and API services.
- [ ] **Multi-AZ**: Ensure RDS is Multi-AZ and EKS nodes span at least 2 Availability Zones.

## Monitoring & Observability
- [ ] **Logs**: Verify FluentBit is shipping logs to CloudWatch/Loki.
- [ ] **Metrics**: Check Prometheus targets are up; Verify Grafana dashboards show data.
- [ ] **Alerts**: Test PagerDuty integration for "High Error Rate" and "Pod CrashLoop" alerts.

## Performance
- [ ] **Database**: Run `VACUUM ANALYZE` on Postgres; check index usage.
- [ ] **Caching**: Verify Redis eviction policy and memory limits.
- [ ] **CDN**: Ensure static assets (frontend) are served via CloudFront.

## CI/CD
- [ ] **Tests**: Unit tests > 60% coverage.
- [ ] **Pipeline**: Verify "Staging" deploy succeeds before "Production" promotion gate.
