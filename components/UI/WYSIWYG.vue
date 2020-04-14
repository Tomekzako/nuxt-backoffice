<template>
  <div class="mavonEditor">
    <client-only>
      <mavon-editor class="mavonEditor__editor" ref=md language="en" @imgAdd="imgAdd" :toolbars="markdownOption" v-model="editorValue">
      </mavon-editor>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    editorValue: {
      get() {
        return this.$store.state.wysiwyg.value
      },
      set(value) {
        this.$store.commit('wysiwyg/SET_VALUE', value)
      }
    }
  },
  data() {
    return {
      markdownOption: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        //fullscreen: true,
        readmodel: true,
        htmlcode: true,
        help: true,
        undo: true,
        redo: true,
        trash: true,
        save: true,
        navigation: true,
        alignleft: true,
        aligncenter: true,
        alignright: true,
        subfield: true,
        preview: true
      }
    }
  },
  methods: {
    imgAdd(pos, file) {

      const overlay = {
        color: 'secondary',
        type: 'circular'
      }
      
      this.$store.commit('overlay/SHOW_OVERLAY', overlay)
      
      const formData = new FormData()
      formData.append('file', file)

      this.$store
        .dispatch('upload/uploadFile', formData)
        .then(res => {
          this.$store.commit('overlay/HIDE_OVERLAY')
          this.$refs.md.$img2Url(pos, res.path)
        })
        .catch(e => {
          this.$store.commit('overlay/HIDE_OVERLAY')
          const errorInfo = {
            text: this.$t('errors.defaultInfo'),
            color: 'red'
          }
          this.$store.commit('snackbar/showSnackbar', errorInfo)
        })
    }
  },
  beforeDestroy() {
    this.$store.commit('wysiwyg/SET_VALUE', '')
  }
}
</script>

<style lang="scss">
  .mavonEditor {
    width: 100%;
    height: 100%;
    &__editor {
      z-index: 1!important;
    }
  }
</style>