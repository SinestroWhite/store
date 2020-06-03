'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
    static scopeSearch(query, keyword) {
        if (keyword) {
            return query
                .where('name', 'like', '%' + keyword + '%')
                .orWhere('description', 'like', '%' + keyword + '%')
        } else {
            return query;
        }
    }
    lists() {
        return this.hasMany('App/Models/OrderList')
    }
    user() {
        return this.belongsTo('App/Models/User')
    }
    shipper() {
        return this.belongsTo('App/Models/Shipper')
    }
}

module.exports = Order
