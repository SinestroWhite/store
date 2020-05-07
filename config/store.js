'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
    /*
    |--------------------------------------------------------------------------
    | Currency symbol
    |--------------------------------------------------------------------------
    |
    | Currency symbol that is displayed with every price.
    |
    */
    symbol: Env.get('STORE_CURRENCY', 'лв.'),

    /*
    |--------------------------------------------------------------------------
    | Currency location
    |--------------------------------------------------------------------------
    |
    | Sets where the location symbol is displayed according to the price.
    |
    */
    location: Env.get('STORE_CURRENCY_LOCATION', 'left'),

}
