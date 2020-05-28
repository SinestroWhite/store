'use strict'

class ValidateCurrency {
    get rules() {
        return {
            'name': 'required|max:255',
            'location': 'required',
            'code': 'required|max:3',
            'symbol': 'required|max:1',
            'is_active': 'required'
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} is required.',
            'max': 'The {{ field }} is too long.',
        }
    }

    async fails(error) {
        this.ctx.session.withErrors(error)
            .flashAll();

        return this.ctx.response.redirect('back');
    }
}

module.exports = ValidateCurrency
