/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('request-password-reset', 'AuthController.requestPasswordReset')
  Route.post('is-reset-password-token-valid', 'AuthController.isResetPasswordTokenValid')
  Route.post('reset-password', 'AuthController.resetPassword')
}).prefix('/auth')

Route.group(() => {
  Route.resource('accesses', 'AccessesController').apiOnly()
})
  .prefix('/developers')
  .middleware(['auth', 'role:developer'])
