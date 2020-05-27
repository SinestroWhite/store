'use strict'

const Category = use('App/Models/Category')
const Product = use('App/Models/Product')

class ProductController {
    async index({view}) {
        const products = await Product.all();
        if (products.rows.length === 0) {
            return view.render('product.index')
        }
        return view.render('product.index', {products: products.rows})
    }

    async create({view}) {
        return view.render('product.create');
    }

    async store({request, response, session, params}) {
        let product = request.all()

        const posted = await Category.find(params.id).products().create({
            ...product
        });

        session.flash({message: 'The product has been created!', type: 'success'});
        return response.redirect('back');
    }

    async edit({params, view}) {
        const product = await Product.find(params.id);
        return view.render('product.edit', {product});
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
