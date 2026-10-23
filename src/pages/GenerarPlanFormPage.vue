<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <h4 class="q-my-none text-bold text-blue">
        {{ isEditing ? 'Editar rutina' : isCopying ? 'Duplicar rutina' : 'Generar rutina' }}
      </h4>
      <q-btn flat icon="arrow_back" label="Volver" :to="{ name: 'generar-plan' }" />
    </div>

    <q-inner-loading :showing="loading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>

    <q-form class="q-gutter-md" @submit.prevent="onSubmit">
      <!-- ===== CLIENTE ===== -->
      <q-card flat bordered>
        <q-card-section class="bg-blue-1">
          <div class="text-h6 row items-center">
            <q-icon name="person" class="q-mr-sm" size="30px" color="primary" />
            Cliente
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-select
            v-model="form.cliente"
            :options="clienteOptions"
            label="Selecciona un cliente"
            outlined
            dense
            emit-value
            map-options
            required
          />
        </q-card-section>
      </q-card>

      <!-- ===== TABLA GENERAL (DETALLES) ===== -->
      <q-card flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6 row items-center">
            <q-icon name="checklist" class="q-mr-sm" size="30px" color="primary" />
            Tabla General
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-sm">
          <div
            v-for="(detalle, idx) in form.tablaGeneral.detalles"
            :key="idx"
            class="row items-center q-gutter-sm"
          >
            <q-select
              v-model="detalle.dia"
              :options="diaOptions"
              label="Día"
              outlined
              dense
              emit-value
              map-options
              style="min-width: 160px"
              required
            />
            <q-input
              v-model="detalle.detalle"
              outlined
              dense
              class="col"
              placeholder="Detalle del día..."
              required
            />
            <q-btn dense round flat icon="delete" color="negative" @click="removeDetalle(idx)" />
          </div>
          <q-btn flat color="primary" icon="add" label="Agregar detalle" @click="addDetalle" />
        </q-card-section>
      </q-card>

      <!-- ===== TABLA GENERAL CON ESPECIFICACIONES ===== -->
      <q-card flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6 row items-center">
            <q-icon name="tune" class="q-mr-sm" size="30px" color="primary" />
            Especificaciones por día
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-md">
          <q-card
            v-for="(esp, idx) in form.tablaGeneralEspecificaciones.especificaciones"
            :key="idx"
            flat
            bordered
            class="q-pa-sm"
          >
            <div class="row q-col-gutter-sm items-start">
              <q-select
                v-model="esp.dia"
                :options="diaOptions"
                label="Día"
                outlined
                dense
                emit-value
                map-options
                class="col-12 col-sm-3"
                required
              />
              <q-select
                v-model="esp.tipoEntrenamiento"
                :options="tipoEntrenamientoOptions"
                label="Tipo de entrenamiento"
                outlined
                dense
                clearable
                emit-value
                map-options
                class="col-12 col-sm-3"
              />
              <ItemPickerField
                v-model="esp.grupoMuscularZona"
                :items="grupoMuscularOptions"
                label="Zona / grupo muscular"
                clearable
                class="col-12 col-sm-3"
              />
              <q-select
                v-model="esp.intensidad"
                :options="intensidadOptions"
                label="Intensidad"
                outlined
                dense
                clearable
                emit-value
                map-options
                class="col-12 col-sm-2"
              />
              <div class="col-12 col-sm-1 flex justify-end">
                <q-btn
                  dense
                  round
                  flat
                  icon="delete"
                  color="negative"
                  @click="removeEspecificacion(idx)"
                />
              </div>
            </div>
          </q-card>
          <q-btn
            flat
            color="primary"
            icon="add"
            label="Agregar especificación"
            @click="addEspecificacion"
          />
        </q-card-section>
      </q-card>

      <!-- ===== TABLA ANAEROBICOS ===== -->
      <q-card flat bordered>
        <q-card-section class="bg-green-1">
          <div class="text-h6 row items-center">
            <q-icon name="directions_run" class="q-mr-sm" size="30px" color="green-8" />
            Ejercicios Anaeróbicos
          </div>
        </q-card-section>
        <q-separator />

        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Calentamiento</div>
          <div
            v-for="(cal, idx) in form.tablaAerobicos.calentamientos"
            :key="idx"
            class="row items-center q-gutter-sm q-mb-sm"
          >
            <q-input
              v-model="cal.parteCuerpo"
              outlined
              dense
              class="col"
              label="Parte del cuerpo"
              required
            />
            <q-btn
              dense
              round
              flat
              icon="delete"
              color="negative"
              @click="removeCalentamiento(idx)"
            />
          </div>
          <q-btn
            flat
            color="green-8"
            icon="add"
            label="Agregar calentamiento"
            @click="addCalentamiento"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <div class="text-subtitle2">Días</div>
          <q-card
            v-for="(dia, diaIdx) in form.tablaAerobicos.dias"
            :key="diaIdx"
            flat
            bordered
            class="q-pa-sm"
          >
            <div class="row items-center q-col-gutter-sm q-mb-sm">
              <q-select
                v-model="dia.dia"
                :options="diaOptions"
                label="Día"
                outlined
                dense
                emit-value
                map-options
                class="col"
                required
              />
              <q-btn
                dense
                round
                flat
                icon="delete"
                color="negative"
                @click="removeDiaAerobico(diaIdx)"
              />
            </div>
            <q-input
              v-model="dia.indicaciones"
              label="Indicaciones"
              type="textarea"
              autogrow
              outlined
              dense
              class="q-mb-sm"
            />

            <q-markup-table flat bordered dense wrap-cells>
              <thead>
                <tr class="bg-green-1">
                  <th class="text-left">Ejercicio</th>
                  <th class="text-left">Series</th>
                  <th class="text-left">Repeticiones</th>
                  <th class="text-left">Descanso</th>
                  <th class="text-left">Intensidad/Peso</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(ej, ejIdx) in dia.ejercicios" :key="ejIdx">
                  <td style="min-width: 200px">
                    <ItemPickerField
                      v-model="ej.ejercicio"
                      :items="ejercicioOptions"
                      label="Ejercicio"
                      required
                    />
                  </td>
                  <td style="min-width: 100px">
                    <q-input
                      v-model.number="ej.series"
                      type="number"
                      dense
                      outlined
                      min="1"
                      required
                    />
                  </td>
                  <td style="min-width: 120px">
                    <q-input
                      v-model.number="ej.repeticiones"
                      type="number"
                      dense
                      outlined
                      min="1"
                      required
                    />
                  </td>
                  <td style="min-width: 140px">
                    <q-input v-model="ej.descanso" dense outlined required />
                  </td>
                  <td style="min-width: 140px">
                    <q-input v-model="ej.intensidadPeso" dense outlined required>
                      <template #append>
                        <q-btn dense round flat icon="arrow_drop_down">
                          <q-menu>
                            <q-list dense style="min-width: 140px">
                              <q-item
                                v-for="intensidad in intensidadPesoOptions"
                                :key="intensidad"
                                v-close-popup
                                clickable
                                @click="ej.intensidadPeso = intensidad"
                              >
                                <q-item-section>{{ intensidad }}</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-btn>
                      </template>
                    </q-input>
                  </td>
                  <td>
                    <q-btn
                      dense
                      round
                      flat
                      icon="delete"
                      color="negative"
                      @click="removeEjercicioAerobico(diaIdx, ejIdx)"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
            <q-input
              v-model="dia.nota"
              label="Nota"
              type="textarea"
              autogrow
              outlined
              dense
              class="q-mt-sm"
            />
            <q-btn
              flat
              dense
              color="green-8"
              icon="add"
              label="Agregar ejercicio"
              class="q-mt-sm"
              @click="addEjercicioAerobico(diaIdx)"
            />
          </q-card>
          <q-btn flat color="primary" icon="add" label="Agregar día" @click="addDiaAerobico" />
        </q-card-section>
      </q-card>

      <!-- ===== TABLA AEROBICOS ===== -->
      <q-card flat bordered>
        <q-card-section class="bg-orange-1">
          <div class="text-h6 row items-center">
            <q-icon name="fitness_center" class="q-mr-sm" size="30px" color="orange-9" />
            Ejercicios Aeróbicos
          </div>
        </q-card-section>
        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-card
            v-for="(dia, diaIdx) in form.tablaAnaerobicos.dias"
            :key="diaIdx"
            flat
            bordered
            class="q-pa-sm"
          >
            <div class="row items-center q-col-gutter-sm q-mb-sm">
              <q-select
                v-model="dia.dia"
                :options="diaOptions"
                label="Día"
                outlined
                dense
                emit-value
                map-options
                class="col"
                required
              />
              <q-btn
                dense
                round
                flat
                icon="delete"
                color="negative"
                @click="removeDiaAnaerobico(diaIdx)"
              />
            </div>
            <q-input
              v-model="dia.indicaciones"
              label="Indicaciones"
              type="textarea"
              autogrow
              outlined
              dense
              class="q-mb-sm"
            />

            <q-markup-table flat bordered dense wrap-cells>
              <thead>
                <tr class="bg-orange-1">
                  <th class="text-left">Ejercicio</th>
                  <th class="text-left">Descripción</th>
                  <th class="text-left">Descanso</th>
                  <th class="text-left">Intensidad/Peso</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(ej, ejIdx) in dia.ejercicios" :key="ejIdx">
                  <td style="min-width: 200px">
                    <ItemPickerField
                      v-model="ej.ejercicio"
                      :items="ejercicioOptions"
                      label="Ejercicio"
                      required
                    />
                  </td>
                  <td style="min-width: 180px">
                    <q-input v-model="ej.descripcion" dense outlined required />
                  </td>
                  <td style="min-width: 140px">
                    <q-input v-model="ej.descanso" dense outlined required />
                  </td>
                  <td style="min-width: 140px">
                    <q-input v-model="ej.intensidadPeso" dense outlined required />
                  </td>
                  <td>
                    <q-btn
                      dense
                      round
                      flat
                      icon="delete"
                      color="negative"
                      @click="removeEjercicioAnaerobico(diaIdx, ejIdx)"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
            <q-input
              v-model="dia.nota"
              label="Nota"
              type="textarea"
              autogrow
              outlined
              dense
              class="q-mt-sm"
            />
            <q-btn
              flat
              dense
              color="orange-9"
              icon="add"
              label="Agregar ejercicio"
              class="q-mt-sm"
              @click="addEjercicioAnaerobico(diaIdx)"
            />
          </q-card>
          <q-btn flat color="primary" icon="add" label="Agregar día" @click="addDiaAnaerobico" />
        </q-card-section>
      </q-card>

      <!-- ===== RECOMENDACIONES ===== -->
      <q-card flat bordered>
        <q-card-section class="bg-blue-1">
          <div class="text-h6 row items-center">
            <q-icon name="tips_and_updates" class="q-mr-sm" size="30px" color="primary" />
            Recomendaciones
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-gutter-sm">
          <div
            v-for="(recomendacion, idx) in form.recomendaciones"
            :key="idx"
            class="row items-center q-gutter-sm"
          >
            <q-input
              v-model="form.recomendaciones[idx]"
              outlined
              dense
              class="col"
              placeholder="Escribe una recomendación..."
            />
            <q-btn
              dense
              round
              flat
              icon="delete"
              color="negative"
              @click="removeRecomendacion(idx)"
            />
          </div>
          <q-btn
            flat
            color="primary"
            icon="add"
            label="Agregar recomendación"
            @click="addRecomendacion"
          />
        </q-card-section>
      </q-card>

      <div class="row justify-end q-gutter-sm">
        <q-btn label="Cancelar" flat color="grey-8" :to="{ name: 'generar-plan' }" />
        <q-btn
          :label="isEditing ? 'Guardar cambios' : 'Registrar rutina'"
          color="primary"
          type="submit"
          :loading="saving"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import ItemPickerField from '@/components/ItemPickerField.vue'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

