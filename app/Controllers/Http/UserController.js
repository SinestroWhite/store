'use strict'
const Persona = use('Persona')
// add to the top of the file
const User = use('App/Models/User')
const Event = use('Event');

Persona.registerationRules = function () {
    return {
        email: 'required|email|unique:users,email',
        password: 'required'
    }
}

Persona.loginRules = function () {
    return {
        email: 'required',
        password: 'required'
    }
}

class UserController {

    async displayLogin({ view, auth, response })  {
        return !auth.user ? view.render('login') : response.redirect('/');
    }

    async login({ request, auth, response, session }) {
        try {
            let payload = request.only(['email', 'password'])
            payload.uid = payload.email;
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

    async register({ request, session, response, auth }) {
        const payload = request.only(['username', 'email', 'password', 'password_confirmation'])
        const user = await Persona.register(payload)

        await auth.login(user);
        session.flash({ message: 'We have sent you an email please, take a minute to confirm your account.', type:'success' });
        return response.redirect('/');
    }

    async verifyEmail({ params, session, response }) {
        const token = decodeURIComponent(params.token);
        const user = await Persona.verifyEmail(token);

        session.flash({ message: 'We have verified your email, thank you!', type:'success' });
        response.redirect('/');
    }

    async forgotPassword({ request, session, response }) {
        await Persona.forgotPassword(request.input('email'));

        session.flash({ message: 'We have sent you a recovery email!', type:'success' });
        return response.redirect('/');
    }

    async displayForgotPassword({ view, auth, response })  {
        return !auth.user ? view.render('forgot') : response.redirect('/');
    }

    async displayResetPassword({ view, auth, response, params })  {
        return !auth.user ? view.render('reset', {token: params.token}) : response.redirect('/');
    }

    async resendEmail({ auth, session, response }) {
        Event.fire('user::created', { user: auth.user, token: (await auth.user.tokens().fetch()).first().token});

        session.flash({ message: 'We have resent a new email! Please, check your spam box!', type:'success' });
        return response.redirect('/');
    }

    async resetPassword({ request, session, response }) {
        const token = decodeURIComponent(request.only(['token']).token);
        const payload = request.only(['password', 'password_confirmation'])

        const user = await Persona.updatePasswordByToken(token, payload)

        session.flash({ message: 'Your password has been successfully reset!', type:'success' });
        return response.redirect('/');
    }

    profile ({ view }) {
        return view.render('profile');
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
}

module.exports = UserController
