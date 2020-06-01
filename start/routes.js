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

Route.on('/').render('welcome');

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

Route.resource('currencies', 'CurrencyController').validator(new Map([
    ['currency.store', 'ValidateCurrency'],
    ['currency.update', 'ValidateCurrency']
])).middleware(['auth:adminAuth'])

// Route.get('users/:id', 'UserController.show').middleware('auth');
// Route.get('login', 'UserController.index');
// Route.post('login', 'UserController.login');
