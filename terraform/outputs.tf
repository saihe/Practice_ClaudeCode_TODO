output "app_url" {
  description = "デプロイ先 URL"
  value       = "https://${azurerm_container_app.kanban.name}.${azurerm_container_app_environment.kanban.default_domain}"
}

output "app_name" {
  description = "Container App 名 → GitHub Variables の AZURE_CONTAINER_APP_NAME に設定"
  value       = azurerm_container_app.kanban.name
}

output "resource_group_name" {
  description = "リソースグループ名 → GitHub Variables の AZURE_RESOURCE_GROUP に設定"
  value       = azurerm_resource_group.kanban.name
}

output "service_principal_command" {
  description = "GitHub Actions 用サービスプリンシパル作成コマンド"
  value       = "az ad sp create-for-rbac --name kanban-deployer --role contributor --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/${azurerm_resource_group.kanban.name} --json-auth"
}
