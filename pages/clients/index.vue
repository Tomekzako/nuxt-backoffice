<template>
  <div class="zg__client">
    <page-title-simple :title="$t('menu.users')">
      <v-btn v-if="$can('client', 'create')" :to="this.$route.path + '/add'" class="primary px-6 ml-2 font-weight-bold body-1">{{ $t('buttons.add') }}</v-btn>
    </page-title-simple>
    <v-card class="pa-3" :loading="tableViewLoader">
      <Search page="client" :exportFile="true" :datePicker="false" />
      <v-data-table
        v-if="tableView"
        class="zg__client-table mt-sm-5"
        :headers="headers"
        :items="clients"
        :loading="loading"
        :page="page"
        :items-per-page="itemsPerPage"
        :server-items-length="totalItems"
        :options.sync="options"
        @page-count="pageCount = $event"
        @update:page="updatePage"
        @update:items-per-page="updateItemsPerPage"
        hide-default-footer
        :no-data-text="$t('message.info.noResults')"
      >
        <template v-slot:item.first_name="props">
          <nuxt-link v-if="$can('client', 'show')" :to="{ path: $route.path + '/edit/' + props.item.id }">{{ props.item.first_name }}</nuxt-link>
          <span v-else>{{ props.item.first_name }}</span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="deleteClient(item.id)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <v-row v-if="tableView">
      <v-col>
        <div class="zg__client-footer">
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
    store.commit('client/SET_TABLE_VIEW', true)
    this.urlQuery = decodeURIComponent(route.fullPath).split('?')[1]
    store.dispatch('client/getSaved')

    if (this.urlQuery) {
      if (this.urlQuery.includes('search')) {
        const queryArr = query.search.replace(/[\[\]']+/g, '').split(',')
        const resultUrl = queryArr.map(e => e.split('=')).map(e => ({ name: e[0], value: e[1] }))
        store.commit('client/SET_SEARCH', resultUrl)
      }
      if (this.urlQuery.includes('dateFrom')) {
        store.commit('client/SET_DATE_FROM', query.dateFrom)
      }
      if (this.urlQuery.includes('dateTo')) {
        store.commit('client/SET_DATE_TO', query.dateTo)
      }
      await store.dispatch('client/getResults', '?' + this.urlQuery)
    } else {
      await store.dispatch('client/getResults', '')
    }
  },
  computed: {
    ...mapState({
      clients: state => state.client.clients,
      page: state => state.client.page,
      totalItems: state => state.client.totalItems,
      itemsPerPage: state => state.client.itemsPerPage,
      loading: state => state.client.loading,
      searchedItems: state => state.client.searchedItems,
      tableView: state => state.client.tableView,
      tableViewLoader: state => state.client.tableViewLoader,
      headers: state => state.client.headers
    })
  },
  created() {
    const headers = this.$t('clients.table.headers')
    this.$store.commit('client/TRANSLATE_HEADERS', headers)
  },
  watch: {
    options: {
      handler() {
        const { sortBy, sortDesc } = this.options
        if (sortBy.length === 1 && sortDesc.length === 1) {
          this.$store.commit('client/SET_LOADING', true)
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
          this.$store.commit('client/SET_SEARCH', resultUrl)
        }
        this.$store.dispatch('client/getResults', '?' + this.urlQuery)
      } else {
        this.$store.dispatch('client/getResults', '')
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
      this.$store.commit('client/SET_LOADING', true)
      this.addURLParams(page, true)
    },
    updateItemsPerPage() {
      const itemsPerPage = {
        limit: this.options.itemsPerPage
      }
      this.$store.commit('client/SET_LOADING', true)
      this.addURLParams(itemsPerPage, true)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_variables';
@import '@/assets/styles/_mixins';
.zg__client {
  max-width: 120rem;
  margin: 0 auto;

  .zg__client-table {
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
  .zg__client-footer {
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
