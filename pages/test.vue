<template>
  <v-layout column justify-center align-center>
    <WYSIWYG />
  </v-layout>
</template>

<script>
import WYSIWYG from '@/components/UI/WYSIWYG'

export default {
  components: {
    WYSIWYG
  },
  layout: 'default',
  permissions: ['user', 'create1']
}
</script>
