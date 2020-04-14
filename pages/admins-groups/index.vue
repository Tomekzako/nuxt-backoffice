<template>
  <div class="zg_wrapper">
    <!-- Header -->
    <page-title-simple :title="$t('menu.settings.adminsGroups')">
      <v-btn v-if="$can('group', 'create')" :to="this.$route.path + '/add'" class="primary px-6 ml-2 font-weight-bold body-1">{{ $t('buttons.add') }}</v-btn>
    </page-title-simple>
    <v-row>
      <v-col>
        <v-card class="pa-3">
          <v-card-title class="mb-5 zg_search-nav">
            <v-text-field
              v-model="search"
              :label="$t('adminGroups.input.search')"
              single-line
              outlined
              flat
              hide-details
              class="mb-2 mb-md-0 body-1"
            ></v-text-field>
            <div class="zg_search-nav__btns">
              <v-btn
                class="primary px-6 mx-1 mx-md-0 mb-2 mb-md-0 ml-0 ml-md-2 font-weight-bold body-1"
                @click="filterTable"
                :loading="loadingBtn"
                :disabled="this.search.length < 2"
                >{{ $t('buttons.search') }}</v-btn
              >
              <v-btn class="secondary px-6 mx-1 mx-md-0 ml-0 ml-md-2 font-weight-bold body-1" @click="resetTable" :loading="loadingBtn2">{{
                $t('buttons.reset')
              }}</v-btn>
            </div>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-data-table
            class="zg_table"
            :headers="headers"
            :items="items"
            :search="search"
            :loading="loading"
            :server-items-length="totalItems"
            :options.sync="options"
            :page="page"
            :items-per-page="itemsPerPage"
            @page-count="pageCount = $event"
            @update:page="updatePage"
            @update:items-per-page="updateItemsPerPage"
            hide-default-footer
            :no-data-text="$t('message.info.noResults')"
          >
            <template v-slot:item.name="props">
              <nuxt-link :to="{ path: $route.path + '/edit/' + props.item.id }">{{ props.item.name }}</nuxt-link>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="zg_pagination">
          <v-pagination v-model="options.page" :total-visible="7" :length="pageCount"></v-pagination>
          <v-spacer></v-spacer>
          <v-select v-model="options.itemsPerPage" :items="[5, 10, 15]" :label="$t('input.itemsPerPage')"></v-select>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import PageTitleSimple from '@/components/UI/PageTitleSimple'

export default {
  components: {
    PageTitleSimple
  },
  data() {
    return {
      pageCount: 0,
      options: {},
      urlQuery: ''
    }
  },
  watch: {
    options: {
      handler() {
        const { sortBy, sortDesc } = this.options
        if (sortBy.length === 1 && sortDesc.length === 1) {
          this.$store.commit(`adminGroup/SET_LOADING`, true)
          if (sortDesc[0]) {
            const orderBy = {
              orderBy: `${sortBy[0]}:desc`
            }
            this.addURLParams(orderBy, true)
          } else {
            const orderBy = {
              orderBy: `${sortBy[0]}:asc`
            }
            this.addURLParams(orderBy, true)
          }
        }
      }
    },
    $route: function() {
      this.urlQuery = decodeURIComponent(this.$route.fullPath).split('?')[1]
      if (this.urlQuery) {
        this.$store.dispatch('adminGroup/getResults', '?' + this.urlQuery)
      } else {
        this.$store.dispatch('adminGroup/getResults', '')
        this.options.sortBy.length = 0
      }
    }
  },
  async fetch({ store, route, query }) {
    this.urlQuery = decodeURIComponent(route.fullPath).split('?')[1]
    if (this.urlQuery) {
      if (this.urlQuery.includes('search')) {
        const queryArr = query.search.replace(/[\[\]']+/g, '').split('=')
        store.commit('adminGroup/SET_SEARCH', queryArr[1])
      }
      await store.dispatch('adminGroup/getResults', '?' + this.urlQuery)
    } else {
      await store.dispatch('adminGroup/getResults', '')
    }
  },
  created() {
    const tableHeaders = this.$t('adminGroups.table.headers')
    this.$store.commit('adminGroup/TRANSLATE_HEADERS', tableHeaders)
  },
  computed: {
    ...mapState({
      items: state => state.adminGroup.items,
      headers: state => state.adminGroup.headers,
      page: state => state.adminGroup.page,
      totalItems: state => state.adminGroup.totalItems,
      itemsPerPage: state => state.adminGroup.itemsPerPage,
      loading: state => state.adminGroup.loading,
      loadingBtn: state => state.adminGroup.loadingBtn,
      loadingBtn2: state => state.adminGroup.loadingBtn2
    }),
    search: {
      get() {
        return this.$store.getters['adminGroup/getSearch']
      },
      set(value) {
        this.$store.commit('adminGroup/SET_SEARCH', value)
      }
    }
  },
  methods: {
    addURLParams(params, oldParams) {
      if (oldParams) {
        let pageParameter = 'page' in this.$route.query
        if (Object.keys(params) == 'name' && pageParameter) {
          let query = Object.assign({}, this.$route.query)
          delete query.page
          this.$router.push({ query: { ...query, ...params } })
        } else {
          this.$router.push({ query: { ...this.$route.query, ...params } })
        }
      } else {
        const temp = parseInt(this.$route.query.page)

        if (Object.is(temp, params.page)) {
          this.$store.commit('adminGroup/SET_LOADING_BTN2', false)
          return
        } else {
          this.$router.push({ query: { ...params } })
        }
      }
    },
    filterTable() {
      if (this.$route.query.search) {
        const queryArr = this.$route.query.search.replace(/[\[\]']+/g, '').split('=')
        if (this.search === queryArr[1]) {
          return
        }
      } else {
        this.$store.commit('adminGroup/SET_LOADING_BTN', true)
        const URL = `name=${this.search}`
        this.$router.push({ query: { search: URL } })
      }
    },
    resetTable() {
      if (Object.keys(this.$route.query).length === 0) {
        this.$store.commit('adminGroup/SET_SEARCH', '')
        return
      }
      this.options.sortBy.length = 0
      this.$store.commit('adminGroup/SET_SEARCH', '')
      this.$store.commit('adminGroup/SET_LOADING_BTN2', true)
      this.$router.replace({ query: null })
    },
    updatePage() {
      const page = {
        page: this.options.page
      }
      this.$store.commit('adminGroup/SET_LOADING', true)
      this.addURLParams(page, true)
    },
    updateItemsPerPage() {
      const itemsPerPage = {
        limit: this.options.itemsPerPage
      }
      this.addURLParams(itemsPerPage, true)
    }
  }
}
</script>
