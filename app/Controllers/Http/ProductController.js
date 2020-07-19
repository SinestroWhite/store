'use strict'

const Category = use('App/Models/Category')
const Currency = use('App/Models/Currency')
const Product = use('App/Models/Product')
const Variation = use('App/Models/Variation')

class ProductController {
    async index({request, view}) {
        const keyword = request.get().search;
        let page  = request.get().page;
        page = page ? page : 1;
        const products = await Product.query()
            .search(keyword)
            .with('category')
            .with('currency')
            .paginate(page ? page : 1, 10);
        if (products.rows.length === 0) {
            return view.render('product.index', {keyword})
        }
        return view.render('product.index', {products, keyword})
    }

    async search({request, view}) {
        const keyword = request.get().search;
        let page  = request.get().page;
        page = page ? page : 1;
        const products = await Product.query()
            .search(keyword)
            .with('category')
            .with('currency')
            .with('variations.images')
            .with('images')
            .paginate(page ? page : 1, 10);
        if (products.rows.length === 0) {
            return view.render('search', {keyword})
        }

        return view.render('search', {products, keyword})
    }

    async review({view, params}) {
        const product = await Product.query()
            .where('id' , '=', params.id)
            .with('category')
            .with('currency')
            .with('variations.images')
            .fetch()
        const variation = await Variation.query()
            .where('id' , '=', params.variation_id)
            .with('images')
            .fetch()
        return view.render('review', { product: product.rows[0], variation: variation.rows[0] });
    }

    async create({view}) {
        const currencies = await Currency.all();
        const categories = await Category.all();
        return view.render('product.create', { currencies: currencies.rows, categories: categories.rows });
    }

    async store({request, response}) {
        let product = request.all()
        delete product._csrf;

        const created = await Product.create({
            ...product
        });

        // try {
        //     const product = await stripe.products.create({
        //         name: created.name,
        //         description: created.description,
        //         active: created.is_active,
        //     });
        // } catch (error) {
        //     console.log(error)
        // }

        response.redirect('/variations/' + created.id);
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

        // session.flash({message: 'The product has been updated.', type: 'success'});
        response.redirect('/variations/' + product.id);
    }

    async destroy({response, session, params}) {
        const product = await Product.query().with('variations').where('id', '=', params.id).fetch();
        for (const variation of product.rows[0].$relations.variations.rows) {
            await variation.images().delete();
            await variation.delete()
        }
        await product.rows[0].delete();
        session.flash({message: 'The product has been removed!', type: 'success'});
        return response.redirect('back');
    }

}

module.exports = ProductController
