<template>
  <div>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn 
          class="zg__btn-change-avatar"
          absolute
          fab
          dark
          color="primary"
          @click="onPickFile"
          :disabled="disableField"
        >
          <v-icon dark>mdi-pencil</v-icon>
        </v-btn>
        <input
          type="file"
          style="display:none"
          ref="fileInput"
          accept="image/png, image/jpeg, image/gif"
          @change="onFilePicked"
        />
        <v-avatar size="200px" class="mb-4">
          <v-img
            :src="avatar"
            :lazy-src="avatar"
            aspect-ratio="1"
            class="grey lighten-2"
            max-width="300"
            max-height="300"
            ref="img"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-avatar>
      </v-col>
    </v-row>
    <v-alert
      class="zg__profile-alert mb-4"
      v-if="alert"
      :type="alert.type"
      :value="true"
      dismissible
    >{{ alert.message }}</v-alert>
  </div>
</template>

<script>

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    disableField: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      avatar: typeof this.user.avatar !== 'undefined' ? this.user.avatar : 'https://zerogravity.ptrdigital.xyz/storage/img/avatars/default.png', // #toDo
      alert: null,
    }
  },

  methods: {
    onPickFile() {
      this.$refs.fileInput.click()
    },
    onFilePicked(event) {
      const files = event.target.files
      if (files.length > 0) {
        let filename = files[0].name
        const fileReader = new FileReader()
        fileReader.readAsDataURL(files[0])
        const fileSize = files[0].size
        if (fileSize > 2000000) {
          this.alert = {
            type: 'warning',
            message: this.$t('message.info.fileTooBig')
          }
          return
        } else {
          const formData = new FormData()
          formData.append('avatar', files[0])
          this.$refs.img.isLoading = true

          const sendData = {
            data: formData,
            ...(this.type === 'edit' && { id: this.user.id })
          }

          this.$store
            .dispatch('user/updateAvatar', sendData)
            .then((res) => {

              if(res.code === 200) {
                this.avatar = res.data.avatar
              }
              
              //jęzeli użytkownik zmienia swój profil - aktualizujemy store
              if(this.type === 'me') {
                this.$store.commit('user/SET_USER_AVATAR', res.data.avatar)
              }
              
              this.$refs.img.isLoading = false
            })
            .catch(e => console.log(e))
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_mixins';
.zg__profile_avatar {
  justify-content: center;
  .v-input__control {
    width: auto;
    flex-grow: initial;
    .v-input__slot {
      &::before {
        content: none;
      }
    }
    .v-text-field__slot {
      display: none;
    }
    .v-input__append-inner {
      margin-left: 0;
    }
  }
}
.zg__btn-change-avatar {
  &.v-btn--disabled {
    box-shadow: none;
  }
}
</style>