// TODO: reemplazar por la URL real de la API de Express
const API_URL = import.meta.env.API_URL

const isEditing = computed(() => !!route.params.id)
const isCopying = computed(() => !!route.query.copiar)
const sourcePlanId = computed(() => route.params.id ?? route.query.copiar)
const loading = ref(false)
const saving = ref(false)

const clientes = ref([])
const ejercicios = ref([])
const gruposMusculares = ref([])

const diaOptions = [
  { label: 'Lunes', value: 1 },
  { label: 'Martes', value: 2 },
  { label: 'Miércoles', value: 3 },
  { label: 'Jueves', value: 4 },
  { label: 'Viernes', value: 5 },
  { label: 'Sábado', value: 6 },
  { label: 'Domingo', value: 7 },
]

const tipoEntrenamientoOptions = ['fuerza', 'potencia', 'aerobico', 'resistencia', 'preventivo']

const intensidadOptions = [
  { label: 'ligero', value: 'ligero' },
  { label: 'ligero+', value: 'ligero1' },
  { label: 'ligero++', value: 'ligero2' },
  { label: 'moderado', value: 'moderado' },
  { label: 'moderado+', value: 'moderado1' },
  { label: 'moderado++', value: 'moderado2' },
  { label: 'vigoroso', value: 'vigoroso' },
  { label: 'vigoroso+', value: 'vigoroso1' },
  { label: 'vigoroso++', value: 'vigoroso2' },
]

