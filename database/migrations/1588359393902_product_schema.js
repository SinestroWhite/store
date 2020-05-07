'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
    up() {
        this.create('products', (table) => {
            table.increments();
            table.string('name');
            table.text('description').nullable();
            table.text('specifications').nullable();
            table.string('manufacturer').nullable();
            table.string('dimensions').nullable();
            table.integer('quantity');
            table.float('price');
            table.boolean('is_active').notNullable().defaultTo(true);
            table.integer('category_id').unsigned().references('id').inTable('categories');
            table.timestamps();
        })
    }

    down() {
        this.drop('products')
    }
}

module.exports = ProductSchema
