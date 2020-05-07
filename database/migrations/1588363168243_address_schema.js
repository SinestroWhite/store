'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressSchema extends Schema {
    up() {
        this.create('addresses', (table) => {
            table.increments();
            table.string('name');
            table.text('address');
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.timestamps();
        })
    }

    down() {
        this.drop('addresses')
    }
}

module.exports = AddressSchema
