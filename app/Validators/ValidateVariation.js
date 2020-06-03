'use strict'

class ValidateCurrency {
    get rules() {
        return {
            'name': 'required|max:255',
            'product_id': 'required|exists:products,id',
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} is required.',
            'max': 'The {{ field }} is too long.',
            'exists': 'The {{ field }} does not exists.',
        }
    }

    async fails(error) {
        this.ctx.session.withErrors(error)
            .flashAll();

        return this.ctx.response.redirect('back');
    }
}

module.exports = ValidateCurrency
