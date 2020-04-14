<template>
  <div class="zg_wrapper">
    
    <!-- Header -->
    <page-title-simple :title="$t('menu.payments.methods')">
      <v-btn v-if="$can('language', 'create')" :to="this.$route.path + '/add'" class="primary px-6 ml-2 font-weight-bold body-1">{{ $t('buttons.add') }}</v-btn>
    </page-title-simple>

    <v-row>
      <v-col>
        <v-card class="pa-3">

          <!-- <simple-search :name="pageName" /> -->

          <v-data-table
            class="zg_table"
            :headers="headers"
            :items="items"
            :search="search"
            :loading="loading"
            :server-items-length="totalItems"
            :page="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            :options="options"
            @update:page="updatePage"
            @update:items-per-page="updateItemsPerPage"
            @update:sort-by="updateGroupBy"
            :no-data-text="$t('message.info.noResults')"
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    {{ this.query }}
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
    return store.dispatch('paymentMethod/getResults', query).then(res => console.log(res))
  },
  data() {
    const query = {
      page: parseInt(this.$route.query.page) || 1,
      limit: parseInt(this.$route.query.limit) || 10,
      orderBy: this.$route.query.orderBy || 'id:asc'
      /* orderBy: this.$route.query.orderBy || 'id',
      order: this.$route.query.order || 'desc',
      search: this.$route.query.query || '' */
    }
    return {
      query,
      options: {},
      pageName: 'paymentMethod'
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
    }
  },
  methods: {
    _makeQuery() {
      this.$router.push({
        path: this.$route.path,
        query: this.query
      })
    },
    updatePage() {
      this.query.page = this.page
      this._makeQuery()
    },
    updateItemsPerPage() {
      console.log('sss');
      
      this.query.limit = this.itemsPerPage
      this.query.page = 1
      this._makeQuery()
    },
    updateGroupBy() {
      console.log(this.options);
      
    }
  }
}
</script>