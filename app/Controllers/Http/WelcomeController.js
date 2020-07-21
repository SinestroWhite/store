'use strict'

const Product = use('App/Models/Product')

class WelcomeController {
    async index({request, view}) {
        let products = await Product.query()
            .with('variations.images')
            .with('images')
            .orderBy('created_at', 'asc')
            .limit(5)
            .fetch();

        for (let i = 0; i < products.rows.length; i++) {
            products.rows[i].price = products.rows[i].price.toFixed(2);
        }

        return view.render('welcome', {products})
    }
}

module.exports = WelcomeController
