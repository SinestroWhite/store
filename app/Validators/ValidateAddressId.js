'use strict'

class ValidateAddressId {
    get rules() {
        return {
            'address_id': 'required|exists:addresses,id',
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} is required.',
            'exists': 'The {{ field }} does not exists.',
        }
    }

    async fails(error) {
        this.ctx.session.withErrors(error)
            .flashAll();

        return this.ctx.response.redirect('back');
    }
}

module.exports = ValidateAddressId
