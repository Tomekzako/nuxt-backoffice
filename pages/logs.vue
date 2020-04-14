<template>
  <div class="zg__logs">
    <!-- Header -->
    <page-title-simple :title="$t('menu.settings.logs')" />
    <v-card class="pa-3" :loading="tableViewLoader">
      <Search page="logs" :exportFile="true" :datePicker="true" />
      <v-data-table
        v-if="tableView"
        class="zg__logs-table mt-sm-5"
        :headers="headers"
        :items="logs"
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
        <template v-slot:item.is_active="{ item }">
          <v-icon color="primary" v-if="item.is_active">mdi-circle-medium</v-icon>
          <v-icon color="secondary" v-else>mdi-circle-medium</v-icon>
        </template>
        <template v-slot:item.avatar="{ item }">
          <v-avatar size="40">
            <img :src="item.avatar" :alt="item.first_name" />
          </v-avatar>
        </template>
      </v-data-table>
    </v-card>
    <v-row v-if="tableView">
      <v-col>
        <div class="zg__logs-footer">
          <v-pagination v-model="options.page" :total-visible="7" :length="pageCount"></v-pagination>
          <v-spacer></v-spacer>
          <v-select class v-model="options.itemsPerPage" :items="[5, 10, 15]" :label="$t('input.itemsPerPage')"></v-select>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import PageTitleSimple from '@/components/UI/PageTitleSimple'
import Search from '@/components/UI/Search'

export default {
  components: {
    Search,
    PageTitleSimple
  },
  data() {
    return {
      pageCount: 0,
      options: {},
      urlQuery: ''
    }
  },
  async fetch({ store, params, route, query }) {
    store.commit('logs/SET_TABLE_VIEW', true)
    this.urlQuery = decodeURIComponent(route.fullPath).split('?')[1]

    if (this.urlQuery) {
      if (this.urlQuery.includes('search')) {
        const queryArr = query.search.replace(/[\[\]']+/g, '').split(',')
        const resultUrl = queryArr.map(e => e.split('=')).map(e => ({ name: e[0], value: e[1] }))
        store.commit('logs/SET_SEARCH', resultUrl)
      }
      if (this.urlQuery.includes('dateFrom')) {
        store.commit('logs/SET_DATE_FROM', query.dateFrom)
      }
      if (this.urlQuery.includes('dateTo')) {
        store.commit('logs/SET_DATE_TO', query.dateTo)
      }
      await store.dispatch('logs/getResults', '?' + this.urlQuery)
    } else {
      await store.dispatch('logs/getResults', '')
    }
  },
  computed: {
    ...mapState({
      logs: state => state.logs.logs,
      page: state => state.logs.page,
      totalItems: state => state.logs.totalItems,
      itemsPerPage: state => state.logs.itemsPerPage,
      loading: state => state.logs.loading,
      searchedItems: state => state.logs.searchedItems,
      tableView: state => state.logs.tableView,
      tableViewLoader: state => state.logs.tableViewLoader,
      headers: state => state.logs.headers
    })
  },
  created() {
    const headers = this.$t('logs.table.headers')
    this.$store.commit('logs/TRANSLATE_HEADERS', headers)
  },
  watch: {
    options: {
      handler() {
        const { sortBy, sortDesc } = this.options
        if (sortBy.length === 1 && sortDesc.length === 1) {
          this.$store.commit('logs/SET_LOADING', true)
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
        if (this.urlQuery.includes('search')) {
          const query = this.$route.query.search.replace(/[\[\]']+/g, '').split(',')
          const resultUrl = query.map(e => e.split('=')).map(e => ({ name: e[0], value: e[1] }))
          this.$store.commit('logs/SET_SEARCH', resultUrl)
        }
        this.$store.dispatch('logs/getResults', '?' + this.urlQuery)
      } else {
        this.$store.dispatch('logs/getResults', '')
        this.options.sortBy.length = 0
      }
    }
  },
  methods: {
    toggleBtn(index) {
      if (index === 0) {
        return true
      } else {
        index <= this.searchedItems.length ? true : false
      }
    },
    addURLParams(params, oldParams) {
      if (oldParams) {
        this.$router.push({ query: { ...this.$route.query, ...params } })
      } else {
        const query = { ...this.$route.query, ...params }
        if (Object.keys(query).length === 1 && this.$route.query.page == 1) {
          return
        } else {
          this.$router.push({ query: { ...params } })
        }
      }
    },
    updatePage() {
      const page = {
        page: this.options.page
      }
      this.$store.commit('logs/SET_LOADING', true)
      this.addURLParams(page, true)
    },
    updateItemsPerPage() {
      const itemsPerPage = {
        limit: this.options.itemsPerPage
      }
      this.$store.commit('logs/SET_LOADING', true)
      this.addURLParams(itemsPerPage, true)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_variables';
@import '@/assets/styles/_mixins';
.zg__logs {
  max-width: 120rem;
  margin: 0 auto;

  .zg__logs-table {
    tbody tr:not(:last-child) td:not(.v-data-table__mobile-row) {
      border-bottom: 1px dashed #c4c4c4;
    }
    th {
      font-size: $font-size-root;
      font-weight: 600;
      color: $secondary;
    }
    td {
      font-size: $font-size-root;
      font-weight: normal;
      color: $secondary;
      vertical-align: middle;
    }
  }
  .zg__logs-footer {
    display: flex;
    @include mQuery(xs) {
      flex-direction: column-reverse;
    }
    .v-pagination {
      width: auto;
      .v-pagination__item,
      .v-pagination__navigation {
        font-size: $font-size-root;
        background: rgba(189, 189, 189, 0.2);
        box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
      }
    }
    .v-input {
      max-width: 10rem;
    }
  }
}
</style>
