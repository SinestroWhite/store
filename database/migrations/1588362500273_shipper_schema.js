'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ShipperSchema extends Schema {
    up() {
        this.create('shippers', (table) => {
            table.increments();
            table.string('name');
            table.text('description').nullable();
            table.timestamps();
        })
    }

    down() {
        this.drop('shippers')
    }
}

module.exports = ShipperSchema
