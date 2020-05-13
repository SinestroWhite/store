'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StatusSchema extends Schema {
    up() {
        this.table('users', (table) => {
            table.string('account_status')
        })
    }

    down() {
        this.table('users', (table) => {
            table.dropIfExists('account_status')
        })
    }
}

module.exports = StatusSchema
