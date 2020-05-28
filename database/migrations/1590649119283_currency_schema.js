'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CurrencySchema extends Schema {
    up() {
        this.table('currencies', (table) => {
            table.string('code', 3);
            table.boolean('is_active');
        })
    }

    down() {
        this.table('currencies', () => {
            this.dropIfExists('code')
            this.dropIfExists('is_active')
        })
    }
}

module.exports = CurrencySchema
