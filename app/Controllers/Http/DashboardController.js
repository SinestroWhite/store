'use strict'

class DashboardController {

    index({ view, auth }) {
        view.render('admin.dashboard');
    }

}

module.exports = DashboardController
