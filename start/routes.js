'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');
const Admin = use('App/Models/Admin');

Route.get('/', 'WelcomeController.index');

Route.get('/search', 'ProductController.search');
Route.get('/review/:id/:variation_id', 'ProductController.review');

// Route.get('/', ({ auth, view, response }) => {
//     // if (auth.user instanceof Admin) {
//     //     response.redirect('/dashboard')
//     // } else {
//     view.render('welcome')
//     // }
// })

Route.get('/register', 'UserController.displayRegister');
Route.post('/register', 'UserController.register').middleware('throttle:5').validator('CreateUser');

Route.post('/login', 'UserController.login').middleware('throttle:5').validator('LoginUser');
Route.get('/login', 'UserController.displayLogin');

Route.get('/verify/:token', 'UserController.verifyEmail').middleware('throttle:5');
Route.get('/email-resend', 'UserController.resendEmail').middleware('throttle:1');

Route.get('/password-reset', 'UserController.displayForgotPassword');
Route.post('/password-reset', 'UserController.forgotPassword').middleware('throttle:1,600').validator('RequestPasswordReset');

Route.get('/reset/:token', 'UserController.displayResetPassword');
Route.post('/reset', 'UserController.resetPassword').middleware('throttle:3').validator('ResetPassword');

Route.get('/profile', 'UserController.profile').middleware(['auth:session']);
Route.post('/profile-save', 'UserController.update').validator('UpdateProfile').middleware(['auth:session']);
Route.post('/profile-change', 'UserController.updatePassword').validator('UpdatePassword').middleware(['auth:session']);

Route.get('/logout', 'UserController.logout').middleware(['auth:session']);

Route.get('/address/delete/:id', 'AddressController.delete');
Route.get('/address/update/:id', 'AddressController.update').validator('CreateAddress');
Route.post('/address', 'AddressController.create').validator('CreateAddress');

// Admin Back Office

Route.get('/admin', 'AdminController.displayLogin');
Route.post('/admin', 'AdminController.login').middleware('throttle:5').validator('LoginUser');

Route.get('/admin-profile', 'AdminController.profile').middleware(['auth:adminAuth']);
Route.post('/admin-profile-save', 'AdminController.update').middleware(['auth:adminAuth']).validator('UpdateAdminProfile');
Route.post('/admin-profile-change', 'AdminController.updatePassword').validator('UpdatePassword').middleware(['auth:adminAuth']);

Route.get('/admin-logout', 'AdminController.logout').middleware(['auth:adminAuth']);

Route.on('/dashboard').render('admin.dashboard').middleware(['auth:adminAuth']);
// Route.get('/dashboard', 'DashboardController.index')

Route.resource('categories', 'CategoryController').validator(new Map([
    ['categories.store', 'ValidateCategory'],
    ['categories.update', 'ValidateCategory']
])).middleware(['auth:adminAuth'])

Route.resource('products', 'ProductController').validator(new Map([
    ['products.store', 'ValidateProduct'],
    ['products.update', 'ValidateProduct']
])).middleware(['auth:adminAuth'])

Route.get('/variations/:id', 'VariationController.index').middleware(['auth:adminAuth']);
Route.post('/variations/save', 'VariationController.store').validator('ValidateVariation').middleware(['auth:adminAuth']);
Route.delete('/variations/delete/:id', 'VariationController.destroy').middleware(['auth:adminAuth']).as('variations.destroy');

Route.get('/image/:name', 'VariationController.showImage');

Route.resource('currencies', 'CurrencyController').validator(new Map([
    ['currency.store', 'ValidateCurrency'],
    ['currency.update', 'ValidateCurrency']
])).middleware(['auth:adminAuth'])

Route.resource('shippers', 'ShipperController').validator(new Map([
    ['shipper.store', 'ValidateShipper'],
    ['shipper.update', 'ValidateShipper']
])).middleware(['auth:adminAuth'])

Route.resource('orders', 'OrderController').validator(new Map([
    ['order.store', 'ValidateOrder'],
    ['order.update', 'ValidateOrder']
])).middleware(['auth:adminAuth'])

Route.resource('reviews', 'ReviewController').validator(new Map([
    ['review.store', 'ValidateReview'],
    ['review.update', 'ValidateReview']
])).middleware(['auth:adminAuth'])

Route.get('/cart', 'OrderListController.cart').middleware(['auth:session']).as('lists.cart');
Route.get('/success', 'OrderListController.submit').middleware(['auth:session']).as('submit');
Route.get('/my-orders', 'OrderController.myOrders').middleware(['auth:session']).as('my-orders');
Route.post('/payment', 'OrderListController.payment').validator('ValidateAddressId').middleware(['auth:session']).as('payment');
Route.post('/order-list/save', 'OrderListController.store').validator('ValidateOrderList').middleware(['auth:session']).as('lists.save');
Route.delete('/order-list/:id/delete', 'OrderListController.destroy').middleware(['auth:session']).as('lists.delete');
Route.patch('/order-list/:id/update', 'OrderListController.update').middleware(['auth:session']).as('lists.update');


// Route.get('users/:id', 'UserController.show').middleware('auth');
// Route.get('login', 'UserController.index');
// Route.post('login', 'UserController.login');
