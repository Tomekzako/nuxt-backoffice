<template>
  <client-only>
    <v-navigation-drawer
      :value="toggleDrawer"
      :permanent="$vuetify.breakpoint.mdAndUp"
      app
      :right="$vuetify.breakpoint.smAndDown"
      :clipped="$vuetify.breakpoint.mdAndUp"
      fixed
      style="box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.15)"
      class="zg__navbar"
      :width="drawerWidth"
      hide-overlay
    >
      <v-list class="py-0" flat>
        <v-list-group
          v-for="item in itemCheck(items)"
          :key="item.title"
          v-model="item.active"
          :prepend-icon="item.icon"
          :append-icon="item.items ? 'mdi-chevron-down' : null"
          no-action
        >
          <template v-slot:activator>
            <v-list-item v-if="!item.items" router :to="item.route" class="py-2 px-0" :ripple="false">
              <v-list-item-content>
                <v-list-item-title class="text-uppercase body-1 font-weight-bold">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item-content v-else>
              <v-list-item-title class="text-uppercase body-1 font-weight-bold">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="subItem in itemCheck(item.items)" :key="subItem.title" router :to="subItem.route">
            <v-list-item-icon class="mr-0">
              <img src="@/assets/img/arrow_bottom-left.svg" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="text-uppercase body-1 font-weight-bold">{{ subItem.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <template v-slot:append>
        <p class="zg_app-version">version: {{ appVersion }}</p>
      </template>
    </v-navigation-drawer>
  </client-only>
</template>

<script>
export default {
  props: ['drawer'],
  methods: {
    itemCheck(el) {
      if (el) {
        return el.filter(item => item.permissions)
      } else {
        return null
      }
    }
  },
  data() {
    return {
      appVersion: process.env.appVersion,
      items: [
        {
          icon: 'mdi-home',
          title: this.$t('menu.start'),
          items: null,
          permissions: true,
          route: '/'
        },
        {
          icon: 'mdi-cogs',
          title: this.$t('menu.settings.name'),
          permissions: this.$can('user', 'list') || this.$can('group', 'list') || this.$can('currency', 'list') || this.$can('language', 'list'),
          items: [
            // { title: this.$t('menu.settings.profile') },
            // { title: this.$t('menu.settings.userFields') },
            { title: this.$t('menu.settings.paymentGroups'), route: '/payment-groups', permissions: this.$can('paymentGroups', 'list') },
            { title: this.$t('menu.settings.paymentMethods'), route: '/payment-methods', permissions: this.$can('paymentWay', 'list') },
            // { title: this.$t('menu.settings.communicationSettings') },
            // { title: this.$t('menu.settings.exports') },
            // { title: this.$t('menu.settings.integrations') },
            { title: this.$t('menu.settings.logs'), route: '/logs', permissions: true },
            { title: this.$t('menu.settings.admins'), route: '/admins', permissions: this.$can('user', 'list') },
            { title: this.$t('menu.settings.adminsGroups'), route: '/admins-groups', permissions: this.$can('group', 'list') },
            { title: this.$t('menu.settings.currencies'), route: '/currencies', permissions: this.$can('currency', 'list') },
            { title: this.$t('menu.settings.languages'), route: '/languages', permissions: this.$can('language', 'list') },
            { title: this.$t('menu.settings.companyProfile'), route: '/company', permissions: this.$can('company', 'show') }
          ]
        },
        {
          icon: 'mdi-account-multiple',
          title: this.$t('menu.users'),
          items: null,
          permissions: this.$can('client', 'list'),
          route: '/clients'
        },
        /* {
          icon: 'mdi-cash-register',
          title: this.$t('menu.payments.name'),
          permissions: true, //#TODO permissions
          items: [
            { title: this.$t('menu.payments.methods'), route: '/payment-methods', permissions: true } //#TODO permissions
          ]
        }, */
        // {
        //   icon: 'mdi-image-filter-hdr',
        //   title: this.$t('menu.trips'),
        //   items: null,
        //   route: '/trips'
        // },
        // {
        //   icon: 'mdi-cart',
        //   title: this.$t('menu.reservations'),
        //   items: null,
        //   route: '/team'
        // },
        // {
        //   icon: 'mdi-cash-register',
        //   title: this.$t('menu.payments'),
        //   items: null,
        //   route: '/profile'
        // },
        // {
        //   icon: 'mdi-account-multiple',
        //   title: this.$t('menu.users'),
        //   items: null,
        //   route: '/profile'
        // },
        // {
        //   icon: 'mdi-tag',
        //   title: this.$t('menu.discounts'),
        //   items: null,
        //   route: '/profile'
        // },
        // {
        //   icon: 'mdi-forum',
        //   title: this.$t('menu.communication'),
        //   items: null,
        //   route: '/profile'
        // },
        // {
        //   icon: 'mdi-file-document',
        //   title: this.$t('menu.documentPatterns'),
        //   items: null,
        //   route: '/profile'
        // },
        // {
        //   icon: 'mdi-file-check',
        //   title: this.$t('menu.generetedDocuments'),
        //   items: null,
        //   route: '/profile'
        // }
      ]
    }
  },
  computed: {
    toggleDrawer() {
      return this.drawer
    },
    drawerWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '100%'
        case 'sm':
          return '50%'
        case 'md':
          return '256px'
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_variables';
@import '@/assets/styles/_mixins';

.zg__navbar {
  @include mQuery(sm) {
    margin-top: 94px;
    padding-bottom: 164px;
  }
  .v-list {
    .v-list-group {
      // border-bottom: 1px solid #9c9c9c;
      .v-list-group__header {
        padding-right: 0;
        border-bottom: 1px solid #e5e5e5;
      }
      .v-list-group__items {
        .v-list-item {
          padding-left: 2rem;

          border-bottom: 1px solid #e5e5e5;
        }
        .v-list-item--active {
          border-right: 3px solid $primary;
        }
        .v-list-item__icon {
          align-self: center;
        }
      }
      .v-list-item__content {
        display: flex;
      }
    }
    .v-list-item {
      .v-list-item__icon {
        margin: 1.6rem 2rem 1.5rem 0;
      }
      .v-list-group__header__append-icon {
        margin-right: 1rem;
      }
    }
    .v-list-item__title,
    .v-list-item__subtitle {
      text-overflow: unset;
      white-space: unset;
    }
    .v-list-group__header.v-list-item--active {
      border-right: 3px solid $primary;
    }
  }
  .zg_app-version {
    text-align: center;
    font-size: 0.9rem;
    padding: 5px 0;
  }
}
</style>
