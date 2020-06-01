'use strict'

const Category = use('App/Models/Category')
const Currency = use('App/Models/Currency')
const Product = use('App/Models/Product')

class ProductController {
    async index({request, view}) {
        const keyword = request.get().search;
        const products = await Product.query()
            .search(keyword)
            .with('category')
            .with('currency')
            .fetch();
        if (products.rows.length === 0) {
            return view.render('product.index', {keyword})
        }
        return view.render('product.index', {products: products.rows, keyword})
    }

    async create({view}) {
        const currencies = await Currency.all();
        const categories = await Category.all();
        return view.render('product.create', { currencies: currencies.rows, categories: categories.rows });
    }

    async store({request, response, session, params}) {
        let product = request.all()
        delete product._csrf;

        const posted = await Product.create({
            ...product
        });

        session.flash({message: 'The product has been created!', type: 'success'});
        return response.redirect('/products');
    }

    async edit({params, view}) {
        const product = await Product.find(params.id);
        const currencies = await Currency.all();
        const categories = await Category.all();
        return view.render('product.edit', { product, currencies: currencies.rows, categories: categories.rows });
    }

    async update({response, request, session, params}) {
        const product = await Product.find(params.id);

        product.name = request.all().name;
        product.description = request.all().description;
        product.specifications = request.all().specifications;
        product.manufacturer = request.all().manufacturer;
        product.dimentions = request.all().dimentions;
        product.quantity = request.all().quantity;
        product.price = request.all().price;
        product.category_id = request.all().category_id;
        product.currency_id = request.all().currency_id;
        product.is_active = request.all().is_active;

        await product.save();

        session.flash({message: 'The product has been updated.', type: 'success'});
        return response.redirect('/products');
    }

    async destroy({response, session, params}) {
        const product = await Product.find(params.id);

        await product.delete();
        session.flash({message: 'The product has been removed!', type: 'success'});
        return response.redirect('back');
    }

}

module.exports = ProductController
