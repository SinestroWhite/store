'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderListsSchema extends Schema {
    up() {
        this.create('order_lists', (table) => {
            table.increments();
            table.integer('amount');
            table.integer('variant_id').unsigned().references('id').inTable('variants');
            table.integer('order_id').unsigned().references('id').inTable('orders');
            table.timestamps();
        })
    }

    down() {
        this.drop('order_lists')
    }
}

module.exports = OrderListsSchema
