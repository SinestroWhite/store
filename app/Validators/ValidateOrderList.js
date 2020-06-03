'use strict'

class ValidateOrderList {
    get rules() {
        return {
            'amount': 'required|number|min:1|max:5',
            'variation_id': 'required|exists:variations,id',
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} is required.',
            'max': 'The {{ field }} cannot be more than 5.',
            'min': 'The {{ field }} cannot be negative.',
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

module.exports = ValidateOrderList
