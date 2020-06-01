'use strict'

const Axios = use('axios');
const Admin = use('App/Models/Admin');
const Env = use('Env');
const Hash = use('Hash')

class AdminController {

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
        // const user = await Admin.create({ username: 'Admin', email: 'admin@webstore.com', password });
        // await auth.authenticator('adminAuth').login(user);
        console.log(auth.authenticator('adminAuth'));
        return !(auth.user instanceof Admin) ?
            view.render('admin.login', {
                key: Env.get('GOOGLE_RECAPTCHA_V3_SITE_KEY'),
                useCaptcha: Env.get('USE_GOOGLE_RECAPTCHA')
            }) : response.redirect('/dashboard');
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

        const { email, password } = request.all();

        try {
            await auth.authenticator('adminAuth').attempt(email, password);
            return response.redirect('/dashboard');
        } catch (error) {
            console.log(error);
            session.flash({loginError: 'Invalid credentials.'})
            return response.redirect('/admin');
        }
    }

    async profile({view, auth}) {
        return view.render('admin.profile', {url: Env.get('APP_URL')});
    }

    async update({ request, auth, session, response }) {
        const isSame = await Hash.verify(request.input('password'), auth.user.password)
        if (isSame) {
            const { username, email } = request.only(['username', 'email'])
            let user = auth.user;
            user.username = username;
            user.email = email;
            await user.save();

            session.flash({ message: 'Your profile has been updated!', type:'success' });
            return response.redirect('back');
        } else {
            session.flash({ message: 'Your password didn\'t match!', type:'danger' });
            return response.redirect('back');
        }
    }

    async updatePassword({ request, auth, session, response }) {
        const isSame = await Hash.verify(request.input('old_password'), auth.user.password)
        if (isSame) {
            const { password } = request.only(['password'])
            let user = auth.user;
            user.password = await Hash.make(password);
            await user.save();

            session.flash({ message: 'Your password has been changed!', type:'success' });
            return response.redirect('back');
        } else {
            session.flash({ message: 'Your password didn\'t match!', type:'danger' });
            return response.redirect('back');
        }
    }

    async logout({ auth, response })  {
        await auth.authenticator('adminAuth').logout();
        return response.redirect('/');
    }

}

module.exports = AdminController
