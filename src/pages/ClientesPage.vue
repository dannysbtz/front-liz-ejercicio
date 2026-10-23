<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md q-gutter-sm">
      <h4 class="q-my-none text-bold text-blue">Clientes</h4>
      <q-input
        v-model="filter"
        dense
        outlined
        clearable
        debounce="300"
        placeholder="Buscar cliente..."
        style="min-width: 460px"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn color="primary" icon="add" label="Registrar cliente" @click="openCreateDialog" />
    </div>

    <q-table
      :rows="clientes"
      :columns="columns"
      row-key="_id"
      :filter="filter"
      :loading="loading"
      flat
      bordered
    >
      <template #body-cell-acciones="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn dense round flat icon="edit" color="primary" @click="openEditDialog(props.row)" />
          <q-btn
            dense
            round
            flat
            icon="delete"
            color="negative"
            @click="confirmDelete(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 350px" class="q-pa-sm">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Editar cliente' : 'Registrar cliente' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit.prevent="onSubmit">
            <q-input v-model="form.nombre" label="Nombre" outlined dense required />
            <q-input
              v-model.number="form.edad"
              type="number"
              label="Edad"
              outlined
              dense
              min="0"
              required
            />
            <q-input v-model="form.nivel" label="Nivel" outlined dense required />
            <q-input
              v-model="form.objetivos"
              label="Objetivos"
              type="textarea"
              outlined
              dense
              required
            />
            <q-input
              v-model="form.especificaciones"
              label="Especificaciones"
              type="textarea"
              outlined
              dense
              required
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancelar" flat color="grey-8" v-close-popup />
              <q-btn :label="isEditing ? 'Guardar' : 'Registrar'" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const clientes = ref([])
const filter = ref('')
const loading = ref(false)

const columns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'edad', label: 'Edad', field: 'edad', align: 'left', sortable: true },
  { name: 'nivel', label: 'Nivel', field: 'nivel', align: 'left', sortable: true },
  { name: 'objetivos', label: 'Objetivos', field: 'objetivos', align: 'left' },
  { name: 'especificaciones', label: 'Especificaciones', field: 'especificaciones', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const dialogOpen = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

const emptyForm = () => ({
  nombre: '',
  edad: null,
  nivel: '',
  objetivos: '',
  especificaciones: '',
})

const form = ref(emptyForm())

// TODO: reemplazar por la URL real de la API de Express
const API_URL = import.meta.env.API_URL

async function fetchClientes() {
  loading.value = true
  try {
    const res = await fetch(API_URL + '/clientes/')
    const data = await res.json()
    // normaliza por si la API responde { clientes: [...] } o { data: [...] } en vez de un array
    clientes.value = Array.isArray(data) ? data : (data.clientes ?? data.data ?? [])
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar clientes' })
    console.error(error)
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  isEditing.value = false
  editingId.value = null
  form.value = emptyForm()
  dialogOpen.value = true
}

function openEditDialog(row) {
  isEditing.value = true
  editingId.value = row._id
  form.value = { ...row }
  dialogOpen.value = true
}

async function onSubmit() {
  try {
    if (isEditing.value) {
      await fetch(`${API_URL}/clientes/${editingId.value}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      $q.notify({ type: 'positive', message: 'Cliente actualizado' })
    } else {
      await fetch(API_URL + '/clientes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      $q.notify({ type: 'positive', message: 'Cliente registrado' })
    }
    dialogOpen.value = false
    await fetchClientes()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al guardar el cliente' })
    console.error(error)
  }
}

function confirmDelete(row) {
  $q.dialog({
    title: 'Eliminar cliente',
    message: `¿Seguro que deseas eliminar a "${row.nombre}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => deleteCliente(row))
}

async function deleteCliente(row) {
  try {
    await fetch(`${API_URL}/clientes/${row._id}`, { method: 'DELETE' })
    $q.notify({ type: 'positive', message: 'Cliente eliminado' })
    await fetchClientes()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al eliminar el cliente' })
    console.error(error)
  }
}

onMounted(fetchClientes)
</script>
