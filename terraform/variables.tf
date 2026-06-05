variable "resource_group_name" {
  description = "Azure リソースグループ名"
  type        = string
  default     = "kanban-board-rg"
}

variable "location" {
  description = "Azure リージョン"
  type        = string
  default     = "japaneast"
}

variable "app_name" {
  description = "Container App 名（リソースグループ内で一意であれば OK）"
  type        = string
  default     = "kanban-board-app"
}
