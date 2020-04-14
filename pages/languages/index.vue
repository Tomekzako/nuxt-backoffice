<template>
  <div class="zg_wrapper">
    
    <!-- Header -->
    <page-title-simple :title="$t('menu.settings.languages')">
      <v-btn v-if="$can('language', 'create')" :to="this.$route.path + '/add'" class="primary px-6 ml-2 font-weight-bold body-1">{{ $t('buttons.add') }}</v-btn>
    </page-title-simple>

    <v-row>
      <v-col>
        <v-card class="pa-3">
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
              <v-btn
                class="primary px-6 mx-1 mx-md-0 mb-2 mb-md-0 ml-0 ml-md-2 font-weight-bold body-1"
                @click="filterTable"
                :loading="loadingBtn"
                :disabled="this.search.length < 2"
              >
                {{
                $t('buttons.search')
                }}
              </v-btn>
              <v-btn
                class="secondary px-6 mx-1 mx-md-0 ml-0 ml-md-2 font-weight-bold body-1"
                @click="resetTable"
                :loading="loadingBtn2"
                :disabled="this.search.length < 1"
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
            @page-count="pageCount = $event"
            @update:page="updatePage"
            @update:items-per-page="updateItemsPerPage"
            hide-default-footer
            :no-data-text="$t('message.info.noResults')"
          >
            <template v-slot:body>
                <draggable tag="tbody" :disabled="search.length" v-model="items" @start="drag=true" @end="drag=false" handle=".handle">
                  <tr v-for="item in items" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>
                      <nuxt-link v-if="$can('language', 'show')" :to="{path: $route.path + '/edit/' + item.id}">{{ item.name }}</nuxt-link> 
                      <span v-else>{{ item.name }}</span>
                    </td>
                    <td>{{ item.code }} </td>
                    <td class="text-right"><v-btn :disabled="!!search.length" v-if="$can('language', 'update')" icon small class="handle my-1"><v-icon size="24">mdi-drag-horizontal-variant</v-icon></v-btn></td>
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
      options: {}
    }
  },
  watch: {
    options: {
      handler() {
        const { sortBy, sortDesc } = this.options
        if (sortBy.length === 1 && sortDesc.length === 1) {
          this.$store.commit('language/SET_LOADING', true)
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
      const decodedURL = decodeURIComponent(this.$route.fullPath).split('?')[1]
      this.$store.dispatch('language/getResults', '?' + decodedURL)
    }
  },
  async fetch({ store, route, query }) {
    const decodedURL = decodeURIComponent(route.fullPath).split('?')[1]
    if (decodedURL) {
      if (decodedURL.includes('search')) {
        const query = query.search.replace(/[\[\]']+/g, '').split('=')
        store.commit('language/SET_SEARCH', query[1])
      }
      await store.dispatch('language/getResults', '?' + decodedURL)
    } else {
      await store.dispatch('language/getResults', '')
    }
  },
  computed: {
    ...mapState({
      //items: state => state.language.items,
      headers: state => state.language.headers,
      page: state => state.language.page,
      totalItems: state => state.language.totalItems,
      itemsPerPage: state => state.language.itemsPerPage,
      loading: state => state.language.loading,
      loadingBtn: state => state.language.loadingBtn,
      loadingBtn2: state => state.language.loadingBtn2
    }),
    search: {
      get() {
        return this.$store.getters['language/getSearch']
      },
      set(value) {
        this.$store.commit('language/SET_SEARCH', value)
      }
    },
    items: {
      get() {
        return this.$store.getters['language/getItemsSimple']
      },
      set(value) {

        const old = [...this.items] //store old items order
        this.$store.commit('language/SET_ITEMS_SIMPLE', value)

        const obj = {
          order: value.map(el => el.id),
          page: this.page,
          perPage: this.itemsPerPage
        }

        console.log(obj);
        
        this.$store.commit('language/SET_LOADING', true)
        this.$store
          .dispatch('language/orderLanguage', obj)
          .then(res => {
            if(res.code === 200) {
              this.$store.commit('language/SET_ITEMS_SIMPLE', value)
            } else {
              // set old items order
              this.$store.commit('language/SET_ITEMS_SIMPLE', old)
            }
            this.$store.commit('language/SET_LOADING', false)
          })
          .catch(e => {
            // set old items order
            this.$store.commit('language/SET_LOADING', false)
            this.$store.commit('language/SET_ITEMS_SIMPLE', old)
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
          this.$store.commit('language/SET_LOADING_BTN2', false)
          return
        } else {
          this.$router.push({ query: { ...params } })
        }
      }
    },
    filterTable() {
      if (this.search == this.$route.query.search) {
        return
      } else {
        this.$store.commit('language/SET_LOADING_BTN', true)
        const URL = [`name=${this.search}`]
        this.$router.push({ query: { search: URL } })
      }
    },
    resetTable() {
      if (Object.keys(this.$route.query).length === 0) {
        this.$store.commit('language/SET_SEARCH', '')
        return
      }
      this.options.sortBy.length = 0
      this.$store.commit('language/SET_LOADING_BTN2', true)
      this.$router.replace({ query: null })
    },
    updatePage() {
      const page = {
        page: this.options.page
      }
      this.$store.commit('language/SET_LOADING', true)
      this.addURLParams(page, true)
    },
    updateItemsPerPage() {
      const itemsPerPage = {
        limit: this.options.itemsPerPage
      }
      this.$store.commit('language/SET_LOADING', true)
      this.addURLParams(itemsPerPage, true)
    }
  }
}
</script>
