'use strict'

class UpdateProfile {
    get rules () {
        return {
            'username': 'required|max:255',
            'email': 'required|email|max:256',
            'password': 'required'
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


module.exports = UpdateProfile
