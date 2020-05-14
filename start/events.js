const Event = use('Event')
const Mail = use('Mail')
const Env = use('Env')

Event.on('user::created', async (payload) => {
    payload.token = encodeURIComponent(payload.token);
    payload.url = Env.get('APP_URL');
    await Mail.send('emails.welcome', { payload }, (message) => {
        message.to(payload.user.email)
        message.from(Env.get('EMAIL_FOR_SENDING_MESSAGES'))
        message.subject('Welcome to WebStore!')
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    })
})

Event.on('forgot::password', async (payload) => {
    payload.token = encodeURIComponent(payload.token);
    payload.url = Env.get('APP_URL');
    await Mail.send('emails.forgot', { payload }, (message) => {
        message.to(payload.user.email)
        message.from(Env.get('EMAIL_FOR_SENDING_MESSAGES'))
        message.subject('WebStore Password Reset')
    }).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.error(error);
    })
})

