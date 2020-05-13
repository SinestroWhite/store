'use strict'

// add to the top of the file
const User = use('App/Models/User');

class UserController {

    async displayLogin({ view, auth, response })  {
        return !auth.user ? view.render('login') : response.redirect('/');
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

    async displayRegister({ view, auth, response })  {
        return !auth.user ? view.render('register') : response.redirect('/');
    }

    async register({ request, response, auth }) {
        const user = await User.create(request.only(['username','email','password']));

        await auth.login(user);
        return response.redirect('/');
    }

    async logout({ auth, response })  {
        await auth.logout();
        return response.redirect('/');
    }

    profile ({ view }) {
        return view.render('profile');
    }
}

module.exports = UserController
