<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md q-gutter-sm">
      <div>
        <h4 class="q-my-none text-bold text-blue">Rutina completa</h4>
        <div v-if="plan" class="text-subtitle1 text-grey-8">
          {{ plan.cliente?.nombre }} · {{ plan.cliente?.edad }} años · {{ plan.cliente?.nivel }}
        </div>
      </div>
      <div class="q-gutter-sm">
        <q-btn flat icon="arrow_back" label="Volver" :to="{ name: 'generar-plan' }" />
        <q-btn
          color="primary"
          icon="download"
          label="Descargar HTML"
          :loading="generandoHtml"
          @click="generarHtml"
        />
      </div>
    </div>

    <q-inner-loading :showing="loading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>

    <template v-if="plan">
      <!-- ===== DATOS DEL CLIENTE ===== -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-blue-1">
          <div class="text-h6 row items-center">
            <q-icon name="person" class="q-mr-sm" size="30px" color="primary" />
            Cliente
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12 col-sm-3">
            <div class="text-caption text-grey-7">Nombre</div>
            <div class="text-body1">{{ plan.cliente?.nombre ?? '—' }}</div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="text-caption text-grey-7">Edad</div>
            <div class="text-body1">{{ plan.cliente?.edad ?? '—' }}</div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="text-caption text-grey-7">Nivel</div>
            <div class="text-body1">{{ plan.cliente?.nivel ?? '—' }}</div>
          </div>
          <div class="col-12 col-sm-3">
            <div class="text-caption text-grey-7">Objetivo</div>
            <div class="text-body1">{{ plan.cliente?.objetivos ?? '—' }}</div>
          </div>
          <div class="col-12">
            <div class="text-caption text-grey-7">Especificaciones</div>
            <div class="text-body1">{{ plan.cliente?.especificaciones ?? '—' }}</div>
          </div>
        </q-card-section>
      </q-card>

      <!-- ===== TABLA GENERAL (DETALLES) ===== -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2">
          <div class="text-h6 row items-center">
            <q-icon name="checklist" class="q-mr-sm" size="30px" color="primary" />
            Tabla General
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list v-if="plan.tablaGeneral?.detalles?.length" bordered separator>
            <q-item v-for="(detalle, idx) in plan.tablaGeneral.detalles" :key="idx">
              <q-item-section avatar>
                <q-badge color="primary">{{
                  typeof detalle === 'string' ? nombreDia(idx + 1) : nombreDia(detalle.dia)
                }}</q-badge>
              </q-item-section>
              <q-item-section>{{
                typeof detalle === 'string' ? detalle : detalle.detalle
              }}</q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey">Sin detalles registrados.</div>
        </q-card-section>
      </q-card>

      <!-- ===== RECOMENDACIONES ===== -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-blue-1">
          <div class="text-h6 row items-center">
            <q-icon name="tips_and_updates" class="q-mr-sm" size="30px" color="primary" />
            Recomendaciones
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list v-if="plan.recomendaciones?.length" bordered separator>
            <q-item v-for="(recomendacion, idx) in plan.recomendaciones" :key="idx">
              <q-item-section avatar>
                <q-icon name="check_circle" color="primary" />
              </q-item-section>
              <q-item-section>{{ textoRecomendacion(recomendacion) }}</q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-grey">Sin recomendaciones registradas.</div>
        </q-card-section>
      </q-card>

      <!-- ===== TABLA GENERAL CON ESPECIFICACIONES ===== -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2">
          <div class="text-h6 row items-center">
            <q-icon name="tune" class="q-mr-sm" size="30px" color="primary" />
            Especificaciones por día
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div
            v-if="!plan.tablaGeneralEspecificaciones?.especificaciones?.length"
            class="text-grey"
          >
            Sin especificaciones registradas.
          </div>
          <div v-else class="row q-col-gutter-md">
            <div
              v-for="esp in plan.tablaGeneralEspecificaciones.especificaciones"
              :key="esp.dia + (esp.tipoEntrenamiento ?? '')"
              class="col-12 col-sm-6 col-md-4"
            >
              <q-card flat bordered>
                <q-card-section class="q-pb-none">
                  <q-badge color="primary" class="text-body2 q-pa-sm">
                    {{ nombreDia(esp.dia) }}
                  </q-badge>
                </q-card-section>
                <q-card-section class="q-gutter-xs">
                  <div v-if="esp.tipoEntrenamiento">
                    <span class="text-caption text-grey-7">Tipo: </span>
                    <q-chip dense color="teal" text-color="white">{{
                      esp.tipoEntrenamiento
                    }}</q-chip>
                  </div>
                  <div
                    v-if="grupoMuscularPorZona(zonaEspecificacion(esp))"
                    class="row items-center no-wrap"
                  >
                    <q-avatar square size="56px" class="q-mr-sm">
                      <q-img
                        :src="imagenGrupoMuscular(zonaEspecificacion(esp))"
                        alt="Imagen del grupo muscular"
                        fit="contain"
                      />
                    </q-avatar>
                    <div>
                      <div class="text-caption text-grey-7">Zona</div>
                      <div>{{ nombreGrupoMuscular(zonaEspecificacion(esp)) }}</div>
                    </div>
                  </div>
                  <div v-if="esp.intensidad">
                    <span class="text-caption text-grey-7">Intensidad: </span>
                    <q-chip dense color="orange" text-color="white">{{
                      nombreIntensidad(esp.intensidad)
                    }}</q-chip>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- ===== TABLA ANAEROBICOS ===== -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-green-1">
          <div class="text-h6 row items-center">
            <q-icon name="directions_run" class="q-mr-sm" size="30px" color="green-8" />
            Ejercicios Anaeróbicos
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="plan.tablaAerobicos?.calentamientos?.length">
          <div class="text-subtitle2 q-mb-sm">Calentamiento</div>
          <div class="q-gutter-sm">
            <q-chip
              v-for="(c, idx) in plan.tablaAerobicos.calentamientos"
              :key="idx"
              color="green-2"
              icon="self_improvement"
            >
              {{ c.parteCuerpo }}
            </q-chip>
          </div>
        </q-card-section>
        <q-separator v-if="plan.tablaAerobicos?.calentamientos?.length" />
        <q-card-section>
          <div v-if="!plan.tablaAerobicos?.dias?.length" class="text-grey">
            Sin días registrados.
          </div>
          <q-expansion-item
            v-for="d in plan.tablaAerobicos?.dias ?? []"
            :key="d.dia"
            :label="nombreDia(d.dia)"
            icon="event"
            header-class="text-bold"
            default-opened
            class="q-mb-sm"
            group="aerobicos"
          >
            <div v-if="d.indicaciones" class="q-px-md q-pt-sm">
              <span class="text-caption text-grey-7">Indicaciones: </span>{{ d.indicaciones }}
            </div>
            <q-markup-table flat bordered dense wrap-cells>
              <thead>
                <tr class="bg-green-1">
                  <th class="text-left">Imagen</th>
                  <th class="text-left">Ejercicio</th>
                  <th class="text-left">Series</th>
                  <th class="text-left">Repeticiones</th>
                  <th class="text-left">Descanso</th>
                  <th class="text-left">Intensidad/Peso</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(e, idx) in d.ejercicios" :key="idx">
                  <td>
                    <q-img
                      :src="imagenEjercicio(e.ejercicio)"
                      alt="Imagen del ejercicio"
                      fit="contain"
                      style="width: 70px; height: 70px"
                    />
                  </td>
                  <td>{{ nombreEjercicio(e.ejercicio) }}</td>
                  <td>{{ e.series }}</td>
                  <td>{{ e.repeticiones }}</td>
                  <td>{{ e.descanso }}</td>
                  <td>{{ e.intensidadPeso }}</td>
                </tr>
              </tbody>
            </q-markup-table>
            <div v-if="d.nota" class="q-px-md q-pb-sm q-pt-xs">
              <span class="text-caption text-grey-7">Nota: </span>{{ d.nota }}
            </div>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <!-- ===== TABLA AEROBICOS ===== -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-orange-1">
          <div class="text-h6 row items-center">
            <q-icon name="fitness_center" class="q-mr-sm" size="30px" color="orange-9" />
            Ejercicios Aeróbicos
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div v-if="!plan.tablaAnaerobicos?.dias?.length" class="text-grey">
            Sin días registrados.
          </div>
          <q-expansion-item
            v-for="d in plan.tablaAnaerobicos?.dias ?? []"
            :key="d.dia"
            :label="nombreDia(d.dia)"
            icon="event"
            header-class="text-bold"
            default-opened
            class="q-mb-sm"
            group="anaerobicos"
          >
            <div v-if="d.indicaciones" class="q-px-md q-pt-sm">
              <span class="text-caption text-grey-7">Indicaciones: </span>{{ d.indicaciones }}
            </div>
            <q-markup-table flat bordered dense wrap-cells>
              <thead>
                <tr class="bg-orange-1">
                  <th class="text-left">Imagen</th>
                  <th class="text-left">Ejercicio</th>
                  <th class="text-left">Descripción</th>
                  <th class="text-left">Descanso</th>
                  <th class="text-left">Intensidad/Peso</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(e, idx) in d.ejercicios" :key="idx">
                  <td>
                    <q-img
                      :src="imagenEjercicio(e.ejercicio)"
                      alt="Imagen del ejercicio"
                      fit="contain"
                      style="width: 70px; height: 70px"
                    />
                  </td>
                  <td>{{ nombreEjercicio(e.ejercicio) }}</td>
                  <td>{{ e.descripcion }}</td>
                  <td>{{ e.descanso }}</td>
                  <td>{{ e.intensidadPeso }}</td>
                </tr>
              </tbody>
            </q-markup-table>
            <div v-if="d.nota" class="q-px-md q-pb-sm q-pt-xs">
              <span class="text-caption text-grey-7">Nota: </span>{{ d.nota }}
            </div>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </template>

    <div v-else-if="!loading" class="text-grey text-center q-pa-xl">
      No se encontró la rutina solicitada.
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()