const intensidadPesoOptions = intensidadOptions.map(({ label }) => label)

const clienteOptions = computed(() =>
  clientes.value.map((c) => ({ label: c.nombre, value: c._id })),
)
const ejercicioOptions = computed(() =>
  ejercicios.value.map((e) => ({ label: e.nombre, value: e._id, imagen: e.imagen })),
)
const grupoMuscularOptions = computed(() =>
  gruposMusculares.value.map((g) => ({ label: g.nombre, value: g._id, imagen: g.imagen })),
)

function emptyEjercicioAerobico() {
  return { ejercicio: null, series: null, repeticiones: null, descanso: '', intensidadPeso: '' }
}

function emptyEjercicioAnaerobico() {
  return { ejercicio: null, descripcion: '', descanso: '', intensidadPeso: '' }
}

function emptyForm() {
  return {
    cliente: null,
    recomendaciones: [],
    tablaGeneral: { detalles: [{ dia: 1, detalle: '' }] },
    tablaGeneralEspecificaciones: {
      especificaciones: [
        { dia: 1, tipoEntrenamiento: null, grupoMuscularZona: null, intensidad: null },
      ],
    },
    tablaAerobicos: {
      calentamientos: [{ parteCuerpo: '' }],
      dias: [{ dia: 1, indicaciones: '', nota: '', ejercicios: [emptyEjercicioAerobico()] }],
    },
    tablaAnaerobicos: {
      dias: [{ dia: 1, indicaciones: '', nota: '', ejercicios: [emptyEjercicioAnaerobico()] }],
    },
  }
}

