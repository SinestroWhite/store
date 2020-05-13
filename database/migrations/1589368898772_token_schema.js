'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokenSchema extends Schema {
    up() {
        this.table('tokens', (table) => {
            table.integer('user_id').unsigned().references('id').inTable('users')
        })
    }

    down() {
        this.table('tokens', (table) => {
            table.dropIfExists('user_id')
        })
    }
}

module.exports = TokenSchema