// TODO: reemplazar por la URL real de la API de Express
const API_URL = import.meta.env.API_URL
const API_URL_NGINX = API_URL

const plan = ref(null)
const ejercicios = ref([])
const gruposMusculares = ref([])
const loading = ref(false)
const generandoHtml = ref(false)

const diasSemana = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
}

function nombreDia(dia) {
  return diasSemana[dia] ?? `Día ${dia}`
}

const intensidadLabels = {
  ligero: 'ligero',
  ligero1: 'ligero+',
  ligero2: 'ligero++',
  moderado: 'moderado',
  moderado1: 'moderado+',
  moderado2: 'moderado++',
  vigoroso: 'vigoroso',
  vigoroso1: 'vigoroso+',
  vigoroso2: 'vigoroso++',
}

function nombreIntensidad(intensidad) {
  return intensidadLabels[intensidad] ?? intensidad
}

function ejercicioPorId(ejercicio) {
  const ejercicioId = ejercicio && typeof ejercicio === 'object' ? ejercicio._id : ejercicio
  return (
    ejercicios.value.find((item) => String(item._id) === String(ejercicioId)) ??
    (typeof ejercicio === 'object' ? ejercicio : null)
  )
}

function nombreEjercicio(ejercicio) {
  return ejercicioPorId(ejercicio)?.nombre ?? '—'
}