const form = ref(emptyForm())

/* ---- Tabla general (detalles) ---- */
function addDetalle() {
  form.value.tablaGeneral.detalles.push({ dia: 1, detalle: '' })
}
function removeDetalle(idx) {
  form.value.tablaGeneral.detalles.splice(idx, 1)
}

/* ---- Recomendaciones ---- */
function addRecomendacion() {
  form.value.recomendaciones.push('')
}
function removeRecomendacion(idx) {
  form.value.recomendaciones.splice(idx, 1)
}

// mantiene las especificaciones por día precargadas con los días elegidos en la tabla general
watch(
  () => form.value.tablaGeneral.detalles.map((d) => d.dia),
  (dias, diasAnteriores) => {
    const especificaciones = form.value.tablaGeneralEspecificaciones.especificaciones

    for (const dia of dias) {
      if (!especificaciones.some((e) => e.dia === dia)) {
        especificaciones.push({
          dia,
          tipoEntrenamiento: null,
          grupoMuscularZona: null,
          intensidad: null,
        })
      }
    }

    // limpia las especificaciones auto-agregadas y aún vacías de días que ya no están en la tabla general
    const diasQuitados = (diasAnteriores ?? []).filter((dia) => !dias.includes(dia))
    for (const dia of diasQuitados) {
      const idx = especificaciones.findIndex(
        (e) => e.dia === dia && !e.tipoEntrenamiento && !e.grupoMuscularZona && !e.intensidad,
      )
      if (idx !== -1) especificaciones.splice(idx, 1)
    }
  },
  { immediate: true },
)

