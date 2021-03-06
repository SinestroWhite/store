'use strict'

const { rule } = use("Validator");

class CreateUser {
    get rules () {
        return {
            'username': 'required|max:255',
            'email': 'required|email|unique:users|max:256',
            'password': [
                rule('required'),
                rule('max', '255'),
                rule('min', '8'),
                rule('regex', new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*\?\+])(?!.*[()_\-\`\\/\"\'|\[\]}{:;'/>.<,])(?!.*\s)(?!.*\s).{8,}$/)),
            ]
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} is required.',
            'unique': 'The {{ field }} already exists.',
            'max': 'The {{ field }} is too long.',
            'min': 'The {{ field }} must be at least 8 characters long.',
            'regex': 'The password must contain at lest one letter and one number.'
        }
    }

    async fails(error) {
        this.ctx.session.withErrors(error)
            .flashAll();

        return this.ctx.response.redirect('back');
    }
}

module.exports = CreateUser
