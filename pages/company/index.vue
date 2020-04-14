<template>
  <div class="zg_company">
    
    <!-- Header -->
    <page-title-simple :title="$t('menu.settings.companyProfile')">
      <v-btn v-if="$can('company', 'edit')" :to="$route.path + '/edit'" class="primary px-6 ml-2 font-weight-bold body-1">{{ $t('company.button.edit') }}</v-btn>
    </page-title-simple>

    <!-- Content -->
    <v-row>
      <v-col>
        <v-card class="pa-3">
          <v-card-title>
            <v-row class="d-flex align-center">
              <v-col cols="12" sm="6">
                <h3 class="black--text subtitle-1">{{ company.name }}</h3>
                <span class="zg_company__label">Utworzono: {{ company.created_at }}</span>
              </v-col>
              <v-col cols="12" sm="6">
                <v-img
                  :src="company.logo"
                  :lazy-src="company.logo"
                  aspect-ratio="1"
                  class="grey lighten-2 zg_company__logo"
                  max-width="250"
                  max-height="140"
                  ref="img"
                  contain
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-col>
            </v-row>
            
          </v-card-title>
          <v-container>
            <v-subheader>{{ $t('company.tabs.base') }}</v-subheader>
            <v-divider />
            <v-row class="mx-1">
              <v-col cols="12" sm="6">
                <span class="zg_company__label">{{ $t('company.addressSimple') }}:</span>
                <p class="black--text zg_company__item">
                  {{ company.address }}<br>
                  {{ company.zipcode }}
                  {{ company.city }}
                </p>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="zg_company__label">{{ $t('company.form.nip') }}:</span>
                <p class="black--text zg_company__item">{{ company.nip }}</p>
              </v-col>
            </v-row>
            <v-row class="mx-1">
              <v-col cols="12" sm="6">
                <span class="zg_company__label">{{ $t('company.form.language') }}:</span>
                <p class="black--text zg_company__item">{{ company.lang.name }} ({{company.lang.code}})</p>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="zg_company__label">{{ $t('company.form.currency') }}:</span>
                <p class="black--text zg_company__item">{{ company.currency.name }} ({{company.currency.code}})</p>
              </v-col>
            </v-row>
            <v-row class="mx-1">
              <v-col cols="12">
                <span class="zg_company__label">{{ $t('company.form.policy') }}:</span>
                <div class="zg_company__policy markdown-body">
                  <div v-html="$md.render(company.policy)"></div>
                </div>
              </v-col>
            </v-row>
            <v-subheader>{{ $t('company.tabs.smtp') }}</v-subheader>
            <v-divider />
            <v-row class="mx-1">
              <v-col cols="12" sm="6">
                <span class="zg_company__label">{{ $t('company.form.host') }}:</span>
                <p class="black--text zg_company__item">{{ company.smtp.host }}</p>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="zg_company__label">{{ $t('company.form.port') }}:</span>
                <p class="black--text zg_company__item">{{ company.smtp.port }}</p>
              </v-col>
            </v-row>
            <v-row class="mx-1">
              <v-col cols="12" sm="6">
                <span class="zg_company__label">{{ $t('company.form.username') }}:</span>
                <p class="black--text zg_company__item">{{ company.smtp.username }}</p>
              </v-col>
            </v-row>
            <v-row class="mx-1">
              <v-col cols="12" sm="6">
                <span class="zg_company__label">{{ $t('company.form.senderEmail') }}:</span>
                <p class="black--text zg_company__item">{{ company.smtp.sender_email }}</p>
              </v-col>
              <v-col cols="12" sm="6">
                <span class="zg_company__label">{{ $t('company.form.senderName') }}:</span>
                <p class="black--text zg_company__item">{{ company.smtp.sender_name }}</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PageTitleSimple from '@/components/UI/PageTitleSimple'
export default {
  components: {
    PageTitleSimple
  },
  data() {
    return {
    }
  },
  watch: {
  },
  asyncData (context) {

    const company_id = 1

    return context.store
      .dispatch('company/getDetails', company_id)
      .then(data => {                
        return { company: data }
      })
  },
  computed: {
    ...mapState({
    }),
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/_variables';
@import '@/assets/styles/_mixins';

.zg_company {
  max-width: 120rem;
  margin: 0 auto;
  &__label {
    color: rgba($color: #000000, $alpha: 0.6);
    font-size: 1.2rem;
    display: block;
    margin-bottom: 3px;
  }
  &__item {
    font-size: 1.6rem;
  }
  &__policy {
    background: #fafafa;
    max-height: 300px;
    overflow: auto;
    padding: 15px;
    margin-top: 5px;
  }
  &__logo {
    .v-image__image--contain {
      background-size: 90%;
    }
  }
  .v-subheader {
    text-transform: uppercase;
    font-weight: 500;
    color: $primary;
    letter-spacing: 1px;
  }
}

</style>
