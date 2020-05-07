'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategorySchema extends Schema {
    up() {
        this.create('categories', (table) => {
            table.increments();
            table.string('name');
            table.text('description').nullable();
            table.boolean('is_active');
            table.timestamps();
        })
    }

    down() {
        this.drop('categories')
    }
}

module.exports = CategorySchema
