terraform {
  required_version = ">= 1.5"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# リソースグループ（既に作成済みの場合は terraform import で取り込む）
resource "azurerm_resource_group" "kanban" {
  name     = var.resource_group_name
  location = var.location
}

# Log Analytics Workspace（Container Apps 環境に必須）
# 月5GBまで無料
resource "azurerm_log_analytics_workspace" "kanban" {
  name                = "${var.app_name}-logs"
  resource_group_name = azurerm_resource_group.kanban.name
  location            = azurerm_resource_group.kanban.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# Container Apps 環境（サーバーレス基盤）
resource "azurerm_container_app_environment" "kanban" {
  name                       = "${var.app_name}-env"
  resource_group_name        = azurerm_resource_group.kanban.name
  location                   = azurerm_resource_group.kanban.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.kanban.id
}

# Container App 本体
# プレースホルダー画像で初期作成。GitHub Actions が初回デプロイで上書きする。
# template は GitHub Actions が管理するため ignore_changes で保護する。
resource "azurerm_container_app" "kanban" {
  name                         = var.app_name
  container_app_environment_id = azurerm_container_app_environment.kanban.id
  resource_group_name          = azurerm_resource_group.kanban.name
  revision_mode                = "Single"

  template {
    min_replicas = 0 # アクセスがなければ 0 台（無料）
    max_replicas = 1

    container {
      name  = "kanban"
      image = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
      cpu   = 0.25
      memory = "0.5Gi"

      env {
        name  = "PORT"
        value = "3000"
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "NEXT_TELEMETRY_DISABLED"
        value = "1"
      }
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 3000
    transport                  = "auto"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  # GitHub Actions がイメージを更新するため、template への変更は Terraform 側で無視
  lifecycle {
    ignore_changes = [template]
  }
}
