<template>
  <div class="zg_wrapper">
    <page-title-simple :title="$t('menu.settings.paymentGroups')">
      <v-btn
        v-if="$can('paymentGroups', 'create')"
        :to="this.$route.path + '/add'"
        class="primary px-6 ml-2 font-weight-bold body-1"
      >
        {{
        $t('buttons.add')
        }}
      </v-btn>
    </page-title-simple>
    <v-row>
      <v-col>
        <v-card class="pa-3">
          <v-card-title class="mb-5 zg_search-nav">
            <v-text-field
              v-model="search"
              :label="$t('paymentGroups.input.search')"
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
              >{{ $t('buttons.search') }}</v-btn>
              <v-btn
                class="secondary px-6 mx-1 mx-md-0 ml-0 ml-md-2 font-weight-bold body-1"
                @click="resetTable"
                :loading="loadingBtn2"
              >
                {{
                $t('buttons.reset')
                }}
              </v-btn>
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
            <template v-slot:body>
              <draggable
                tag="tbody"
                :disabled="search.length"
                v-model="items"
                @start="drag=true"
                @end="drag=false"
                handle=".handle"
              >
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>
                    <nuxt-link
                      v-if="$can('paymentGroups', 'show')"
                      :to="{path: $route.path + '/edit/' + item.id}"
                    >{{ item.name }}</nuxt-link>
                    <span v-else>{{ item.name }}</span>
                  </td>
                  <td class="text-right">
                    <v-btn
                      :disabled="!!search.length"
                      v-if="$can('paymentGroups', 'update')"
                      icon
                      small
                      class="handle my-1"
                    >
                      <v-icon size="24">mdi-drag-horizontal-variant</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </draggable>
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
          <v-select
            v-model="options.itemsPerPage"
            :items="[5, 10, 15]"
            :label="$t('input.itemsPerPage')"
          ></v-select>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import draggable from 'vuedraggable'

export default {
  components: {
    PageTitleSimple,
    draggable
  },
  data() {
    return {
      pageCount: 0,
      options: {},
      urlQuery: ''
    }
  },
  async fetch({ store, route, query }) {
    this.urlQuery = decodeURIComponent(route.fullPath).split('?')[1]
    if (this.urlQuery) {
      if (this.urlQuery.includes('search')) {
        const queryArr = query.search.replace(/[\[\]']+/g, '').split('=')
        store.commit('paymentGroups/SET_SEARCH', queryArr[1])
      }
      await store.dispatch('paymentGroups/getResults', '?' + this.urlQuery)
    } else {
      await store.dispatch('paymentGroups/getResults', '')
    }
  },
  created() {
    const tableHeaders = this.$t('paymentGroups.table.headers')
    this.$store.commit('paymentGroups/TRANSLATE_HEADERS', tableHeaders)
  },
  watch: {
    options: {
      handler() {
        const { sortBy, sortDesc } = this.options
        if (sortBy.length === 1 && sortDesc.length === 1) {
          this.$store.commit(`paymentGroups/SET_LOADING`, true)
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
        this.$store.dispatch('paymentGroups/getResults', '?' + this.urlQuery)
      } else {
        this.$store.dispatch('paymentGroups/getResults', '')
        this.options.sortBy.length = 0
      }
    }
  },
  computed: {
    ...mapState({
      // items: state => state.paymentGroups.items,
      headers: state => state.paymentGroups.headers,
      page: state => state.paymentGroups.page,
      totalItems: state => state.paymentGroups.totalItems,
      itemsPerPage: state => state.paymentGroups.itemsPerPage,
      loading: state => state.paymentGroups.loading,
      loadingBtn: state => state.paymentGroups.loadingBtn,
      loadingBtn2: state => state.paymentGroups.loadingBtn2
    }),
    search: {
      get() {
        return this.$store.getters['paymentGroups/getSearch']
      },
      set(value) {
        this.$store.commit('paymentGroups/SET_SEARCH', value)
      }
    },
    items: {
      get() {
        return this.$store.getters['paymentGroups/getItemsSimple']
      },
      set(value) {
        const old = [...this.items] //store old items order
        this.$store.commit('paymentGroups/SET_ITEMS_SIMPLE', value)

        const obj = {
          order: value.map(el => el.id),
          page: this.page,
          perPage: this.itemsPerPage
        }

        this.$store.commit('paymentGroups/SET_LOADING', true)
        this.$store
          .dispatch('paymentGroups/orderCurrency', obj)
          .then(res => {
            if (res.code === 200) {
              this.$store.commit('paymentGroups/SET_ITEMS_SIMPLE', value)
            } else {
              // set old items order
              this.$store.commit('paymentGroups/SET_ITEMS_SIMPLE', old)
            }
            this.$store.commit('paymentGroups/SET_LOADING', false)
          })
          .catch(e => {
            // set old items order
            this.$store.commit('paymentGroups/SET_LOADING', false)
            this.$store.commit('paymentGroups/SET_ITEMS_SIMPLE', old)
          })
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
          this.$store.commit('paymentGroups/SET_LOADING_BTN2', false)
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
        this.$store.commit('paymentGroups/SET_LOADING_BTN', true)
        const URL = `name=${this.search}`
        this.$router.push({ query: { search: URL } })
      }
    },
    resetTable() {
      if (Object.keys(this.$route.query).length === 0) {
        this.$store.commit('paymentGroups/SET_SEARCH', '')
        return
      }
      this.options.sortBy.length = 0
      this.$store.commit('paymentGroups/SET_SEARCH', '')
      this.$store.commit('paymentGroups/SET_LOADING_BTN2', true)
      this.$router.replace({ query: null })
    },
    updatePage() {
      const page = {
        page: this.options.page
      }
      this.$store.commit('paymentGroups/SET_LOADING', true)
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

<style></style>
