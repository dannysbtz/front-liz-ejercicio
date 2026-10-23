<template>
  <q-page class="q-pa-md">
    <h4 class="q-my-none text-bold text-blue q-mb-md">Ejercicios</h4>

    <q-tabs
      v-model="tab"
      class=""
      dense
      active-color="primary"
      indicator-color="primary"
      align="center"
    >
      <q-tab name="ejercicios" label="Ejercicios" icon="fitness_center" />
      <q-tab name="gruposMusculares" label="Grupos Musculares" icon="accessibility_new" />
      <q-tab name="articulaciones" label="Articulaciones" icon="join_inner" />
    </q-tabs>

    <q-separator class="q-mb-md" />

    <q-tab-panels v-model="tab" animated>
      <!-- ================= EJERCICIOS ================= -->
      <q-tab-panel name="ejercicios" class="q-pa-none">
        <div class="row items-center justify-between q-mb-md q-gutter-sm">
          <q-input
            v-model="ejercicioFilter"
            dense
            outlined
            clearable
            debounce="300"
            placeholder="Buscar ejercicio..."
            style="min-width: 320px"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            color="primary"
            icon="add"
            label="Registrar ejercicio"
            @click="openEjercicioCreate"
          />
        </div>

        <q-table
          :rows="ejercicios"
          :columns="ejercicioColumns"
          row-key="_id"
          :filter="ejercicioFilter"
          :loading="ejercicioLoading"
          class="tabla-datos"
          flat
          bordered
        >
          <template #body-cell-imagen="props">
            <q-td :props="props">
              <q-img
                :src="props.row.imagen || '/body.gif'"
                style="width: 70px; height: 70px"
                class="rounded-borders"
              />
            </q-td>
          </template>
          <template #body-cell-gruposMusculares="props">
            <q-td :props="props">
              {{ gruposMuscularesLabels(props.row.gruposMusculares) }}
            </q-td>
          </template>
          <template #body-cell-acciones="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn
                dense
                round
                flat
                icon="edit"
                color="primary"
                @click="openEjercicioEdit(props.row)"
              />
              <q-btn
                dense
                round
                flat
                icon="delete"
                color="negative"
                @click="confirmDeleteEjercicio(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- ================= GRUPOS MUSCULARES ================= -->
      <q-tab-panel name="gruposMusculares" class="q-pa-none">
        <div class="row items-center justify-between q-mb-md q-gutter-sm">
          <q-input
            v-model="grupoFilter"
            dense
            outlined
            clearable
            debounce="300"
            placeholder="Buscar grupo muscular..."
            style="min-width: 320px"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn color="primary" icon="add" label="Registrar grupo" @click="openGrupoCreate" />
        </div>

        <q-table
          :rows="gruposMusculares"
          :columns="grupoColumns"
          row-key="_id"
          :filter="grupoFilter"
          :loading="grupoLoading"
          class="tabla-datos"
          flat
          bordered
        >
          <template #body-cell-imagen="props">
            <q-td :props="props">
              <q-img
                :src="props.row.imagen || '/body.gif'"
                style="width: 70px; height: 70px"
                class="rounded-borders"
              />
            </q-td>
          </template>
          <template #body-cell-articulaciones="props">
            <q-td :props="props">
              {{ articulacionesLabels(props.row.articulaciones) }}
            </q-td>
          </template>
          <template #body-cell-acciones="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn
                dense
                round
                flat
                icon="edit"
                color="primary"
                @click="openGrupoEdit(props.row)"
              />
              <q-btn
                dense
                round
                flat
                icon="delete"
                color="negative"
                @click="confirmDeleteGrupo(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- ================= ARTICULACIONES ================= -->
      <q-tab-panel name="articulaciones" class="q-pa-none">
        <div class="row items-center justify-between q-mb-md q-gutter-sm">
          <q-input
            v-model="articulacionFilter"
            dense
            outlined
            clearable
            debounce="300"
            placeholder="Buscar articulación..."
            style="min-width: 320px"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            color="primary"
            icon="add"
            label="Registrar articulación"
            @click="openArticulacionCreate"
          />
        </div>

        <q-table
          :rows="articulaciones"
          :columns="articulacionColumns"
          row-key="_id"
          :filter="articulacionFilter"
          :loading="articulacionLoading"
          class="tabla-datos"
          flat
          bordered
        >
          <template #body-cell-acciones="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn
                dense
                round
                flat
                icon="edit"
                color="primary"
                @click="openArticulacionEdit(props.row)"
              />
              <q-btn
                dense
                round
                flat
                icon="delete"
                color="negative"
                @click="confirmDeleteArticulacion(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <!-- ================= DIALOG EJERCICIO ================= -->
    <q-dialog v-model="ejercicioDialogOpen" persistent>
      <q-card style="min-width: 400px" class="q-pa-sm">
        <q-card-section>
          <div class="text-h6">
            {{ ejercicioIsEditing ? 'Editar ejercicio' : 'Registrar ejercicio' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit.prevent="onSubmitEjercicio">
            <q-input v-model="ejercicioForm.nombre" label="Nombre" outlined dense required />
            <q-select
              v-model="ejercicioForm.tipo"
              :options="tipoOptions"
              label="Tipo"
              outlined
              dense
              emit-value
              map-options
              required
            />
            <q-select
              v-model="ejercicioForm.gruposMusculares"
              :options="grupoMuscularOptions"
              label="Grupos musculares"
              outlined
              dense
              multiple
              emit-value
              map-options
              use-chips
              required
            />
            <q-file
              v-model="ejercicioForm.imagenFile"
              label="Imagen"
              outlined
              dense
              accept="image/*"
              clearable
            >
              <template #prepend>
                <q-icon name="image" />
              </template>
            </q-file>

            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancelar" flat color="grey-8" v-close-popup />
              <q-btn
                :label="ejercicioIsEditing ? 'Guardar' : 'Registrar'"
                color="primary"
                type="submit"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- ================= DIALOG GRUPO MUSCULAR ================= -->
    <q-dialog v-model="grupoDialogOpen" persistent>
      <q-card style="min-width: 400px" class="q-pa-sm">
        <q-card-section>
          <div class="text-h6">{{ grupoIsEditing ? 'Editar grupo' : 'Registrar grupo' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit.prevent="onSubmitGrupo">
            <q-input v-model="grupoForm.nombre" label="Nombre" outlined dense required />
            <q-select
              v-model="grupoForm.articulaciones"
              :options="articulacionOptions"
              label="Articulaciones"
              outlined
              dense
              multiple
              emit-value
              map-options
              use-chips
              required
            />
            <q-file
              v-model="grupoForm.imagenFile"
              label="Imagen"
              outlined
              dense
              accept="image/*"
              clearable
            >
              <template #prepend>
                <q-icon name="image" />
              </template>
            </q-file>

            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancelar" flat color="grey-8" v-close-popup />
              <q-btn
                :label="grupoIsEditing ? 'Guardar' : 'Registrar'"
                color="primary"
                type="submit"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- ================= DIALOG ARTICULACION ================= -->
    <q-dialog v-model="articulacionDialogOpen" persistent>
      <q-card style="min-width: 350px" class="q-pa-sm">
        <q-card-section>
          <div class="text-h6">
            {{ articulacionIsEditing ? 'Editar articulación' : 'Registrar articulación' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit.prevent="onSubmitArticulacion">
            <q-input v-model="articulacionForm.nombre" label="Nombre" outlined dense required />

            <div class="row justify-end q-gutter-sm">
              <q-btn label="Cancelar" flat color="grey-8" v-close-popup />
              <q-btn
                :label="articulacionIsEditing ? 'Guardar' : 'Registrar'"
                color="primary"
                type="submit"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// TODO: reemplazar por la URL real de la API de Express
const API_URL = import.meta.env.API_URL
const API_URL_NGINX = API_URL

function normalizarImagen(imagen) {
  if (!imagen) return null

  if (imagen.startsWith('data:')) {
    return imagen
  }

  // Corregir URLs antiguas que apuntan al backend
  if (imagen.startsWith('http://localhost:3000/')) {
    return imagen.replace('http://localhost:3000', API_URL_NGINX)
  }

  // Ya está apuntando a Nginx
  if (/^https?:\/\//i.test(imagen)) {
    return imagen
  }

  return new URL(imagen, `${API_URL_NGINX}/`).href
}

function normalizarImagenes(items) {
  return items.map((item) => ({ ...item, imagen: normalizarImagen(item.imagen) }))
}

const tab = ref('ejercicios')

// la API a veces devuelve las relaciones populadas ({ _id, nombre, ... }) en vez del id plano
function toId(item) {
  return item && typeof item === 'object' ? item._id : item
}

/* ==================================================================
 * ARTICULACIONES
 * ================================================================== */
const articulaciones = ref([])
const articulacionFilter = ref('')
const articulacionLoading = ref(false)

const articulacionColumns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const articulacionOptions = computed(() =>
  articulaciones.value.map((a) => ({ label: a.nombre, value: a._id })),
)

function articulacionesLabels(ids = []) {
  return ids
    .map((id) => articulaciones.value.find((a) => String(a._id) === String(toId(id)))?.nombre)
    .filter(Boolean)
    .join(', ')
}

const articulacionDialogOpen = ref(false)
const articulacionIsEditing = ref(false)
const articulacionEditingId = ref(null)
const articulacionForm = ref({ nombre: '' })

async function fetchArticulaciones() {
  articulacionLoading.value = true
  try {
    const res = await fetch(`${API_URL}/articulaciones/`)
    const data = await res.json()
    articulaciones.value = Array.isArray(data) ? data : (data.articulaciones ?? data.data ?? [])
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar articulaciones' })
    console.error(error)
  } finally {
    articulacionLoading.value = false
  }
}

function openArticulacionCreate() {
  articulacionIsEditing.value = false
  articulacionEditingId.value = null
  articulacionForm.value = { nombre: '' }
  articulacionDialogOpen.value = true
}

function openArticulacionEdit(row) {
  articulacionIsEditing.value = true
  articulacionEditingId.value = row._id
  articulacionForm.value = { nombre: row.nombre }
  articulacionDialogOpen.value = true
}

async function onSubmitArticulacion() {
  try {
    if (articulacionIsEditing.value) {
      await fetch(`${API_URL}/articulaciones/${articulacionEditingId.value}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articulacionForm.value),
      })
      $q.notify({ type: 'positive', message: 'Articulación actualizada' })
    } else {
      await fetch(`${API_URL}/articulaciones/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articulacionForm.value),
      })
      $q.notify({ type: 'positive', message: 'Articulación registrada' })
    }
    articulacionDialogOpen.value = false
    await fetchArticulaciones()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al guardar la articulación' })
    console.error(error)
  }
}

function confirmDeleteArticulacion(row) {
  $q.dialog({
    title: 'Eliminar articulación',
    message: `¿Seguro que deseas eliminar "${row.nombre}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await fetch(`${API_URL}/articulaciones/${row._id}`, { method: 'DELETE' })
      $q.notify({ type: 'positive', message: 'Articulación eliminada' })
      await fetchArticulaciones()
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al eliminar la articulación' })
      console.error(error)
    }
  })
}

/* ==================================================================
 * GRUPOS MUSCULARES
 * ================================================================== */
const gruposMusculares = ref([])
const grupoFilter = ref('')
const grupoLoading = ref(false)

const grupoColumns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'imagen', label: 'Imagen', field: 'imagen', align: 'center' },
  { name: 'articulaciones', label: 'Articulaciones', field: 'articulaciones', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const grupoMuscularOptions = computed(() =>
  gruposMusculares.value.map((g) => ({ label: g.nombre, value: g._id })),
)

function gruposMuscularesLabels(ids = []) {
  return ids
    .flat()
    .map((id) => gruposMusculares.value.find((g) => String(g._id) === String(toId(id)))?.nombre)
    .filter(Boolean)
    .join(', ')
}

const grupoDialogOpen = ref(false)
const grupoIsEditing = ref(false)
const grupoEditingId = ref(null)

const emptyGrupoForm = () => ({ nombre: '', articulaciones: [], imagenFile: null })
const grupoForm = ref(emptyGrupoForm())

async function fetchGruposMusculares() {
  grupoLoading.value = true
  try {
    const res = await fetch(`${API_URL}/grupos-musculares/`)
    const data = await res.json()
    const items = Array.isArray(data) ? data : (data.gruposMusculares ?? data.data ?? [])
    gruposMusculares.value = normalizarImagenes(items)
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar grupos musculares' })
    console.error(error)
  } finally {
    grupoLoading.value = false
  }
}

function openGrupoCreate() {
  grupoIsEditing.value = false
  grupoEditingId.value = null
  grupoForm.value = emptyGrupoForm()
  grupoDialogOpen.value = true
}

function openGrupoEdit(row) {
  grupoIsEditing.value = true
  grupoEditingId.value = row._id
  grupoForm.value = {
    nombre: row.nombre,
    articulaciones: (row.articulaciones ?? []).map(toId),
    imagenFile: null,
  }
  grupoDialogOpen.value = true
}

function buildGrupoFormData() {
  const fd = new FormData()
  fd.append('nombre', grupoForm.value.nombre)
  grupoForm.value.articulaciones.forEach((id) => fd.append('articulaciones', id))
  if (grupoForm.value.imagenFile) fd.append('imagen', grupoForm.value.imagenFile)
  return fd
}

async function onSubmitGrupo() {
  try {
    const fd = buildGrupoFormData()
    const res = grupoIsEditing.value
      ? await fetch(`${API_URL}/grupos-musculares/${grupoEditingId.value}`, {
          method: 'PATCH',
          body: fd,
        })
      : await fetch(`${API_URL}/grupos-musculares/`, { method: 'POST', body: fd })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    $q.notify({
      type: 'positive',
      message: grupoIsEditing.value ? 'Grupo muscular actualizado' : 'Grupo muscular registrado',
    })
    grupoDialogOpen.value = false
    await fetchGruposMusculares()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al guardar el grupo muscular' })
    console.error(error)
  }
}

function confirmDeleteGrupo(row) {
  $q.dialog({
    title: 'Eliminar grupo muscular',
    message: `¿Seguro que deseas eliminar "${row.nombre}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const res = await fetch(`${API_URL}/grupos-musculares/${row._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      $q.notify({ type: 'positive', message: 'Grupo muscular eliminado' })
      await fetchGruposMusculares()
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al eliminar el grupo muscular' })
      console.error(error)
    }
  })
}

/* ==================================================================
 * EJERCICIOS
 * ================================================================== */
const ejercicios = ref([])
const ejercicioFilter = ref('')
const ejercicioLoading = ref(false)

const tipoOptions = [
  { label: 'Aeróbico', value: 'aerobico' },
  { label: 'Anaeróbico', value: 'anaerobico' },
]

const ejercicioColumns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'imagen', label: 'Imagen', field: 'imagen', align: 'center' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  {
    name: 'gruposMusculares',
    label: 'Grupos musculares',
    field: 'gruposMusculares',
    align: 'left',
  },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const ejercicioDialogOpen = ref(false)
const ejercicioIsEditing = ref(false)
const ejercicioEditingId = ref(null)

const emptyEjercicioForm = () => ({
  nombre: '',
  tipo: null,
  gruposMusculares: [],
  imagenFile: null,
})
const ejercicioForm = ref(emptyEjercicioForm())

async function fetchEjercicios() {
  ejercicioLoading.value = true
  try {
    const res = await fetch(`${API_URL}/ejercicios/`)
    const data = await res.json()
    const items = Array.isArray(data) ? data : (data.ejercicios ?? data.data ?? [])
    ejercicios.value = normalizarImagenes(items)
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar ejercicios' })
    console.error(error)
  } finally {
    ejercicioLoading.value = false
  }
}

function openEjercicioCreate() {
  ejercicioIsEditing.value = false
  ejercicioEditingId.value = null
  ejercicioForm.value = emptyEjercicioForm()
  ejercicioDialogOpen.value = true
}

function openEjercicioEdit(row) {
  ejercicioIsEditing.value = true
  ejercicioEditingId.value = row._id
  ejercicioForm.value = {
    nombre: row.nombre,
    tipo: row.tipo,
    gruposMusculares: (row.gruposMusculares ?? []).flat().map(toId),
    imagenFile: null,
  }
  ejercicioDialogOpen.value = true
}

function buildEjercicioFormData() {
  const fd = new FormData()
  fd.append('nombre', ejercicioForm.value.nombre)
  fd.append('tipo', ejercicioForm.value.tipo)
  ejercicioForm.value.gruposMusculares.forEach((id) => fd.append('gruposMusculares', id))
  if (ejercicioForm.value.imagenFile) fd.append('imagen', ejercicioForm.value.imagenFile)
  return fd
}

async function onSubmitEjercicio() {
  try {
    const fd = buildEjercicioFormData()
    const res = ejercicioIsEditing.value
      ? await fetch(`${API_URL}/ejercicios/${ejercicioEditingId.value}`, {
          method: 'PATCH',
          body: fd,
        })
      : await fetch(`${API_URL}/ejercicios/`, { method: 'POST', body: fd })

    if (!res.ok) {
      throw new Error(await res.text())
    }

    $q.notify({
      type: 'positive',
      message: ejercicioIsEditing.value ? 'Ejercicio actualizado' : 'Ejercicio registrado',
    })
    ejercicioDialogOpen.value = false
    await fetchEjercicios()
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al guardar el ejercicio' })
    console.error(error)
  }
}

function confirmDeleteEjercicio(row) {
  $q.dialog({
    title: 'Eliminar ejercicio',
    message: `¿Seguro que deseas eliminar "${row.nombre}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      const res = await fetch(`${API_URL}/ejercicios/${row._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      $q.notify({ type: 'positive', message: 'Ejercicio eliminado' })
      await fetchEjercicios()
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error al eliminar el ejercicio' })
      console.error(error)
    }
  })
}

onMounted(async () => {
  await fetchArticulaciones()
  await fetchGruposMusculares()
  await fetchEjercicios()
})
</script>

<style scoped>
.tabla-datos :deep(td) {
  font-size: 15px;
}
</style>
