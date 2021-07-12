'use strict'

class ValidateReview {
    get rules() {
        return {
            'comment': 'required',
            'rating': 'required|number',
            'user_id': 'required|exists:user,id',
            'product_id': 'required|exists:product,id',
        }
    }

    get messages() {
        return {
            'required': 'The {{ field }} field is required.',
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

module.exports = ValidateReview
