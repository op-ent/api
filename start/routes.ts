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
import AutoSwagger from 'adonis-autoswagger'
import swagger from 'Config/swagger'

Route.group(() => {
  Route.group(() => {
    Route.post('register', 'AuthController.register')
    Route.post('login', 'AuthController.login')
  }).prefix('/auth')

  Route.group(() => {
    Route.resource('accesses', 'AccessesController').apiOnly()
  })
    .prefix('/developers')
    .middleware(['auth', 'role:developer'])
}).middleware('gateway')

Route.group(() => {
  Route.get('/swagger.yaml', async () => AutoSwagger.docs(Route.toJSON(), swagger as any))
  Route.get('/docs', async () => AutoSwagger.ui('/swagger/swagger.yaml'))
}).prefix('/swagger')