/* ---- Especificaciones ---- */
function addEspecificacion() {
  form.value.tablaGeneralEspecificaciones.especificaciones.push({
    dia: 1,
    tipoEntrenamiento: null,
    grupoMuscularZona: null,
    intensidad: null,
  })
}
function removeEspecificacion(idx) {
  form.value.tablaGeneralEspecificaciones.especificaciones.splice(idx, 1)
}

/* ---- Aeróbicos ---- */
function addCalentamiento() {
  form.value.tablaAerobicos.calentamientos.push({ parteCuerpo: '' })
}
function removeCalentamiento(idx) {
  form.value.tablaAerobicos.calentamientos.splice(idx, 1)
}
function addDiaAerobico() {
  form.value.tablaAerobicos.dias.push({
    dia: 1,
    indicaciones: '',
    nota: '',
    ejercicios: [emptyEjercicioAerobico()],
  })
}
function removeDiaAerobico(idx) {
  form.value.tablaAerobicos.dias.splice(idx, 1)
}
function addEjercicioAerobico(diaIdx) {
  form.value.tablaAerobicos.dias[diaIdx].ejercicios.push(emptyEjercicioAerobico())
}
function removeEjercicioAerobico(diaIdx, ejIdx) {
  form.value.tablaAerobicos.dias[diaIdx].ejercicios.splice(ejIdx, 1)
}

/* ---- Anaeróbicos ---- */
function addDiaAnaerobico() {
  form.value.tablaAnaerobicos.dias.push({
    dia: 1,
    indicaciones: '',
    nota: '',
    ejercicios: [emptyEjercicioAnaerobico()],
  })
}
function removeDiaAnaerobico(idx) {
  form.value.tablaAnaerobicos.dias.splice(idx, 1)
}
function addEjercicioAnaerobico(diaIdx) {
  form.value.tablaAnaerobicos.dias[diaIdx].ejercicios.push(emptyEjercicioAnaerobico())
}
function removeEjercicioAnaerobico(diaIdx, ejIdx) {
  form.value.tablaAnaerobicos.dias[diaIdx].ejercicios.splice(ejIdx, 1)
}

/* ---- Carga de catálogos ---- */
async function fetchClientes() {
  try {
    const res = await fetch(`${API_URL}/clientes/`)
    const data = await res.json()
    clientes.value = Array.isArray(data) ? data : (data.data ?? data.clientes ?? [])
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar clientes' })
    console.error(error)
  }
}

async function fetchEjercicios() {
  try {
    const res = await fetch(`${API_URL}/ejercicios/`)
    const data = await res.json()
    ejercicios.value = Array.isArray(data) ? data : (data.data ?? data.ejercicios ?? [])
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar ejercicios' })
    console.error(error)
  }
}

async function fetchGruposMusculares() {
  try {
    const res = await fetch(`${API_URL}/grupos-musculares/`)
    const data = await res.json()
    gruposMusculares.value = Array.isArray(data) ? data : (data.data ?? data.gruposMusculares ?? [])
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar grupos musculares' })
    console.error(error)
  }
}

// normaliza por si la relación viene populada ({ _id, ... }) en vez del id plano
function toId(item) {
  return item && typeof item === 'object' ? item._id : item
}

// ids de las sub-tablas ya existentes (modo edición), usados para hacer PATCH en vez de POST
const tablaGeneralId = ref(null)
const tablaGeneralEspecificacionesId = ref(null)
const tablaAerobicosId = ref(null)
const tablaAnaerobicosId = ref(null)

