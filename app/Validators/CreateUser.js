'use strict'

class CreateUser {
    get rules () {
        return {
            'username': 'required|max:255',
            'email': 'required|unique:users|max:256',
            'password': 'required|min:6'
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} is required.',
            'unique': 'The {{ field }} already exists.',
            'max': 'The {{ field }} is too long.',
            'min': 'The {{ field }} must be at least 6 characters long.'
        }
    }

    async fails(error) {
        this.ctx.session.withErrors(error)
            .flashAll();

        return this.ctx.response.redirect('back');
    }
}

module.exports = CreateUser
