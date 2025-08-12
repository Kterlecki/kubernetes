# kubernetes

## Helm Commands

### Development & Testing Commands

```bash
# Lint the Helm chart for syntax errors and best practices
# Checks Chart.yaml, values.yaml, and template files for issues
# Will catch missing required fields, invalid YAML, and common mistakes
helm lint ./my-nginx-chart

# Generate Kubernetes YAML from templates without deploying
# Shows exactly what resources would be created
# Useful for debugging template logic and validating output
# The --debug flag shows additional debugging information
helm template test ./my-nginx-chart --debug

# Alternative: Dry run to validate against actual Kubernetes API
# This checks if the generated YAML would be accepted by your cluster
helm install test ./my-nginx-chart --dry-run --debug
```

### Deployment Commands

```bash
# Install the chart to your Kubernetes cluster
# Creates a Helm release named "my-nginx-chart"
# Deploys all resources defined in templates/
helm install my-nginx-chart ./my-nginx-chart

# Install with custom values for different environments
helm install my-nginx-prod ./my-nginx-chart -f values-prod.yaml
helm install my-nginx-dev ./my-nginx-chart -f values-dev.yaml

# Upgrade an existing release with changes
helm upgrade my-nginx-chart ./my-nginx-chart

# Check the status of your deployment
helm status my-nginx-chart

# List all Helm releases
helm list

# View the history of releases
helm history my-nginx-chart

# Rollback to a previous version if needed
helm rollback my-nginx-chart 1

# Completely remove the deployment and all its resources
helm uninstall my-nginx-chart
```

### Verification Commands

```bash
# Check what Kubernetes resources were created
kubectl get all -l app.kubernetes.io/instance=my-nginx-chart

# Get the external IP to access your nginx server
kubectl get services

# Check pod logs for troubleshooting
kubectl logs -l app.kubernetes.io/name=my-nginx-chart

# Port forward for local testing (if no LoadBalancer)
kubectl port-forward service/my-nginx-chart-my-nginx-chart 8080:80
```

## Typical Workflow

1. **Develop**: Edit `values.yaml` or templates
2. **Lint**: `helm lint ./my-nginx-chart`
3. **Test**: `helm template test ./my-nginx-chart --debug`
4. **Deploy**: `helm install my-nginx-chart ./my-nginx-chart`
5. **Verify**: `kubectl get all` and check external IP
6. **Update**: `helm upgrade my-nginx-chart ./my-nginx-chart`
7. **Cleanup**: `helm uninstall my-nginx-chart`  