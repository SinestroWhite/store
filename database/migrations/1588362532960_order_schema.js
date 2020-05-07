'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
    up() {
        this.create('orders', (table) => {
            table.increments();
            table.string('status');
            table.string('receipt').nullable();
            table.string('payment_method');
            table.boolean('payment_status');
            table.boolean('submitted');
            table.integer('shipper_id').unsigned().references('id').inTable('shippers');
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.timestamps();
        })
    }

    down() {
        this.drop('orders')
    }
}

module.exports = OrderSchema
