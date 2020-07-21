'use strict'

class ValidateProduct {
    get rules() {
        return {
            'name': 'required|max:255',
            'description': 'required',
            'specifications': 'required',
            'manufacturer': 'required|max:255',
            'dimensions': 'required|max:255',
            'price': 'required|number|min: 0',
            'quantity': 'required|number|min: 0',
            'is_active': 'required|boolean',
            'category_id': 'required|exists:categories,id',
            'currency_id': 'required|exists:currencies,id',
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} field is required.',
            'max': 'The {{ field }} is too long.',
            'min': 'The {{ field }} is negative.',
            'boolean': 'The {{ field }} is not a boolean.',
            'number': 'The {{ field }} is not a number.',
            'exists': 'The {{ field }} does not exists.',
        }
    }

    async fails(error) {
        this.ctx.session.withErrors(error)
            .flashAll();

        return this.ctx.response.redirect('back');
    }
}

module.exports = ValidateProduct
