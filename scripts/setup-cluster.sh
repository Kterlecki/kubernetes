#!/bin/bash

# Monitoring
echo ""
echo "****Setting up monitoring with Prometheus and Grafana****"
echo ""
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

echo ""
echo "****Deploying Prometheus and Grafana****"
echo ""
helm upgrade --install prometheus prometheus-community/prometheus \
  --namespace monitoring --create-namespace \
  --set alertmanager.enabled=false \
  --set kube-state-metrics.enabled=false \
  --set prometheus-node-exporter.enabled=false \
  --set prometheus-pushgateway.enabled=false

helm upgrade --install grafana grafana/grafana \
  --namespace monitoring 

# App deployment (upgrade --install works for both new and existing releases)
echo ""
echo "****Deploying my-nginx-chart application****"
echo ""
helm upgrade --install my-app ./my-nginx-chart
