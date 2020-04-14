<template>
  <div class="zg_wrapper">
    
    <!-- Header -->
    <page-title-simple :title="$t('company.editTitle')"/>

    <!-- Content -->
    <v-row>
      <v-col>
        <v-card class="pa-3">
  
          <v-row class="px-1">
            <v-col cols="12" class="pb-0">

              <v-tabs show-arrows class="zg_tabs">
                <v-tab>{{ $t('company.tabs.base') }}</v-tab>
                <v-tab>{{ $t('company.tabs.logo') }}</v-tab>
                <v-tab>{{ $t('company.tabs.smtp') }}</v-tab>

                <!-- base form -->
                <v-tab-item class="mt-5">
                  <base-info 
                    :company="company"
                    :languages="languages"
                    :currencies="currencies"
                  />
                </v-tab-item>

                <!-- logotyp form -->
                <v-tab-item class="mt-5">
                  <logotype :logo="company.logo" />
                </v-tab-item>
                
                <!-- smtp form -->
                <v-tab-item class="mt-5">
                  <smtp :smtp="company.smtp" />
                </v-tab-item>
              </v-tabs>
              
            </v-col>
          </v-row>
         
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import PageTitleSimple from '@/components/UI/PageTitleSimple'
import BaseInfo from '@/components/Pages/Company/Form/BaseInfo'
import Logotype from '@/components/Pages/Company/Form/Logotype'
import Smtp from '@/components/Pages/Company/Form/Smtp'

export default {
  components: {
    PageTitleSimple,
    BaseInfo,
    Logotype,
    Smtp
  },
  async asyncData (context) {

    const company_id = 1
    let [company, currencies, languages] = await Promise.all([
      context.store.dispatch('company/getDetails', company_id),
      context.store.dispatch('currency/getResults', ''),
      context.store.dispatch('language/getResults', '')
    ])
    context.store.commit('wysiwyg/SET_VALUE', company.policy)

    return { 
      company: company,
      currencies: currencies.data,
      languages: languages.data
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>