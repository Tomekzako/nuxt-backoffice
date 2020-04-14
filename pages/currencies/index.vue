<template>
  <div class="zg_wrapper">
    
    <!-- Header -->
    <page-title-simple :title="$t('menu.settings.currencies')">
      <v-btn v-if="$can('currency', 'create')" :to="this.$route.path + '/add'" class="primary px-6 ml-2 font-weight-bold body-1">{{ $t('buttons.add') }}</v-btn>
    </page-title-simple>

    <v-row>
      <v-col>
        <v-card class="pa-3">

          <!-- Simple Search -->
          <simple-search :name="pageName" />
          
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
            @update:page="updatePage(pageName)"
            @update:items-per-page="updateItemsPerPage(pageName)"
            hide-default-footer
            :no-data-text="$t('message.info.noResults')"
          >
            <template v-slot:body>
              <draggable tag="tbody" :disabled="search.length" v-model="items" @start="drag=true" @end="drag=false" handle=".handle">
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>
                    <nuxt-link v-if="$can('currency', 'show')" :to="{path: $route.path + '/edit/' + item.id}">{{ item.name }}</nuxt-link> 
                    <span v-else>{{ item.name }}</span>
                  </td>
                  <td>{{ item.code }} </td>
                  <td class="text-right"><v-btn :disabled="!!search.length" v-if="$can('currency', 'update')" icon small class="handle my-1"><v-icon size="24">mdi-drag-horizontal-variant</v-icon></v-btn></td>
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
          <client-only>
            <v-pagination v-model="page" :total-visible="7" :length="pageCount"></v-pagination>
          </client-only>
          <v-spacer></v-spacer>
          <client-only>
            <v-select
              v-model="itemsPerPage"
              :items="[5, 10, 15]"
              :label="$t('input.itemsPerPage')"
            ></v-select>
          </client-only>
        </div>

      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import SimpleSearch from '@/components/UI/Table/SimpleSearch'
import draggable from 'vuedraggable'

//methods mixin
import tableMethods from '@/components/UI/Table/Methods/tableMethods'

export default {
  mixins: [tableMethods],
  components: {
    PageTitleSimple,
    SimpleSearch,
    draggable,
  },
  data() {
    return {
      pageCount: 0,
      urlQuery: '',
      pageName: 'currency'
    }
  },
  watch: {
    options: {
      handler() {
        this.tableWatcher(this.pageName)
      }
    },
    $route: function() {
      this.urlQuery = decodeURIComponent(this.$route.fullPath).split('?')[1]
      if (this.urlQuery) {
        this.$store.dispatch('currency/getResults', '?' + this.urlQuery)
      } else {
        this.$store.dispatch('currency/getResults', '')
        this.options.sortBy.length = 0
      }
    }
  },
  async fetch({ store, route, query }) {
    this.urlQuery = decodeURIComponent(route.fullPath).split('?')[1]
    if (this.urlQuery) {
      if (this.urlQuery.includes('search')) {
        const queryArr = query.search.replace(/[\[\]']+/g, '').split('=')
        store.commit('currency/SET_SEARCH', queryArr[1])
      }
      await store.dispatch('currency/getResults', '?' + this.urlQuery)
    } else {
      await store.dispatch('currency/getResults', '')
    }
  },
  computed: {
    ...mapState({
      headers: state => state.currency.headers,
      totalItems: state => state.currency.totalItems,
      loading: state => state.currency.loading
    }),
    search: {
      get() {
        return this.$store.getters['currency/getSearch']
      },
      set(value) {
        this.$store.commit('currency/SET_SEARCH', value)
      }
    },
    options: {
      get() {
        return this.$store.getters['currency/getOptions']
      },
      set(value) {
        this.$store.commit('currency/SET_OPTIONS', value)
      }
    },
    page: {
      get() {
        return this.$store.getters['currency/getPage']
      },
      set(value) {
        this.$store.commit('currency/SET_PAGE', value)
      }
    },
    itemsPerPage: {
      get() {
        return parseInt(this.$store.getters['currency/getItemsPerPage'])
      },
      set(value) {
        this.$store.commit('currency/SET_ITEMS_PER_PAGE', value)
      }
    },
    items: {
      get() {
        return this.$store.getters['currency/getItemsSimple']
      },
      set(value) {

        const old = [...this.items] //store old items order
        this.$store.commit('currency/SET_ITEMS_SIMPLE', value)

        const obj = {
          order: value.map(el => el.id),
          page: this.page,
          perPage: this.itemsPerPage
        }
        
        this.$store.commit('currency/SET_LOADING', true)
        this.$store
          .dispatch('currency/orderCurrency', obj)
          .then(res => {
            if(res.code === 200) {
              this.$store.commit('currency/SET_ITEMS_SIMPLE', value)
            } else {
              // set old items order
              this.$store.commit('currency/SET_ITEMS_SIMPLE', old)
            }
            this.$store.commit('currency/SET_LOADING', false)
          })
          .catch(e => {
            // set old items order
            this.$store.commit('currency/SET_LOADING', false)
            this.$store.commit('currency/SET_ITEMS_SIMPLE', old)
          })      
        
      }
    }
  }
}
</script>