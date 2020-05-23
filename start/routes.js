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
const User = use('App/Models/User')

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

Route.get('dashboard', 'DashboardController.index').middleware(['auth:session']);

Route.get('/address/delete/:id', 'AddressController.delete');
Route.get('/address/update/:id', 'AddressController.update').validator('CreateAddress');
Route.post('/address', 'AddressController.create').validator('CreateAddress');

// Route.get('users/:id', 'UserController.show').middleware('auth');
// Route.get('login', 'UserController.index');
// Route.post('login', 'UserController.login');