function imagenEjercicio(ejercicio) {
  return normalizarImagen(ejercicioPorId(ejercicio)?.imagen) || '/body.gif'
}

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

function grupoMuscularPorZona(zona) {
  const grupoId = zona && typeof zona === 'object' ? zona._id : zona
  return (
    gruposMusculares.value.find((grupo) => String(grupo._id) === String(grupoId)) ??
    (typeof zona === 'object' ? zona : null)
  )
}

function nombreGrupoMuscular(zona) {
  return grupoMuscularPorZona(zona)?.nombre ?? '—'
}

function imagenGrupoMuscular(zona) {
  const grupo = grupoMuscularPorZona(zona)
  const imagen = normalizarImagen(grupo?.imagen)
  return imagen || '/body.gif'
}

function zonaEspecificacion(especificacion) {
  return especificacion.zona ?? especificacion.grupoMuscularZona
}

function textoRecomendacion(recomendacion) {
  return typeof recomendacion === 'string' ? recomendacion : recomendacion.descripcion
}

async function fetchPlan() {
  loading.value = true
  try {
    const [planRes, ejerciciosRes, gruposRes] = await Promise.all([
      fetch(`${API_URL}/rutinas/${route.params.id}`),
      fetch(`${API_URL}/ejercicios/`),
      fetch(`${API_URL}/grupos-musculares/`),
    ])

    const planJson = await planRes.json()
    plan.value = planJson.data ?? planJson

    const ejerciciosJson = await ejerciciosRes.json()
    const ejerciciosData = Array.isArray(ejerciciosJson)
      ? ejerciciosJson
      : (ejerciciosJson.data ?? ejerciciosJson.ejercicios ?? [])
    ejercicios.value = ejerciciosData.map((ejercicio) => ({
      ...ejercicio,
      imagen: normalizarImagen(ejercicio.imagen),
    }))

    const gruposJson = await gruposRes.json()
    const gruposData = Array.isArray(gruposJson)
      ? gruposJson
      : (gruposJson.data ?? gruposJson.gruposMusculares ?? [])
    gruposMusculares.value = gruposData.map((grupo) => ({
      ...grupo,
      imagen: normalizarImagen(grupo.imagen),
    }))
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al cargar la rutina' })
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function generarHtml() {
  generandoHtml.value = true
  try {
    const res = await fetch(`${API_URL}/rutinas/${route.params.id}/pdf`)
    if (!res.ok) throw new Error('No se pudo generar el HTML')
    const html = await res.text()
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = `rutina-${plan.value?.cliente?.nombre ?? route.params.id}.html`
    enlace.click()
    URL.revokeObjectURL(url)
    $q.notify({ type: 'positive', message: 'HTML generado correctamente' })
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al generar el HTML' })
    console.error(error)
  } finally {
    generandoHtml.value = false
  }
}

onMounted(fetchPlan)
</script>
