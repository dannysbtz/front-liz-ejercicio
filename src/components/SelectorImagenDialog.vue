<template>
  <q-dialog :model-value="modelValue" @update:model-value="(v) => emit('update:modelValue', v)">
    <q-card style="min-width: 360px; max-width: 600px; width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn dense round flat icon="close" v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <q-input
          v-model="search"
          dense
          outlined
          clearable
          autofocus
          placeholder="Buscar..."
          @clear="search = ''"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 60vh" class="scroll">
        <div v-if="!filteredItems.length" class="text-grey text-center q-pa-md">
          Sin resultados.
        </div>
        <div v-else class="row q-col-gutter-sm">
          <div v-for="item in filteredItems" :key="item.value" class="col-6 col-sm-4">
            <q-card
              flat
              bordered
              class="cursor-pointer selector-item"
              :class="{ 'selector-item--active': item.value === selected }"
              @click="choose(item)"
            >
              <q-img :src="item.imagen || '/body.gif'" ratio="1" />
              <q-card-section class="q-pa-sm text-center">
                <div class="text-body2 ellipsis">{{ item.label }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Seleccionar' },
  items: { type: Array, default: () => [] },
  selected: { type: [String, Number, null], default: null },
})

const emit = defineEmits(['update:modelValue', 'select'])

const search = ref('')

const filteredItems = computed(() => {
  const texto = search.value?.trim().toLowerCase()
  if (!texto) return props.items
  return props.items.filter((item) => item.label?.toLowerCase().includes(texto))
})

function choose(item) {
  emit('select', item.value)
  emit('update:modelValue', false)
}
</script>

<style scoped>
.selector-item {
  transition: border-color 0.15s ease;
}
.selector-item--active {
  border-color: var(--q-primary);
  border-width: 2px;
}
</style>
