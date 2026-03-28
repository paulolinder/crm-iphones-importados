<script setup lang="ts">
/**
 * BaseStatCard
 *
 * Card de estatística/KPI com design premium
 */

import type { ColorVariant } from '~/types'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  iconColor?: 'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'slate'
  trend?: {
    value: number
    direction: 'up' | 'down'
    label?: string
  }
  loading?: boolean
  clickable?: boolean
  to?: string
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'blue',
  loading: false,
  clickable: false,
  compact: false,
})

const iconColorClasses = {
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  violet: 'bg-violet-100 text-violet-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
  slate: 'bg-slate-100 text-slate-600',
}

const bgDecorationClasses = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-500',
}
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : 'div'"
    :to="to"
    class="relative bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 group overflow-hidden"
    :class="[
      clickable || to ? 'cursor-pointer' : '',
      compact ? 'p-4' : 'p-5 lg:p-6',
    ]"
  >
    <!-- Background Decoration -->
    <div
      v-if="icon"
      class="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-5 transition-transform group-hover:scale-110"
      :class="bgDecorationClasses[iconColor]"
    />

    <div class="relative">
      <!-- Loading State -->
      <template v-if="loading">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-slate-100 animate-pulse" />
          <div class="w-16 h-6 rounded-full bg-slate-100 animate-pulse" />
        </div>
        <div class="w-32 h-8 bg-slate-100 rounded animate-pulse mb-2" />
        <div class="w-24 h-4 bg-slate-100 rounded animate-pulse" />
      </template>

      <!-- Content -->
      <template v-else>
        <!-- Icon & Trend Row -->
        <div class="flex items-center justify-between mb-4">
          <div
            v-if="icon"
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="iconColorClasses[iconColor]"
          >
            <Icon :name="icon" class="w-6 h-6" />
          </div>

          <!-- Trend Badge -->
          <div
            v-if="trend"
            class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            :class="[
              trend.direction === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
            ]"
          >
            <Icon
              :name="trend.direction === 'up' ? 'lucide:trending-up' : 'lucide:trending-down'"
              class="w-3.5 h-3.5"
            />
            {{ Math.abs(trend.value) }}%
          </div>
        </div>

        <!-- Value -->
        <div class="mb-1">
          <span class="text-2xl lg:text-3xl font-bold text-slate-900">
            {{ value }}
          </span>
        </div>

        <!-- Title -->
        <p class="text-sm text-slate-500">{{ title }}</p>

        <!-- Subtitle -->
        <p v-if="subtitle" class="text-xs text-slate-400 mt-1">{{ subtitle }}</p>
      </template>
    </div>
  </component>
</template>