async function fetchPlan() {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/rutinas/${sourcePlanId.value}`)
    const json = await res.json()
    const plan = json.data ?? json

    tablaGeneralId.value = isCopying.value ? null : toId(plan.tablaGeneral)
    tablaGeneralEspecificacionesId.value = isCopying.value
      ? null
      : toId(plan.tablaGeneralEspecificaciones)
    tablaAerobicosId.value = isCopying.value ? null : toId(plan.tablaAerobicos)
    tablaAnaerobicosId.value = isCopying.value ? null : toId(plan.tablaAnaerobicos)

    form.value = {
      cliente: toId(plan.cliente),
      recomendaciones: (plan.recomendaciones ?? []).map((recomendacion) =>
        typeof recomendacion === 'string' ? recomendacion : recomendacion.descripcion,
      ),
      tablaGeneral: {
        detalles: (plan.tablaGeneral?.detalles ?? [{ dia: 1, detalle: '' }]).map((d, i) =>
          typeof d === 'string' ? { dia: i + 1, detalle: d } : d,
        ),
      },
      tablaGeneralEspecificaciones: {
        especificaciones: (plan.tablaGeneralEspecificaciones?.especificaciones ?? []).map((e) => ({
          dia: e.dia,
          tipoEntrenamiento: e.tipoEntrenamiento ?? null,
          grupoMuscularZona: toId(e.zona ?? e.grupoMuscularZona) ?? null,
          intensidad: e.intensidad ?? null,
        })),
      },
      tablaAerobicos: {
        calentamientos: plan.tablaAerobicos?.calentamientos ?? [{ parteCuerpo: '' }],
        dias: (plan.tablaAerobicos?.dias ?? []).map((d) => ({
          dia: d.dia,
          indicaciones: d.indicaciones ?? '',
          nota: d.nota ?? '',
          ejercicios: (d.ejercicios ?? []).map((e) => ({
            ejercicio: toId(e.ejercicio),
            series: e.series,
            repeticiones: e.repeticiones,
            descanso: e.descanso,
            intensidadPeso: e.intensidadPeso,
          })),
        })),
      },
      tablaAnaerobicos: {
        dias: (plan.tablaAnaerobicos?.dias ?? []).map((d) => ({
          dia: d.dia,
          indicaciones: d.indicaciones ?? '',
          nota: d.nota ?? '',
          ejercicios: (d.ejercicios ?? []).map((e) => ({
            ejercicio: toId(e.ejercicio),
            descripcion: e.descripcion,
            descanso: e.descanso,
            intensidadPeso: e.intensidadPeso,
          })),
        })),
      },
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar la rutina' })
    console.error(error)
  } finally {
    loading.value = false
  }
}

// crea o actualiza un sub-recurso y devuelve su _id
async function guardarSubTabla(endpoint, idExistente, body) {
  const url = idExistente ? `${API_URL}/${endpoint}/${idExistente}` : `${API_URL}/${endpoint}/`
  const method = idExistente ? 'PATCH' : 'POST'
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Error al guardar ${endpoint}`)
  const json = await res.json()
  const data = json.data ?? json
  return idExistente ?? data._id
}

async function onSubmit() {
  saving.value = true
  try {
    // TODO: ajustar los nombres de endpoint si difieren en el backend
    const [tablaGeneral, tablaGeneralEspecificaciones, tablaAerobicos, tablaAnaerobicos] =
      await Promise.all([
        guardarSubTabla('tablas-generales', tablaGeneralId.value, form.value.tablaGeneral),
        guardarSubTabla(
          'tablas-generales-especificaciones',
          tablaGeneralEspecificacionesId.value,
          form.value.tablaGeneralEspecificaciones,
        ),
        guardarSubTabla('tablas-aerobicos', tablaAerobicosId.value, form.value.tablaAerobicos),
        guardarSubTabla(
          'tablas-anaerobicos',
          tablaAnaerobicosId.value,
          form.value.tablaAnaerobicos,
        ),
      ])

    const rutinaPayload = {
      cliente: form.value.cliente,
      recomendaciones: form.value.recomendaciones.filter((recomendacion) => recomendacion.trim()),
      tablaGeneral,
      tablaGeneralEspecificaciones,
      tablaAerobicos,
      tablaAnaerobicos,
    }

    const url = isEditing.value ? `${API_URL}/rutinas/${route.params.id}` : `${API_URL}/rutinas/`
    const method = isEditing.value ? 'PATCH' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rutinaPayload),
    })
    if (!res.ok) throw new Error('Error en la respuesta del servidor')
    $q.notify({
      type: 'positive',
      message: isEditing.value
        ? 'Rutina actualizada'
        : isCopying.value
          ? 'Rutina duplicada'
          : 'Rutina registrada',
    })
    router.push({ name: 'generar-plan' })
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al guardar la rutina' })
    console.error(error)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchClientes(), fetchEjercicios(), fetchGruposMusculares()])
  if (isEditing.value || isCopying.value) await fetchPlan()
})
</script>
