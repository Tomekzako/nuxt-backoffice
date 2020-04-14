<template>
  <div class="zg_wrapper">
    
    <!-- Header -->
    <page-title-simple :title="$t('menu.payments.methods')">
      <v-btn v-if="$can('paymentWay', 'create')" :to="this.$route.path + '/add'" class="primary px-6 ml-2 font-weight-bold body-1">{{ $t('buttons.add') }}</v-btn>
    </page-title-simple>

    <v-row>
      <v-col>
        <v-card class="pa-3">

          <simple-search :name="pageName" />

          <v-data-table
            class="zg_table"
            :headers="headers"
            :items="items"
            :search="search"
            :loading="loading"
            :server-items-length="totalItems"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            :no-data-text="$t('message.info.noResults')"
            :must-sort="true"
            :sort-by="sortBy"
            :sort-desc="sortDesc"
            @update:options="updateTable"
            hide-default-footer
          >

          <template v-slot:item.name="{ item }">
            <nuxt-link v-if="$can('paymentWay', 'show')" :to="{ path: $route.path + '/edit/' + item.id }">{{ item.name }}</nuxt-link>
            <span v-else>{{ item.name }}</span>
          </template>
          
          <template v-slot:item.is_active="{ item }">
            <v-icon color="primary" v-if="item.is_active">mdi-circle-medium</v-icon>
            <v-icon color="secondary" v-else>mdi-circle-medium</v-icon>
          </template>

          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="zg_pagination">
          <v-pagination v-model="page" :total-visible="7" :length="Math.ceil(totalPages/itemsPerPage)"></v-pagination>
          <v-spacer></v-spacer>
          <v-select
            v-model="itemsPerPage"
            :items="[5, 10, 15]"
            :label="$t('input.itemsPerPage')"
          />
        </div>
      </v-col>
    </v-row>
 

  </div>
</template>

<script>
import { mapState } from 'vuex'
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import SimpleSearch from '@/components/UI/Table/SimpleSearch'
export default {
  watchQuery: true,
  components: {
    PageTitleSimple,
    SimpleSearch
  },
  fetch({ store, query }) {
    return store
      .dispatch('paymentMethod/getResults', query)
      .then(res => {
        console.log(res)
      })
  },
  data() {
    const query = {
      page: parseInt(this.$route.query.page) || 1,
      limit: parseInt(this.$route.query.limit) || 10,
      orderBy: this.$route.query.orderBy || 'id:desc',
      search: this.$route.query.name || ''
    }
    return {
      query,
      pageName: 'paymentMethod',
      init: true
    }
  },
  computed: {
    ...mapState({
      headers: state => state.paymentMethod.headers,
      totalItems: state => state.paymentMethod.totalItems,
      loading: state => state.paymentMethod.loading,
      items: state => state.paymentMethod.items,
      totalPages: state => state.paymentMethod.totalPages,
    }),
    search: {
      get() {
        return this.$store.getters['paymentMethod/getSearch']
      },
      set(value) {
        this.$store.commit('paymentMethod/SET_SEARCH', value)
      }
    },
    page: {
      get() {
        return this.$store.getters['paymentMethod/getPage']
      },
      set(value) {
        this.$store.commit('paymentMethod/SET_PAGE', value)
      }
    },
    itemsPerPage: {
      get() {
        return parseInt(this.$store.getters['paymentMethod/getItemsPerPage'])
      },
      set(value) {
        this.$store.commit('paymentMethod/SET_ITEMS_PER_PAGE', value)
      }
    },
    sortBy() {
      return [this.query.orderBy.split(':')[0]]
    },
    sortDesc() {
      return [this.query.orderBy.split(':')[1] === 'desc' ? false : true]
    }
  },
  methods: {
    _makeQuery(_query) {
      console.log(_query)
      this.$router.push({
        path: this.$route.path,
        //query: this.query
        query: _query
      })
    },
    updateTable(options){
      console.log(options);
      
      if(!this.init) {
        const _desc = options.sortDesc[0] ? 'asc' : 'desc'        
        /* this.query.orderBy = options.sortBy[0] + ':' + _desc
        this.query.page = options.page
        this.query.limit = options.itemsPerPage
        this.query.search = 'name=' + this.search
        this._makeQuery() */
        
        const _query = {
          orderBy: options.sortBy[0] + ':' + _desc,
          page: options.page,
          limit: options.itemsPerPage,
          search: 'name=' + this.search
        }

        this.$nextTick(() => {
          this._makeQuery(_query)
        })

      }
      this.init = false  
    }
  }
}
</script>