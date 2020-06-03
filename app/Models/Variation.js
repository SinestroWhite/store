'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Variation extends Model {
    images() {
        return this.hasMany('App/Models/Image')
    }
    product() {
        return this.belongsTo('App/Models/Product')
    }
}

module.exports = Variation
