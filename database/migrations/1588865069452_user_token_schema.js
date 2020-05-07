'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserTokenSchema extends Schema {
    up() {
        this.create('user_tokens', (table) => {
            table.increments();
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.integer('token_id').unsigned().references('id').inTable('tokens');
            table.timestamps();
        })
    }

    down() {
        this.drop('user_tokens')
    }
}

module.exports = UserTokenSchema
