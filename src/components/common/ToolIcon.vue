<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  Braces, ListTree, GitCompare, Binary, Link, Key, Fingerprint, Clock, Regex, FileDiff,
  Database, FileText, Bot, QrCode, Timer, Network, Globe, MapPin, Activity, RadioTower,
  Code2, Shield, Sparkles, BookOpen, Puzzle
} from 'lucide-vue-next'

const icons: Record<string, Component> = {
  Braces, ListTree, GitCompare, Binary, Link, Key, Fingerprint, Clock, Regex, FileDiff,
  Database, FileText, Bot, QrCode, Timer, Network, Globe, MapPin, Activity, RadioTower,
  Code2, Shield, Sparkles, BookOpen
}

const props = withDefaults(defineProps<{
  name: string
  fallback?: string
}>(), {
  fallback: 'Puzzle'
})

const icon = computed<Component>(() => icons[props.name] ?? icons[props.fallback] ?? Puzzle)
</script>
<template>
  <component :is="icon" class="w-5 h-5 shrink-0" />
</template>
