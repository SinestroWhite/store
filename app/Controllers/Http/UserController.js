'use strict'
const Persona = use('Persona')
// add to the top of the file
const User = use('App/Models/User');

Persona.registerationRules = function () {
    return {
        email: 'required|email|unique:users,email',
        password: 'required'
    }
}

class UserController {

    async displayLogin({ view, auth, response })  {
        return !auth.user ? view.render('login') : response.redirect('/');
    }

    async login({ request, auth, response, session }) {
        const { email, password } = request.all();

        try {
            const payload = request.only(['uid', 'password'])
            const user = await Persona.verify(payload)

            await auth.login(user)
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
        const payload = request.only(['username', 'email', 'password', 'password_confirmation'])
        const user = await Persona.register(payload)

        await auth.login(user);
        return response.redirect('/');
    }

    async verifyEmail({ params, session, response }) {
        const user = await Persona.verifyEmail(params.token)

        session.flash({ message: 'Email verified' })
        response.redirect('back')
    }

    async update({ request, auth }) {
        const payload = request.only(['username', 'email'])
        const user = auth.user
        await Persona.updateProfile(user, payload)
    }

    async updatePassword({ request, auth }) {
        const payload = request.only(['old_password', 'password', 'password_confirmation'])
        const user = auth.user
        await Persona.updatePassword(user, payload)
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
