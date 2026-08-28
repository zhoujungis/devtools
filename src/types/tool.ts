import type { Component } from 'vue'

export interface ToolDefinition {
  id: string
  name: string
  nameZh: string
  description: string
  category: string
  icon: string
  keywords: string[]
  path: string
  component: () => Promise<Component>
  featured?: boolean
  processing?: 'local' | 'external' | 'mixed'
}

export interface CategoryDefinition {
  id: string
  name: string
  nameZh: string
  description: string
  icon: string
  color: string
}
