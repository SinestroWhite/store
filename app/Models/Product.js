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
    static scopeSearch(query, keyword) {
        if (keyword) {
            return query
                .where('name', 'like', '%' + keyword + '%')
                .orWhere('description', 'like', '%' + keyword + '%')
        } else {
            return query;
        }
    }
}

module.exports = Product
