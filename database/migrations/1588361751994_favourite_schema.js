'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FavouriteSchema extends Schema {
    up() {
        this.create('favourites', (table) => {
            table.increments();
            table.integer('product_id').unsigned().references('id').inTable('products');
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.timestamps();
        })
    }

    down() {
        this.drop('favourites')
    }
}

module.exports = FavouriteSchema
