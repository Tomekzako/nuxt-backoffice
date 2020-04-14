<template>
  <div class="zg__admins">
    <!-- Header -->
    <page-title-simple :title="$t('menu.settings.admins')">
      <v-btn v-if="$can('user', 'create')" :to="this.$route.path + '/add'" class="primary px-6 ml-2 font-weight-bold body-1">{{
        $t('buttons.add')
      }}</v-btn>
    </page-title-simple>
    <v-card class="pa-3" :loading="tableViewLoader">
      <Search page="admin" :exportFile="false" :datePicker="false" />
      <v-data-table
        v-if="tableView"
        class="zg__admins-table mt-sm-5"
        :headers="headers"
        :items="admins"
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
        <template v-slot:item.first_name="props">
          <nuxt-link :to="{ path: $route.path + '/edit/' + props.item.id }">{{ props.item.first_name }}</nuxt-link>
        </template>
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
        <div class="zg__admins-footer">
          <v-pagination v-model="options.page" :total-visible="7" :length="pageCount"></v-pagination>
          <v-spacer></v-spacer>
          <v-select class v-model="options.itemsPerPage" :items="[5, 10, 15]" :label="$t('input.itemsPerPage')"></v-select>
        </div>
      </v-col>
    </v-row>
    <confirm ref="confirm" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Confirm from '@/components/UI/Confirm.vue'
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import Search from '@/components/UI/Search'

export default {
  components: {
    Confirm,
    PageTitleSimple,
    Search
  },
  data() {
    return {
      pageCount: 0,
      options: {},
      urlQuery: ''
    }
  },
  async fetch({ store, params, route, query }) {
    store.commit('admin/SET_TABLE_VIEW', true)
    this.urlQuery = decodeURIComponent(route.fullPath).split('?')[1]
    if (this.urlQuery) {
      if (this.urlQuery.includes('search')) {
        const queryArr = query.search.replace(/[\[\]']+/g, '').split(',')
        const resultUrl = queryArr.map(e => e.split('=')).map(e => ({ name: e[0], value: e[1] }))
        store.commit('admin/SET_SEARCH', resultUrl)
      }
      await store.dispatch('admin/getResults', '?' + this.urlQuery)
    } else {
      await store.dispatch('admin/getResults', '')
    }
  },
  created() {
    const tableHeaders = this.$t('admins.table.headers')
    this.$store.commit('admin/TRANSLATE_HEADERS', tableHeaders)
  },
  computed: {
    ...mapState({
      admins: state => state.admin.admins,
      savedFilters: state => state.admin.savedFilters,
      page: state => state.admin.page,
      totalItems: state => state.admin.totalItems,
      itemsPerPage: state => state.admin.itemsPerPage,
      loading: state => state.admin.loading,
      loadingBtn: state => state.admin.loadingBtn,
      loadingBtnReset: state => state.admin.loadingBtnReset,
      loadingFilters: state => state.admin.loadingFilters,
      searchedItems: state => state.admin.searchedItems,
      tableView: state => state.admin.tableView,
      tableViewLoader: state => state.admin.tableViewLoader,
      headers: state => state.admin.headers
    })
  },
  watch: {
    options: {
      handler() {
        const { sortBy, sortDesc } = this.options
        if (sortBy.length === 1 && sortDesc.length === 1) {
          this.$store.commit('admin/SET_LOADING', true)
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
          this.$store.commit('admin/SET_SEARCH', resultUrl)
        }
        this.$store.dispatch('admin/getResults', '?' + this.urlQuery)
      } else {
        this.$store.dispatch('admin/getResults', '')
        this.options.sortBy.length = 0
      }
    }
  },
  methods: {
    toggleBtn(index) {
      if (index === 0) {
        return true
      } else {
        index < this.searchedItems.length - 1 ? true : false
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
      this.$store.commit('admin/SET_LOADING', true)
      this.addURLParams(page, true)
    },
    updateItemsPerPage() {
      const itemsPerPage = {
        limit: this.options.itemsPerPage
      }
      this.$store.commit('admin/SET_LOADING', true)
      this.addURLParams(itemsPerPage, true)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_variables';
@import '@/assets/styles/_mixins';
.zg__admins {
  max-width: 120rem;
  margin: 0 auto;

  .v-card {
    .v-card__title {
      .v-btn {
        height: 3.6rem;
        @include mQuery(xs) {
          min-width: 100%;
        }
      }
    }
    .zg__admins-btnSearch {
      @include mQuery(xs) {
        width: 100%;
      }
    }
    .v-input {
      .v-input__control .v-input__slot {
        .v-text-field__slot {
          .v-label {
            font-size: $font-size-root;
          }
          input {
            padding-left: 5px;
          }
        }
      }
    }
  }
  .zg__admins-table {
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
  .zg__admins-footer {
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
