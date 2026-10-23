<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md q-gutter-sm">
      <h4 class="q-my-none text-bold text-blue">Generar Plan</h4>
      <q-input
        v-model="filter"
        dense
        outlined
        clearable
        debounce="300"
        placeholder="Buscar por fecha u objetivo..."
        style="min-width: 320px"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-select
        v-model="clienteFiltro"
        :options="clienteOptions"
        label="Filtrar por cliente"
        outlined
        dense
        clearable
        emit-value
        map-options
        style="min-width: 240px"
      />
      <q-btn
        color="primary"
        icon="add"
        label="Agregar rutina"
        :to="{ name: 'generar-plan-nuevo' }"
      />
    </div>

    <q-table
      :rows="filasFiltradas"
      :columns="columns"
      row-key="_id"
      :filter="filter"
      :filter-method="filtrarPorFechaUObjetivo"
      :loading="loading"
      class="tabla-datos"
      flat
      bordered
    >
      <template #body-cell-fecha="props">
        <q-td :props="props">
          {{ formatFecha(props.row.createdAt) }}
        </q-td>
      </template>
      <template #body-cell-cliente="props">
        <q-td :props="props">
          {{ props.row.cliente?.nombre ?? '—' }}
        </q-td>
      </template>
      <template #body-cell-objetivo="props">
        <q-td :props="props">
          {{ props.row.cliente?.objetivos ?? '—' }}
        </q-td>
      </template>
      <template #body-cell-acciones="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn
            dense
            round
            flat
            icon="content_copy"
            color="primary"
            :to="{ name: 'generar-plan-nuevo', query: { copiar: props.row._id } }"
          >
            <q-tooltip>Duplicar rutina</q-tooltip>
          </q-btn>
          <q-btn
            dense
            round
            flat
            icon="edit"
            color="orange"
            :to="{ name: 'generar-plan-editar', params: { id: props.row._id } }"
          />
          <q-btn
            dense
            round
            flat
            icon="delete"
            color="negative"
            @click="confirmDelete(props.row)"
          />
          <q-btn
            dense
            round
            flat
            icon="visibility"
            color="blue-8"
            :to="{ name: 'generar-plan-ver', params: { id: props.row._id } }"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()

// TODO: reemplazar por la URL real de la API de Express
const API_URL = import.meta.env.API_URL

const planes = ref([])
const filter = ref('')
const clienteFiltro = ref(null)
const loading = ref(false)

const columns = [
  { name: 'fecha', label: 'Fecha de creación', field: 'createdAt', align: 'left', sortable: true },
  {
    name: 'cliente',
    label: 'Cliente',
    field: (row) => row.cliente?.nombre,
    align: 'left',
    sortable: true,
  },
  { name: 'objetivo', label: 'Objetivo', field: (row) => row.cliente?.objetivos, align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const clienteOptions = computed(() => {
  const vistos = new Map()
  planes.value.forEach((p) => {
    if (p.cliente?._id) vistos.set(p.cliente._id, p.cliente.nombre)
  })
  return [...vistos.entries()].map(([value, label]) => ({ label, value }))
})

const filasFiltradas = computed(() => {
  if (!clienteFiltro.value) return planes.value
  return planes.value.filter((p) => p.cliente?._id === clienteFiltro.value)
})

function formatFecha(fecha) {
  return fecha ? date.formatDate(fecha, 'DD/MM/YYYY HH:mm') : '—'
}

function filtrarPorFechaUObjetivo(rows, terms) {
  const busqueda = terms.toLowerCase()
  return rows.filter((row) => {
    const fecha = formatFecha(row.createdAt).toLowerCase()
    const objetivo = (row.cliente?.objetivos ?? '').toLowerCase()
    return fecha.includes(busqueda) || objetivo.includes(busqueda)
  })
}

async function fetchPlanes() {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/rutinas/`)
    const data = await res.json()
    planes.value = Array.isArray(data) ? data : (data.planes ?? data.data ?? [])
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar los planes' })
    console.error(error)
  } finally {
    loading.value = false
  }
}

function confirmDelete(row) {
  $q.dialog({
    title: 'Eliminar rutina',
    message: `¿Seguro que deseas eliminar el plan de "${row.cliente?.nombre ?? 'este cliente'}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await fetch(`${API_URL}/planes/${row._id}`, { method: 'DELETE' })
      $q.notify({ type: 'positive', message: 'Plan eliminado' })
      await fetchPlanes()
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al eliminar el plan' })
      console.error(error)
    }
  })
}

onMounted(fetchPlanes)
</script>

<style scoped>
.tabla-datos :deep(td) {
  font-size: 15px;
}
</style>
