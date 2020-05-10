'use strict'

class DashboardController {

    index({ view }) {
        view.render('dashboard');
    }

}

module.exports = DashboardController
