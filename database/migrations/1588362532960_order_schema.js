'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
    up() {
        this.create('orders', (table) => {
            table.increments();
            table.string('status').nullable();
            table.string('receipt').nullable();
            table.string('payment_method').nullable();
            table.string('payment_status').nullable();
            table.boolean('submitted');
            table.integer('shipper_id').unsigned().references('id').inTable('shippers').nullable();
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.integer('address_id').unsigned().references('id').inTable('addresses');
            table.timestamps();
        })
    }

    down() {
        this.drop('orders')
    }
}

module.exports = OrderSchema
