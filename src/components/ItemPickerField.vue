<template>
  <div>
    <q-input
      :model-value="selectedItem?.label"
      :label="label"
      outlined
      dense
      readonly
      :required="required"
      class="cursor-pointer"
      @click="dialogOpen = true"
    >
      <template #prepend>
        <q-avatar square size="28px" v-if="selectedItem">
          <img :src="selectedItem.imagen || '/body.gif'" />
        </q-avatar>
        <q-icon v-else name="image_search" />
      </template>
      <template v-if="clearable && selectedItem" #append>
        <q-icon name="close" class="cursor-pointer" @click.stop="emit('update:modelValue', null)" />
      </template>
    </q-input>

    <SelectorImagenDialog
      v-model="dialogOpen"
      :title="label"
      :items="items"
      :selected="modelValue"
      @select="(value) => emit('update:modelValue', value)"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SelectorImagenDialog from './SelectorImagenDialog.vue'

const props = defineProps({
  modelValue: { type: [String, Number, null], default: null },
  items: { type: Array, default: () => [] },
  label: { type: String, default: 'Seleccionar' },
  required: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const dialogOpen = ref(false)

const selectedItem = computed(() => props.items.find((item) => item.value === props.modelValue))
</script>
