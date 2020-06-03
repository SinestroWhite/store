'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderList extends Model {
    variation() {
        return this.belongsTo('App/Models/Variation')
    }
}

module.exports = OrderList
