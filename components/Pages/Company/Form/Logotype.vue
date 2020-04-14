<template>
  <div class="zg_company-logo">

    <v-row class="px-1">
      <v-col cols="12" class="pb-0">
        <v-form v-model="valid" ref="form">

          <v-col cols="12" class="text-center">
            <input
              type="file"
              style="display:none"
              ref="fileInput"
              accept="image/png, image/jpeg, image/gif"
              @change="onFilePicked"
            />
           
              <v-img
                :src="logo"
                :lazy-src="logo"
                aspect-ratio="1"
                class="grey lighten-2 zg_company-logo__img"
                max-width="250"
                max-height="140"
                ref="img"
                contain
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            <v-btn 
              dark
              color="primary"
              class="zg_company-logo__btn"
              @click="onPickFile"
            >
              {{ $t('company.form.logoBtn') }}
            </v-btn>
          </v-col>
        </v-form>
      </v-col>
    </v-row>

  </div>
</template>

<script>

export default {
  props: {
    logo: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      valid: true,
      logoUrl: this.$route
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
          formData.append('logo', files[0])
          this.$refs.img.isLoading = true

          const sendData = {
            id: 1,
            data: formData
          }

          this.$store
            .dispatch('company/updateLogo', sendData)
            .then(res => {
              this.$refs.img.isLoading = false
              this.logo = res.data.logo
              const successInfo = {
                text: this.$t('company.info.success'),
                color: 'primary'
              }
              this.$store.commit('snackbar/showSnackbar', successInfo)
            })
            .catch(e => {
              this.$refs.img.isLoading = false
              const errorInfo = {
                text: this.$t('errors.defaultInfo'),
                color: 'red'
              }
              this.$store.commit('snackbar/showSnackbar', errorInfo)
            })

        }
      }
    }
  }
}
</script>

<style lang="scss">
.zg_company-logo {
  &__btn {
    display: block;
    margin: 20px auto;
  }
  &__img {
    margin: 0 auto;
    .v-image__image--contain {
      background-size: 90%;
    }
  }
}
</style>