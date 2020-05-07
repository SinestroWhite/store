'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReviewSchema extends Schema {
    up() {
        this.create('reviews', (table) => {
            table.increments();
            table.text('comment');
            table.float('rating');
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.integer('product_id').unsigned().references('id').inTable('products');
            table.timestamps();
        })
    }

    down() {
        this.drop('reviews')
    }
}

module.exports = ReviewSchema
