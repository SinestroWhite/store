'use strict'

const Order = use('App/Models/Order')
const User = use('App/Models/User')
const Shipper = use('App/Models/Shipper')

class OrderController {
    async index({request, view}) {
        const keyword = request.get().search;
        let page  = request.get().page;
        page = page ? page : 1;
        let orders = await Order.query()
            .where('submitted', true)
            .search(keyword)
            .with('user')
            .with('shipper')
            .with('lists.variation.product')
            .with('lists.variation.images')
            .paginate(page ? page : 1, 10);

        if (orders.rows.length === 0) {
            return view.render('order.index', {keyword})
        }

        for (let i = 0; i < orders.rows.length; i++) {
            let total = 0;
            for (let j = 0; j < orders.rows[i].$relations.lists.rows.length; j++) {
                total += orders.rows[i].$relations.lists.rows[j].$relations.variation.$relations.product.price;
            }
            orders.rows[i].price = total.toFixed(2);
        }

        // console.log(orders.rows[0].$relations.user);
        return view.render('order.index', {orders, keyword})
    }

    async myOrders({request, view, auth}) {
        const keyword = request.get().search;
        let page  = request.get().page;
        page = page ? page : 1;
        let orders = await Order.query()
            .where('submitted', true)
            .where('user_id', auth.user.id)
            .search(keyword)
            .with('shipper')
            .with('lists.variation.product')
            .with('lists.variation.images')
            .paginate(page, 10);

        if (orders.rows.length === 0) {
            return view.render('order.index', {keyword})
        }

        for (let i = 0; i < orders.rows.length; i++) {
            let total = 0;
            for (let j = 0; j < orders.rows[i].$relations.lists.rows.length; j++) {
                total += orders.rows[i].$relations.lists.rows[j].$relations.variation.$relations.product.price;
            }
            orders.rows[i].price = total.toFixed(2);
        }

        // console.log(orders.rows[0].$relations.user);
        return view.render('order.preview', {orders, keyword})
    }

    // async create({view}) {
    //     const currencies = await Currency.all();
    //     const categories = await Category.all();
    //     return view.render('product.create', { currencies: currencies.rows, categories: categories.rows });
    // }

    // async store({request, response}) {
    //     let product = request.all()
    //     delete product._csrf;
    //
    //     const created = await Product.create({
    //         ...product
    //     });
    //
    //     response.redirect('/variations/' + created.id);
    // }

    async edit({params, view}) {
        const order = await Order.find(params.id);
        const users = await User.all();
        const shippers = await Shipper.all();
        return view.render('order.edit', { order, users: users.rows, shippers: shippers.rows });
    }

    async update({response, request, session, params}) {
        const order = await Order.find(params.id);

        order.status = request.all().status;
        order.payment_status = request.all().payment_status;
        order.payment_method = request.all().payment_method;
        order.shipper_id = request.all().shipper_id;
        order.user_id = request.all().user_id;

        await order.save();

        session.flash({message: 'The order has been updated.', type: 'success'});
        response.redirect('/orders');
    }

    async destroy({response, session, params}) {
        let order = await Order.query()
            .where('id', params.id)
            .with('lists')
            .fetch();
        order = order.rows[0];
        await order.lists().delete();
        await order.delete();
        session.flash({message: 'The product has been removed!', type: 'success'});
        return response.redirect('back');
    }


}

module.exports = OrderController
