<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Liz Entrenamiento </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menú </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.label" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from '@/components/EssentialLink.vue'

const linksList = [
  {
    label: 'Clientes',
    caption: 'Gestionar clientes',
    icon: 'people',
    to: { name: 'clientes' },
  },
  {
    label: 'Ejercicios',
    caption: 'Gestionar ejercicios',
    icon: 'fitness_center',
    to: { name: 'ejercicios' },
  },
  {
    label: 'Generar Plan',
    caption: 'Crear plan de entrenamiento',
    icon: 'event_note',
    to: { name: 'generar-plan' },
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
