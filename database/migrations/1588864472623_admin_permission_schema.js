'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserPermissionSchema extends Schema {
    up() {
        this.create('admin_permissions', (table) => {
            table.increments();
            table.integer('admin_id').unsigned().references('id').inTable('admins');
            table.integer('permission_id').unsigned().references('id').inTable('permissions');
            table.timestamps();
        })
    }

    down() {
        this.drop('user_permissions')
    }
}

module.exports = UserPermissionSchema
