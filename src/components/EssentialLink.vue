<template>
  <q-item
    clickable
    :to="props.to"
    :tag="props.to ? undefined : 'a'"
    :target="props.to ? undefined : '_blank'"
    :href="props.to ? undefined : props.link"
  >
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.label }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: '',
  },

  link: {
    type: String,
    default: '#',
  },

  to: {
    type: [String, Object],
    default: null,
  },

  icon: {
    type: String,
    default: '',
  },
})
</script>
