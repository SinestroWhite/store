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
    variations() {
        return this.hasMany('App/Models/Variation')
    }
    images() {
        return this.manyThrough('App/Models/Variation', 'images', 'id', 'product_id')
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
