export default {
	methods: {
		addURLParams(pageName, params, oldParams) {
		  if (oldParams) {
		    let pageParameter = 'page' in this.$route.query
		    if (Object.keys(params) == 'name' && pageParameter) {
		      let query = Object.assign({}, this.$route.query)
		      delete query.page
		      this.$router.push({
		        query: {
		          ...query,
		          ...params
		        }
		      })
		    } else {
		      this.$router.push({
		        query: {
		          ...this.$route.query,
		          ...params
		        }
		      })
		    }
		  } else {
		    const temp = parseInt(this.$route.query.page)

		    if (Object.is(temp, params.page)) {
		      this.$store.commit(pageName + '/SET_LOADING_BTN2', false)
		      return
		    } else {
		      this.$router.push({
		        query: {
		          ...params
		        }
		      })
		    }
			}
		},
		updatePage(pageName) {
			const _page = {
				page: this.options.page
			}

			this.$store.commit(pageName + '/SET_LOADING', true)
			this.addURLParams(pageName, _page, true)
		},
		updateItemsPerPage(pageName) {
			const _itemsPerPage = {
				limit: this.options.itemsPerPage
			}

			this.$store.commit(pageName + '/SET_LOADING', true)
			this.addURLParams(pageName, _itemsPerPage, true)
    },
    tableWatcher(pageName) {
      const {
        sortBy,
        sortDesc
      } = this.options
      if (sortBy.length === 1 && sortDesc.length === 1) {
        this.$store.commit('currency/SET_LOADING', true)
        if (sortDesc[0]) {
          const orderBy = {
            orderBy: `${sortBy[0]}:desc`
          }
          this.addURLParams(pageName, orderBy, true)
        } else {
          const orderBy = {
            orderBy: `${sortBy[0]}:asc`
          }
          this.addURLParams(pageName, orderBy, true)
        }
      }
    }
	}
}