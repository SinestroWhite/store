'use strict'

const Product = use('App/Models/Product')
const Category = use('App/Models/Category')

class WelcomeController {
    async index({request, view}) {
        let products = await Product.query()
            .with('variations.images')
            .with('images')
            .orderBy('created_at', 'asc')
            .limit(5)
            .fetch();

        let categories = await Category.all();

        for (let i = 0; i < products.rows.length; i++) {
            products.rows[i].price = products.rows[i].price.toFixed(2);
        }

        return view.render('welcome', {products, categories})
    }
}

module.exports = WelcomeController
