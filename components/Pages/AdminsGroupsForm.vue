<template>
  <v-row>
    <v-col>
      <v-card class="pa-3 pt-10">
        <p
            class="body-1 black--text mb-3 font-weight-bold mr-2"
          >{{ $t('adminGroups.input.name') }}:</p>
        <v-text-field
          class="mb-5"
          v-model="name"
          :label="$t('adminGroups.input.name')"
          :disabled="name === 'super admin'"
          single-line
          outlined
          flat
          hide-details
        />
        <v-row>
          <v-col cols="12" v-for="(perm, index) in permissions" :key="perm.id">
            <v-data-table
              class="zg_table"
              hide-default-footer
              :headers="[{ text: index, value: 'name' }]"
              :items="perm"
              :loading="loading"
              :show-select="name === 'super admin' ? false : true"
              disable-sort
              v-model="selected"
            >
              <template v-slot:item.name="props">{{ props.item.action }}</template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              class="primary px-6 ml-2 font-weight-bold body-1"
              :loading="loadingBtn"
              :disabled="name.length < 2 || name === 'super admin'"
              @click="save"
            >
              {{
                $t('buttons.save')
              }}
            </v-btn>
            <v-btn
              class="secondary px-6 ml-2 font-weight-bold body-1"
              @click="$router.back()"
            >
              {{
                $t('buttons.back')
              }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      id: this.$route.params.id,
      loading: false,
      loadingBtn: false,
      selected: this.selectedValue,
      name: this.nameValue
    }
  },
  props: {
    type: {
      type: String,
      required: true
    },
    permissions: {
      type: Object,
      required: true
    },
    selectedValue: {
      type: Array,
      required: false,
      default: () => ([])
    },
    nameValue: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    save() {
      this.loadingBtn = true
      this.loading = true

      switch (this.type) {
        case 'edit':
          let edit = {
            id: this.id,
            data: {
              name: this.name,
              permissions: this.selected.map(el => el.id)
            }
          }
          this.$store
            .dispatch('adminGroup/updateGroup', edit)
            .then(res => {
              this.successInfo()          
            })
            .catch(e => console.log(e))
          break;
        case 'add':
          let add = {
            name: this.name,
            permissions: this.selected.map(el => el.id)
          }

          this.$store
            .dispatch('adminGroup/addGroup', add)
            .then(res => {
              this.successInfo()
              this.$router.back()        
            })
            .catch(e => console.log(e))
          break;
      
        default:
          break;
      }
    },
    successInfo() {
      this.loadingBtn = false
      this.loading = false

      const snackbar = {
        text: this.$t('adminGroups.info.saveSuccess'),
        color: 'primary'
      }
      this.$store.commit('snackbar/showSnackbar', snackbar)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_variables';
@import '@/assets/styles/_mixins';
</style>
