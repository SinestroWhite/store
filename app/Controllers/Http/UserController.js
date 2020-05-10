'use strict'

// add to the top of the file
const User = use('App/Models/User');

class UserController {

    async register({ request, response, auth }) {
        const user = await User.create(request.only(['username','email','password']));

        await auth.login(user);
        return response.redirect('/');
    }

    async logout({ auth, response })  {
        await auth.logout();
        return response.redirect('/');
    }

    async login({ request, auth, response, session }) {
        const { email, password } = request.all();

        try {
            await auth.attempt(email, password);
            return response.redirect('/');
        } catch (error) {
            session.flash({loginError: 'Invalid credentials.'})
            return response.redirect('/login');
        }
    }

    show ({ auth, params }) {
        if (auth.user.id !== Number(params.id)) {
            return 'You cannot see someone else\'s profile';
        }
        return auth.user
    }
}

module.exports = UserController
