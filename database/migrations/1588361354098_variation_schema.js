'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VariationSchema extends Schema {
    up() {
        this.create('variations', (table) => {
            table.increments();
            table.string('name');
            table.integer('product_id').unsigned().references('id').inTable('products');
            table.timestamps();
        })
    }

    down() {
        this.drop('variations')
    }
}

module.exports = VariationSchema
