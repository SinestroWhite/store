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

Route.get('/profile', 'UserController.profile');

Route.get('/logout', 'UserController.logout');

Route.get('dashboard', 'DashboardController.index').middleware(['auth:jwt']);

// Route.get('users/:id', 'UserController.show').middleware('auth');
// Route.get('login', 'UserController.index');
// Route.post('login', 'UserController.login');
