'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
    currency() {
        return this.belongsTo('App/Models/Currency')
    }
    category() {
        return this.belongsTo('App/Models/Category')
    }
}

module.exports = Product
