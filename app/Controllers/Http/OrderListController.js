'use strict'

const OrderList = use('App/Models/OrderList');
const Order = use('App/Models/Order');

class OrderListController {
    async index({view, params}) {
        const orderLists = await OrderList.query()
            .where('order_id', params.id)
            .fetch();
        if (orderLists.rows.length === 0) {
            return view.render('lists.index')
        }
        return view.render('lists.index', {orderLists: orderLists.rows})
    }

    async cart({view, auth}) {
        const cart = await Order.query()
            .where('submitted', false)
            .where('user_id', auth.user.id)
            .fetch()

        const orderLists = await OrderList.query()
            .where('order_id', cart.rows[0].id)
            .with('variation.product')
            .with('variation.product.currency')
            .with('variation.images')
            .fetch();

        const addresses = await auth.user.addresses().fetch();

        let total = 0;
        for (let item of orderLists.rows) {
            total += item.amount * item.$relations.variation.$relations.product.price;
        }
        total = total.toFixed(2);
        if (orderLists.rows.length === 0) {
            return view.render('cart')
        }
        return view.render('cart', {orderLists: orderLists.rows, total, addresses})
    }

    async store({auth, request, response, session}) {
        let orderList = request.only(['amount', 'variation_id'])

        const cart = await Order.query()
            .where('submitted', false)
            .where('user_id', auth.user.id)
            .fetch()

        const posted = await OrderList.create({
            ...orderList,
            order_id: cart.rows[0].id
        });

        session.flash({message: 'The item has been added to your cart!', type: 'success'});
        return response.redirect('back');
    }

    async update({response, request, session, params}) {
        const orderList = await OrderList.find(params.id);

        orderList.amount = request.all().amount;

        await orderList.save();
        // session.flash({message: 'The currency has been updated.', type: 'success'});
        return response.redirect('back');
    }

    async payment({ view, request, auth }) {
        const cart = await Order.query()
            .where('submitted', false)
            .where('user_id', auth.user.id)
            .fetch()

        const order = await Order.find(cart.rows[0].id);
        order.address_id = request.all().address_id;
        await order.save();

        const orderLists = await OrderList.query()
            .where('order_id', cart.rows[0].id)
            .with('variation.product')
            .with('variation.product.currency')
            .with('variation.images')
            .fetch();

        let total = 0;
        for (let item of orderLists.rows) {
            total += item.amount * item.$relations.variation.$relations.product.price;
        }
        total = total.toFixed(2);
        // session.flash({message: 'The currency has been updated.', type: 'success'});
        return view.render('payment', { total, currency: orderLists.rows[0].$relations.variation.$relations.product.$relations.currency.code });
    }

    async submit({ view, auth }) {
        const cart = await Order.query()
            .where('submitted', false)
            .where('user_id', auth.user.id)
            .fetch()

        const order = await Order.find(cart.rows[0].id);
        order.submitted = true;
        order.status = 'PROCESSING';
        order.payment_method = 'PayPal';
        order.payment_status = 'success';
        order.shipper_id = 2;
        await order.save();

        Order.create({
            submitted: false,
            user_id: auth.user.id
        });

        return view.render('payment-successful');
    }

    async destroy({response, session, params}) {
        const orderList = await OrderList.find(params.id);

        await orderList.delete();
        session.flash({message: 'The item has been removed from your cart!', type: 'success'});
        return response.redirect('back');
    }
}

module.exports = OrderListController
