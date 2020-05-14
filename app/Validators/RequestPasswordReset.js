'use strict'

class RequestPasswordReset {
    get rules () {
        return {
            'email': 'email|required',
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} is required.',
        }
    }

    async fails(error) {
        this.ctx.session.withErrors(error)
            .flashAll();

        return this.ctx.response.redirect('back');
    }
}


module.exports = RequestPasswordReset
