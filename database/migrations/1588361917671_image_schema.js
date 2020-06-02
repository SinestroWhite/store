'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageSchema extends Schema {
    up() {
        this.create('images', (table) => {
            table.increments();
            table.string('name');
            table.integer('variation_id').unsigned().references('id').inTable('variations');
            table.timestamps();
        })
    }

    down() {
        this.drop('images')
    }
}

module.exports = ImageSchema
