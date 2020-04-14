<template>
  <div class="zg__search">
    <v-row>
      <v-col>
        <div class="zg__search-heading">
          <p
            class="zg__search-heading-text body-1 text-uppercase font-weight-bold mr-5"
            :class="{ 'zg__search-active': tableView }"
            @click="searchData"
          >
            {{ $t('searchComponent.search') }}
          </p>
          <p class="zg__search-heading-text body-1 text-uppercase font-weight-bold" :class="{ 'zg__search-active': !tableView }" @click="getFilters">
            {{ $t('searchComponent.savedFilters') }}
          </p>
        </div>
      </v-col>
    </v-row>
    <div v-if="tableView" class="pt-3">
      <v-row>
        <v-col class="d-flex flex-column flex-sm-row">
          <div class="zg__search-form">
            <div class="d-flex flex-wrap mb-2 flex-1" v-for="(item, i) in searchedItems" :key="i" style="width: 100%">
              <v-text-field
                :label="$t('input.search')"
                single-line
                dense
                outlined
                flat
                hide-details
                class="zg__search-form-input body-1 pr-xs-3 mb-3 mb-sm-0"
                :value="item.value"
                @input="event => searchedInputVal(i, event)"
              ></v-text-field>
              <v-select
                :items="filteredItems"
                single-line
                dense
                outlined
                :value="item.name"
                @input="searchedSelectVal($event, i)"
                :placeholder="$t('searchComponent.search')"
                hide-details
                class="body-1 zg__search-form-select px-3 mb-3 mb-sm-0"
              ></v-select>
              <v-btn small color="accent" @click="addField" class="zg__search-form-plus mr-3">
                <v-icon width="20">mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>
          <div v-if="datePicker" class="zg__search-date">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="dates"
              transition="scale-transition"
              offset-x
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  hide-details
                  single-line
                  dense
                  outlined
                  v-model="dateRangeText"
                  :label="$t('searchComponent.dateRange')"
                  append-icon="mdi-calendar-month-outline"
                  readonly
                  v-on="on"
                  class="body-1 ml-md-2"
                ></v-text-field>
              </template>
              <v-date-picker v-model="dates" no-title scrollable range>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(dates)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </div>
          <v-spacer></v-spacer>
          <div class="zg__search-btn">
            <v-btn
              small
              class="zg__search-btnSearch primary px-12 ml-sm-2 mt-2 mb-1 mt-sm-0 mb-sm-0 font-weight-bold body-1"
              :loading="loadingBtn"
              @click="filterResults"
              :disabled="disableSearchBtn"
              >{{ $t('buttons.search') }}</v-btn
            >
          </div>
        </v-col>
      </v-row>
      <v-row class="justify-center justify-sm-start">
        <v-col cols="auto" class="d-flex align-center">
          <v-btn text class="text-capitalize font-weight-regular px-1" :disabled="saveFilterDisabled" @click="filterField = true">
            <img src="~/assets/img/save.svg" :alt="$t('searchComponent.saveFilter')" class="mr-1" />
            {{ $t('searchComponent.saveFilter') }}
          </v-btn>
        </v-col>
        <v-col cols="auto" class="d-flex align-center zg__search-reset">
          <v-btn text class="text-capitalize font-weight-regular px-1" @click="reset" :disabled="resetDisabled">
            <img src="~/assets/img/remove.svg" :alt="$t('searchComponent.resetFilters')" class="mr-1" />
            {{ $t('searchComponent.resetFilters') }}
          </v-btn>
        </v-col>
        <v-spacer class="d-none d-md-flex"></v-spacer>
        <v-col v-if="exportFile" cols="auto" class="d-flex align-center zg__search-export">
          <p class="body-2 mr-4">{{ $t('searchComponent.export') }}</p>
          <v-img :src="require('@/assets/img/pdf.svg')" @click="exportList('pdf')" class="mr-2 zg__search-export-img"></v-img>
          <v-img :src="require('@/assets/img/xlsx.svg')" @click="exportList('xlsx')" class="mr-2 zg__search-export-img"></v-img>
          <v-img :src="require('@/assets/img/csv.svg')" @click="exportList('csv')" class="mr-2 zg__search-export-img"></v-img>
        </v-col>
      </v-row>
      <v-form ref="form">
        <v-row>
          <v-col cols="12" md="6" class="pt-0 mb-5 d-flex" v-if="filterField">
            <v-text-field
              dense
              :rules="nameRules"
              :label="$t('searchComponent.filterName')"
              single-line
              outlined
              flat
              class="body-1"
              v-model="saveFilterName"
            ></v-text-field>
            <v-btn
              small
              class="primary ml-2 px-6 font-weight-bold body-1"
              @click="saveFilter"
              :loading="saveFilterLoader"
              :disabled="saveFilterName.length < 3"
            >
              {{ $t('searchComponent.save') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <v-row v-else>
      <v-col class="py-0">
        <v-card :loading="loadingFilters" class="my-4 mx-6">
          <v-list v-if="savedFilters.length > 0">
            <v-list-item-group>
              <v-list-item v-for="(item, i) in savedFilters" :key="i">
                <v-list-item-content class="py-0" @click="setFilteredURL(item.query)">
                  <v-list-item-title class="body-1">{{ item.name }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon class="my-0 align-self-center" @click="deleteFilter(item.id)">
                  <img src="~/assets/img/remove.svg" :alt="$t('searchComponent.removeFilter')" class="mr-1" />
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <h3 v-else class="subtitle-1 text-center my-4 py-5">Brak zapisanych filtrów</h3>
        </v-card>
      </v-col>
    </v-row>
    <Confirm ref="confirm" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Confirm from '@/components/UI/Confirm.vue'

export default {
  components: {
    Confirm
  },
  data() {
    return {
      menu: false,
      filterField: false,
      saveFilterLoader: false,
      saveFilterName: '',
      urlQuery: '',
      nameRules: [v => !!v || this.$t('validation.default.required')]
    }
  },
  props: {
    page: {
      type: String,
      required: true
    },
    exportFile: {
      type: Boolean,
      required: true,
      default: false
    },
    datePicker: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    ...mapState({
      tableView(state, getters) {
        return getters[`${this.page}/tableView`]
      },
      searchedItems(state, getters) {
        return getters[`${this.page}/searchedItems`]
      },
      filteredItems(state, getters) {
        return getters[`${this.page}/filteredHeaders`]
      },
      loadingBtn(state, getters) {
        return getters[`${this.page}/loadingBtn`]
      },
      loadingFilters(state, getters) {
        return getters[`${this.page}/loadingFilters`]
      },
      savedFilters(state, getters) {
        return getters[`${this.page}/savedFilters`]
      },
      headers(state, getters) {
        return getters[`${this.page}/headers`]
      }
    }),
    dates: {
      get() {
        return this.$store.getters[`${this.page}/getDates`]
      },
      set(value) {
        this.$store.commit(`${this.page}/SET_DATES`, value)
      }
    },
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
    saveFilterDisabled() {
      return Object.keys(this.$route.query).length > 0 ? false : true
    },
    resetDisabled() {
      return Object.keys(this.$route.query).length > 0 || this.searchedItems.length > 1 ? false : true
    },
    disableSearchBtn() {
      if (this.datePicker) {
        return this.searchedItems[0].value.length < 2 && this.dateRangeText.length === 0
      } else {
        return this.searchedItems[0].value.length < 2
      }
    }
  },
  methods: {
    searchData() {
      this.$store.commit(`${this.page}/SET_TABLE_VIEW`, true)
      if (Object.keys(this.$route.query).length === 0) {
        this.$store.commit(`${this.page}/RESET_SEARCH`)
        return
      } else {
        this.$store.commit(`${this.page}/SET_TABLE_VIEW_LOADER`, true)
        this.$store.commit(`${this.page}/RESET_SEARCH`)
        this.$router.replace({ query: null })
      }
    },
    getFilters() {
      if (Object.keys(this.$route.query).length > 0) {
        this.$router.replace({ query: null })
      }
      this.$store.commit(`${this.page}/SET_TABLE_VIEW`, false)
      this.$store.commit(`${this.page}/SET_FILTER_LOADER`, true)
      this.$store.dispatch(`${this.page}/getSaved`)
    },
    searchedInputVal(i) {
      this.$store.commit(`${this.page}/SET_SEARCH_INPUT`, { value: event.target.value, index: i })
    },
    searchedSelectVal(event, i) {
      this.$store.commit(`${this.page}/SET_SEARCH_SELECT`, { name: event, index: i })
    },
    saveFilter() {
      this.urlQuery = decodeURIComponent(this.$route.fullPath).split('?')[1]
      const params = {
        queries: this.urlQuery,
        name: this.saveFilterName
      }
      this.saveFilterLoader = true
      this.$store
        .dispatch(`${this.page}/saveFilters`, params)
        .then(res => {
          this.saveFilterLoader = false
          this.saveFilterName = ''
          this.filterField = false
          const snackbar = {
            text: this.$t('searchComponent.filterSaveInfo'),
            color: 'primary'
          }
          this.$store.commit('snackbar/showSnackbar', snackbar)
        })
        .catch(e => {
          if (e.response.status === 409) {
            const name = this.saveFilterName
            this.nameRules.push(v => v !== name || this.$t('languages.languageNameConflict'))
            this.$refs.form.validate()
          }
          this.saveFilterLoader = false
        })
    },
    addField() {
      if (this.searchedItems.length < this.filteredItems.length - 1) {
        this.$store.commit(`${this.page}/ADD_SEARCH_FIELD`)
      }
    },
    filterResults() {
      if (this.datePicker) {
        const dateFrom = this.dates[0]
        const dateTo = this.dates[1]
        var URL = this.searchedItems.map(el => el.name + '=' + el.value).join(',')
        if (this.$route.query.search === URL && this.$route.query.dateFrom === dateFrom) {
          return
        } else if (dateFrom > dateTo) {
          const snackbar = {
            text: this.$t('searchComponent.invalidDate'),
            color: 'error'
          }
          this.$store.commit('snackbar/showSnackbar', snackbar)
          return
        } else {
          this.$store.commit(`${this.page}/SET_LOADING_BTN`, true)
          this.$router.push({ query: { search: URL, dateFrom: dateFrom, dateTo: dateTo } })
        }
      } else {
        var URL = this.searchedItems.map(el => el.name + '=' + el.value).join(',')
        if (this.$route.query.search === URL) {
          return
        } else {
          this.$store.commit(`${this.page}/SET_LOADING_BTN`, true)
          this.$router.push({ query: { search: URL } })
        }
      }
    },
    reset() {
      if (Object.keys(this.$route.query).length === 0) {
        this.$store.commit(`${this.page}/RESET_SEARCH`)
        return
      }
      if (this.datePicker) {
        this.dates = []
      }
      this.$store.commit(`${this.page}/SET_TABLE_VIEW_LOADER`, true)
      this.filterField = false
      this.$store.commit(`${this.page}/RESET_SEARCH`)
      this.$router.replace({ query: null })
    },
    exportList(type) {
      this.urlQuery = decodeURIComponent(this.$route.fullPath).split('?')[1]
      const params = {
        from: this.page,
        type: type,
        queries: this.urlQuery,
        text: this.$t('message.info.emailRedirection')
      }
      const overlay = {
        text: this.$t('message.info.pleaseWait'),
        color: 'secondary',
        type: 'circular'
      }
      this.$store.commit('overlay/SHOW_OVERLAY', overlay)
      this.$store.dispatch(`${this.page}/exportList`, params)
    },
    setFilteredURL(params) {
      this.$store.commit(`${this.page}/SET_TABLE_VIEW`, true)
      this.$store.commit(`${this.page}/SET_TABLE_VIEW_LOADER`, true)
      this.$router.push({ query: { ...params } })
    },
    deleteFilter(id) {
      this.$refs.confirm.open(this.$t('searchComponent.remove'), this.$t('searchComponent.removeFilterConfirm'), { color: 'red' }).then(confirm => {
        if (confirm === false) {
          return false
        } else {
          this.$store.commit(`${this.page}/SET_FILTER_LOADER`, true)
          this.$store
            .dispatch(`${this.page}/deleteFilter`, id)
            .then(res => {
              if (res === 'Success') {
                this.$store.dispatch(`${this.page}/getSaved`)
              }
            })
            .then(res => {
              const snackbar = {
                text: this.$t('searchComponent.filterDeleteInfo'),
                color: 'primary'
              }
              this.$store.commit('snackbar/showSnackbar', snackbar)
            })
            .catch(e => {
              this.$store.commit(`${this.page}/SET_FILTER_LOADER`, false)
            })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_variables';
@import '@/assets/styles/_mixins';
.zg__search {
  &-heading {
    display: flex;
    @include mQuery(xsm) {
      justify-content: center;
    }
    &-text {
      color: #c9c9c9;
      cursor: pointer;
    }
  }
  &-active {
    color: $accent;
    text-decoration: underline;
  }
  &-form {
    display: flex;
    flex-wrap: wrap;
    flex: 0 0 55%;
    @include mQuery(xs) {
      flex: 1;
    }
    @include mQuery(xsm) {
      flex-direction: column;
    }
    &-input {
      flex: 0 0 65%;
      @include mQuery(md) {
        flex: 0 0 60%;
      }
      @include mQuery(xs) {
        flex: 0 0 60%;
      }
      @include mQuery(xsm) {
        flex: 0 0 100%;
      }
    }
    &-select {
      flex: 0 0 22%;
      @include mQuery(xs) {
        flex: 1;
      }
      @include mQuery(xsm) {
        flex: 0 0 50%;
      }
    }
    &-plus.v-btn.v-size--small {
      min-width: 4.5rem;
      width: 4.5rem;
      @include mQuery(xsm) {
        flex: 1;
      }
    }
  }
  &-date {
    flex: 0 0 25%;
    @include mQuery(md) {
      flex: 0 0 20%;
    }
    .v-date-picker-table {
      .v-btn {
        border-radius: 5px;
      }
    }
  }
  &-export {
    p {
      letter-spacing: 0.8rem;
    }
    &-img {
      cursor: pointer;
      border-radius: 0.3rem;
      transition: all 0.2s;
      &:hover {
        background: #e9e9e9;
      }
    }
  }
}

.v-card {
  .v-card__title {
    .v-btn {
      height: 3.6rem;
      @include mQuery(xs) {
        min-width: 100%;
      }
    }
  }
  .zg__search-btnSearch {
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
.zg__search-table {
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
.zg__search-footer {
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
</style>
