const Event = use('Event')
const Mail = use('Mail')

Event.on('user::created', async (user) => {
    console.log('InMail');
    await Mail.send('emails.welcome', user, (message) => {
        console.log(user.email);
        message.to(user.email || 'g.yokov@hotmail.com')
        message.from('from@email')
        message.subject('Welcome to yardstick')
    })
})
