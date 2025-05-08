class queryProducts {
    products = []
    query = {}
    constructor(products, query) {
        this.products = products
        this.query = query
        console.log('Initial products:', this.products.length)
    }

    categoryQuery = () => {
        if (this.query.category) {
            this.products = this.products.filter(c => c.category === this.query.category)
            console.log('After category filter:', this.products.length)
        }
        return this
    }

    ratingQuery = () => {
        if (this.query.rating) {
            this.products = this.products.filter(c => parseInt(this.query.rating) <= c.rating && c.rating < parseInt(this.query.rating) + 1)
            console.log('After rating filter:', this.products.length)
        }
        return this
    }

    searchQuery = () => {
        if (this.query.searchValue) {
            this.products = this.products.filter(p => p.name.toUpperCase().indexOf(this.query.searchValue.toUpperCase()) > -1)
            console.log('After search filter:', this.products.length)
        }
        return this
    }

    priceQuery = () => {
        if (this.query.lowPrice !== undefined && this.query.highPrice !== undefined) {
            this.products = this.products.filter(p =>
                p.price >= this.query.lowPrice && p.price <= this.query.highPrice
            )
            console.log('After price filter:', this.products.length)
        }
        return this
    }

    sortByPrice = () => {
        if (this.query.sortPrice) {
            if (this.query.sortPrice === 'low-to-high') {
                this.products = this.products.sort((a, b) => a.price - b.price)
            } else {
                this.products = this.products.sort((a, b) => b.price - a.price)
            }
            console.log('After sort:', this.products.length)
        }
        return this
    }

    skip = () => {
        const pageNumber = parseInt(this.query.pageNumber) || 1
        const parPage = parseInt(this.query.parPage) || 12
        const skipPage = (pageNumber - 1) * parPage
        console.log('Skip calculation:', {
            pageNumber,
            parPage,
            skipPage,
            totalProducts: this.products.length
        })

        if (skipPage < this.products.length) {
            this.products = this.products.slice(skipPage, skipPage + parPage)
            console.log('After skip:', this.products.length)
        } else {
            this.products = []
        }
        return this
    }

    limit = () => {
        const parPage = parseInt(this.query.parPage) || 12
        if (this.products.length > parPage) {
            this.products = this.products.slice(0, parPage)
            console.log('After limit:', this.products.length)
        }
        return this
    }

    getProducts = () => {
        console.log('Final products:', this.products.length)
        return this.products
    }

    countProducts = () => {
        return this.products.length
    }
}

module.exports = queryProducts