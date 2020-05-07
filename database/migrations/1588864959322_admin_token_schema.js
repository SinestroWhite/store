'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AdminTokenSchema extends Schema {
    up() {
        this.create('admin_tokens', (table) => {
            table.increments();
            table.integer('admin_id').unsigned().references('id').inTable('admins');
            table.integer('token_id').unsigned().references('id').inTable('tokens');
            table.timestamps();
        })
    }

    down() {
        this.drop('admin_tokens')
    }
}

module.exports = AdminTokenSchema
