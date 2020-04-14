<template>
  <v-card-title class="mb-5 zg_search-nav">
    <v-text-field
      v-model="search"
      :label="$t('input.search')"
      single-line
      outlined
      flat
      hide-details
      class="mb-2 mb-md-0 body-1"
    ></v-text-field>
    <div class="zg_search-nav__btns">
      <search-btn-table 
        :loading="loadingBtn"
        :disabled="search.length < 2"
        :search="search"
        :name="name"
      />
      <clear-btn-table 
        :loading="loadingBtn2"
        :name="name"
      />
    </div>
    <v-spacer></v-spacer>
  </v-card-title>
</template>

<script>
import { mapState } from 'vuex'
import SearchBtnTable from '@/components/UI/Table/SimpleSearchBtn'
import ClearBtnTable from '@/components/UI/Table/SimpleClearSearchBtn'

export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  components: {
    SearchBtnTable,
    ClearBtnTable
  },
  computed: {
    ...mapState({
      loadingBtn: state => state.currency.loadingBtn,
      loadingBtn2: state => state.currency.loadingBtn2
    }),
    search: {
      get() {
        return this.$store.getters[this.name + '/getSearch']
      },
      set(value) {
        this.$store.commit(this.name + '/SET_SEARCH', value)
      }
    },
  }
}
</script>