'use strict'

class UpdateAdminProfile {
    // get data () {
    //     const requestBody = this.ctx.request.all()
    //
    //
    //     return Object.assign({}, requestBody, { userId })
    // }

    get rules () {
        const userId = this.ctx.auth.user.id;
        return {
            'username': 'required|max:255',
            'email': `required|email|max:255|unique:admins,email,id,${userId}`,
            'password': 'required'
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} is required.',
            'max': 'The {{ field }} is too long.',
            'unique': 'There is already a user with that email.'
        }
    }

    async fails(error) {
        this.ctx.session.withErrors(error)
            .flashAll();

        return this.ctx.response.redirect('back');
    }
}


module.exports = UpdateAdminProfile
