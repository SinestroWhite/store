'use strict'

const Axios = use('axios');
const Persona = use('Persona');
const Env = use('Env');
const Event = use('Event');
const Hash = use('Hash');

const Address = use('App/Models/Address');

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

    async verifyToken(token) {
        return await Axios({
            url: 'https://www.google.com/recaptcha/api/siteverify',
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                response: token,
                secret: Env.get('GOOGLE_RECAPTCHA_V3_SECRET_KEY')
            },
        });
    }

    async displayLogin({ view, auth, response })  {
        return !auth.user ? view.render('login', {key: Env.get('GOOGLE_RECAPTCHA_V3_SITE_KEY'), useCaptcha: Env.get('USE_GOOGLE_RECAPTCHA')}) : response.redirect('/');
    }

    async login({ request, auth, response, session }) {
        if (Env.get('USE_GOOGLE_RECAPTCHA') === 'true') {
            await this.verifyToken(request.input('g-recaptcha-response')).then((response) => {
                if (!response.data.success) {
                    session.flash({loginError: 'Invalid ReCaptcha Response.'})
                    return response.redirect('/login');
                }
            });
        }

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
        return !auth.user ? view.render('register', {key: Env.get('GOOGLE_RECAPTCHA_V3_SITE_KEY'), useCaptcha: Env.get('USE_GOOGLE_RECAPTCHA')}) : response.redirect('/');
    }

    async register({ request, session, response, auth }) {
        if (Env.get('USE_GOOGLE_RECAPTCHA') === 'true') {
            await this.verifyToken(request.input('g-recaptcha-response')).then((response) => {
                if (!response.data.success) {
                    session.flash({loginError: 'Invalid ReCaptcha Response.'})
                    return response.redirect('/register');
                }
            });
        }

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
        if (Env.get('USE_GOOGLE_RECAPTCHA') === 'true') {
            await this.verifyToken(request.input('g-recaptcha-response')).then((response) => {
                if (!response.data.success) {
                    session.flash({loginError: 'Invalid ReCaptcha Response.'})
                    return response.redirect('back');
                }
            });
        }

        await Persona.forgotPassword(request.input('email'));

        session.flash({ message: 'We have sent you a recovery email!', type:'success' });
        return response.redirect('/');
    }

    async displayForgotPassword({ view, auth, response })  {
        return !auth.user ? view.render('forgot', {key: Env.get('GOOGLE_RECAPTCHA_V3_SITE_KEY'), useCaptcha: Env.get('USE_GOOGLE_RECAPTCHA')}) : response.redirect('/');
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

    async profile({view, auth}) {
        const addresses = await Address.query()
            .where('user_id', '=', auth.user.id)
            .fetch()

        if (addresses.rows.length === 0) {
            return view.render('profile', {url: Env.get('APP_URL')});
        }

        return view.render('profile', {url: Env.get('APP_URL'), addresses: addresses.rows});
    }

    async update({ request, auth, session, response }) {
        const isSame = await Hash.verify(request.input('password'), auth.user.password)
        if (isSame) {
            const payload = request.only(['username', 'email'])
            const user = auth.user
            await Persona.updateProfile(user, payload).then(() => {
                session.flash({ message: 'Your profile has been updated! If you have changed your email, you will need to confirm it.', type:'success' });
                return response.redirect('back');
            }).catch((error) => {
                session.flash({ message: 'There is already a user with that email.', type:'danger' });
                return response.redirect('back');
            })
        } else {
            session.flash({ message: 'Your password didn\'t match!', type:'danger' });
            return response.redirect('back');
        }
    }

    async updatePassword({ request, auth, session, response }) {
        const payload = request.only(['old_password', 'password', 'password_confirmation'])
        const user = auth.user
        await Persona.updatePassword(user, payload)

        session.flash({ message: 'Your password has been changed!', type:'success' });
        return response.redirect('back');
    }

    async logout({ auth, response })  {
        await auth.logout();
        return response.redirect('/');
    }
}

module.exports = UserController
