'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressSchema extends Schema {
    up() {
        this.table('addresses', (table) => {
            table.string('phone');
        })
    }

    down() {
        this.table('addresses', () => {
            this.dropIfExists('phone')
        })
    }
}

module.exports = AddressSchema
