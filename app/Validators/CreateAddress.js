'use strict'

const { rule } = use("Validator");

class CreateAddress {
    get rules() {
        return {
            'name': 'required|max:255',
            'phone': [
                rule('required'),
                rule('max', '255'),
                rule('regex', new RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)),
            ],
            'address': 'required'
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} is required.',
            'max': 'The {{ field }} is too long.',
            'regex': 'The phone number is not valid.'
        }
    }

    async fails(error) {
        this.ctx.session.withErrors(error)
            .flashAll();

        return this.ctx.response.redirect('back');
    }
}

module.exports = CreateAddress
