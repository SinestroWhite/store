'use strict'

class ValidateProduct {
    get rules() {
        return {
            'status': 'required|max:255',
            'receipt': 'required|max:255',
            'payment_method': 'required|max:255',
            'payment_status': 'required|boolean',
            'submitted': 'required|boolean',
            'shipper_id': 'required|exists:shippers,id',
            'user_id': 'required|exists:users,id',
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} is required.',
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
