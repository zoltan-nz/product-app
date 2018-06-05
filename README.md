# Product App

Updated to the latest Ember v3

We are going to build a web application which could be a web-shop or a product management app. We can add products, they can belong to a category. We can manage categories also. First of all let's focus on the administration area, later we build the "store front" where a user can collect products in a shopping cart.
 
I suppose, you finished already the [Ember.js Tutorial][yoember.com], where you built the Library App, so you know roughly how we build Ember application on "Ember Way". For this reason, I don't explain everything, we can focus only the main steps. (It means, you will see all the steps with less explanation. ;)

At the beginning there won't add any styling, so we can focus only for the functionality.
 
Let's create a new app:

```shell
$ ember new product-app
```

This is the data model structure, what we would like to implement. I leave it here, so I can refer back to this table when we implement the related part.

## Models

|`category`||
|---|---
|`name`|string
|`products`|hasMany

|`product`||
|---|---
|`name`|string
|`sku`|string
|`categories`|belongsTo
|`tags`|hasMany
|`unitPrice`|number

|`tag`||
|---|---
|`name`|string
|`products`|hasMany

|`shoppingCart`||
|---|---
|`user`|string
|`purchaseDate`|date
|`paid`|boolean
|`lineItems`|hasMany
|`total`|number

|`lineItem`||
|---|---
|`shoppingCart`|belongsTo
|`product`|belongsTo
|`quantity`|number
|`sum`|number

## Requirements

Let's create a list about our requirements. Basically this will be our main todo list. ;)

* [x] [Lesson 1 - Admin user can navigate to `/admin`](#user-content-admin-page)
* [x] [Lesson 2 - Admin user can CRUD (create, read, update, delete) `categories` on `/admin/categories`](#user-content-categories)
* [x] [Homework 1 - Admin user can CRUD `products` on `/admin/products`](#user-content-homework-1)
* [x] [Lesson 3 - Admin user can change the `category` of a `product`](#user-content-relationship)
* [ ] [Homework 2 - User can see the list of products on the `home` (`index`)](#user-content-homework-2)
* [ ] [Lesson 4 - User can filter the list of products clicking on a `category`](#user-content-filter)
* [ ] [Lesson 5 - User can collect products in a shopping cart](#user-content-shopping-cart)

##<a name='admin-page'></a> 1. Home page and Admin page

### Creating `application` template and a link to the home page

```shell
$ ember g template application
```

```handlebars
{{!-- app/templates/application.hbs --}}
{{link-to 'Home' 'index'}}

<hr>

{{outlet}}
```

Add an index page with a header.

```shell
$ ember g template index
```

```handlebars
{{!-- app/templates/index.hbs --}}
<h1>Home Page</h1>
```

### Creating `/admin` route

* Create an `admin` route, 
* add an `h1` header to the main admin page and 
* add a link to the `application` template.

```shell
$ ember g route admin
```

```handlebars
{{!-- app/templates/admin.hbs --}}
<h1>Admin Page</h1>

{{outlet}}
```

```handlebars
{{!-- app/templates/application.hbs --}}
{{link-to 'Home' 'index'}} | {{link-to 'Admin' 'admin'}}
```
![Home page and Admin page][step_1]

## <a name='categories'></a>2. Categories Page and CRUD interface

### `admin/categories` page

* Create a `categories` page under `admin` route and 
* add a link to the main admin page.

```shell
$ ember g route admin/categories
```

```handlebars
{{!-- app/templates/admin/categories.hbs --}}
<h1>Categories Admin Page</h1>

{{outlet}}
```

```handlebars
{{!-- app/templates/admin.hbs --}}
<h1>Admin Page</h1>

{{link-to 'Categories' 'admin.categories'}}

<hr>

{{outlet}}
```
![Categories subroute][step_2_1]

## Notes about nested templates and directory structure

![Nested Template Structure][nested-template]

In Ember, the templates have a clear, strict hierarchy. Firstly, each page or subpage (embeded page) has a main "wrapper" template and has an "index" page. For example, the main-main, top template is the `application.hbs`, and it has an `index.hbs`, which actually the app's home page. 

The "wrapper" page file name is the same as the represented route, so if we have an `/admin` page, than we have an `admin` route, so we have an `admin.hbs`. If we wouldn't like to add a nested subroute to `admin` we can use this `admin.hbs` for presenting the content. Otherwise if we add a new subroute to the admin, for example `/admin/categories`, than we have to create a new folder in the `templates` directory, this new folder will be `templates/admin`. In this folder we can have an `index.hbs`, which will be the main page of the `/admin` route, and we could have a `categories.hbs` which will be the "wrapper" file for that subroute.

Important, if we have a subroute, we have to add `{{outlet}}` handlebar code to the "wrapper" template. The subroute content will be rendered in this "outlet" placeholder. 

## Creating the `Category` model

**Repeat**: Please learn *computed properties*, *observers* and *actions* from Lesson 2 on [Ember][yoember.com] Tutorial.

In this session we add real functionality to our Category Admin page. Firstly, we implement an input box with an "Add" button, which will extend the category list, additionally we attache a "Delete" button also to each existing category item, so we can remove them from the list. In our first implementation it will use only an Ember Array, so it uses the web-browser memory only. Secondly, we will use Ember Data and a proper Model, which would expect the existence of a database and a backend system. Luckily we can mock the backend. I show two options here, the first will use [Ember CLI http-mock server][ember_cli_mock_server], the second one will use a popular add-on: [Ember Mirage][ember_mirage].

### Data down from route to template

**Important**: In Ember.js everything starts from the url. When you navigate to a page, the url changes, Ember automatically checks the map in `router.js`. Based on the `Router.map` it is automatically enter in the connected Route Handler (route). Ember will goes through on a certain steps in this route, after it will setup the controller and finally the template.  

Check out this figure from the [Ember Guides][ember_guide]

![Ember Application concept][ember_concept_image]

The rule of thumb, if you would like to show data from an external source (from your database) on your page, it should download (via backend service) almost always in `model` hook of the route handler. Which means, you almost always have to have a `model` function in  your route file and return the data from that function, it will automatically added to a `model` property in your controller and template. Let see, how it works in our Category Admin page.

We already generated our Categories route handler (`app/routes/admin/categories.js`). Let's extend this file with a `model` function, with a "model hook". We call it "model hook", because this function is exists in the Ember framework, so it will be automatically invoked. Check out in the [official documentation][route_handler_api] how many "built-in" functions are in a route handler, but don't worry, we will use only a couple, if you are already on the official api documentation page, please read the doc of the `model` hook with clicking on the "model" link. If it does not make any sense, you are not alone. It is totally normal, when you start learning a new framework or tool. ;) It will be much clearer later. 

Back to our Product App. Update the category route. Let's return an array of objects in our "model hook".

```js
// app/routes/admin/categories.js
import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return [
      {
        id: 1,
        name: 'First Category'
      },
      {
        id: 2,
        name: 'Second Category'
      }
    ];
  }
  
});
```

Now, update the categories template, add an `each` loop handlebars helper to `categories.hbs`:

```hbs
<h1>Categories Admin Page</h1>

<ul>
  {{#each model as |category|}}
    <li>ID: {{category.id}}, NAME: {{category.name}}</li>
  {{/each}}
</ul>
```
Yey, we have a list of categories:

![List categories][step_2_2]

Next step is creating an input field and adding new items to our model. I suppose, you already know a lot about [actions][actions_official_guide] also.

Update your template with a form, an input box with action, and let's add a counter also:

```hbs
{{!-- /app/templates/admin/categories.hbs --}}
<h1>Categories Admin Page</h1>

<form>
  <label>ID:</label>
    {{input value=newCategoryId}}
  <label>NAME:</label>
    {{input value=newCategoryName}}
  <button type="submit" {{action 'addNewCategory' newCategoryId newCategoryName}}>Add</button>
</form>

<ul>
  {{#each model as |category|}}
    <li>ID: {{category.id}}, NAME: {{category.name}}</li>
  {{/each}}
</ul>

Category Counter: {{model.length}}
```
So we have a simple form, where we read an `id` and a `name`, we can submit this data with hitting Enter or clicking on the button. It will invoke the action function and pass two params.

We have to implement the action in our route handler. This action will push a new object to the `model` array, which is in the controller.

```js
// app/routes/admin/categories.js
import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return [
      {
        id: 1,
        name: 'First Category'
      },
      {
        id: 2,
        name: 'Second Category'
      }
    ];
  },

  actions: {

    addNewCategory(id, name) {
      this.controller.get('model').pushObject({ id, name });
    }

  }
});
```
Add the delete button also, extend the `categories.hbs` template list element with a button:

```hbs
<ul>
  {{#each model as |category|}}
    <li>
      ID: {{category.id}}, NAME: {{category.name}} 
      <button {{action 'deleteCategory' category}}>Del</button>
    </li>
  {{/each}}
</ul>
```
Action goes in `app/routes/admin/categories.js`:

```js
//...
  actions: {

    addNewCategory(id, name) {
      this.controller.get('model').pushObject({ id, name });
    },

    deleteCategory(category) {
      this.controller.get('model').removeObject(category);
    }
  }
//...
```
You can read more about `pushObject` and `removeObject` on `Ember.NativeArray` [documentation page][native_array_doc].

Is your app looks like this?

![Form with Add and Del buttons][step_2_3]

Brilliant, you can add and remove items from an array model, however if you reload the page, all added record is gone.

### Ember Data

Ember Data is responsible for managing ajax request from or to a server. It uses adapters to communicate with different type of backend systems.

An Ember application has a `store` service. We can access data via this service.

The core element of Ember Data is Ember Model, where we can declare the properties of a model.

[More about models on the official guide][official_guide_models] and architecture overview from this page:

![Ember store architecture overview][ember_store_image]

**Generate Model**

Ember CLI can generate for us a skeleton model. The following command will create a `category.js` in our `model` folder and will add a `name` field with `string` type.

```shell
$ ember generate model category name:string
```

**Update model hook**

We have a model in our Product Application, let's use it in our Categories admin page. 

Let's delete the dummy data from `model()` hook in `/routes/admin/categories.js` and update as follow. In the same step, we can update our `addNewCategory()` and `deleteCategory()` actions also.
 
```js
// app/routes/admin/categories.js
import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.findAll('category');
  },

  actions: {

    addNewCategory(id, name) {
      this.store.createRecord('category', { id, name }).save();
    },

    deleteCategory(category) {
      category.destroyRecord();
    }
  }
});
```

We use `this.store.findAll()` for downloading all the available record, `this.store.createRecord()` can create a new record, `.save()` would try to permanently save it. We can use `.destroyRecord()` for totally remove from our app and from the server the related record.

But first of all try out the above code. Try to **reload** the page.

*Check the console!* Our app try to download data from somewhere, but get a 404 Error response, because we doesn't really have any backend server.

Your backend could be Ruby on Rails app, Node.js app, .Net app, PHP app, Python based app, Elixir or anything else. It could be a cloud based solution also, like Firebase, you've already learned about it when you built the Library App from http://yoember.com.

In this tutorial, we will use the famous [Ember-Mirage][ember_mirage] mock server.

### Add Mirage

1. Install Mirage

```
$ ember install ember-cli-mirage
```

Check our new helpers:

```
$ ember g --help
```


2. Create a Mirage Model, we would like to mock our Category:

```
$ ember g mirage-model category
```

Update `mirage/config.js`

```js
this.namespace = '/api';

this.get('/categories', (schema, request) => {
  return schema.categories.all();
});
```

* Relaunch your app, try to click on "Categories".

* Check the error message in console.

Actually, you can play with the old `jQuery.get()` in console.
`$.get('/api/categories')`

3. Time to add Adapter to our Ember app:

```
$ ember g adapter application
```

Still need the `namespace` setting.

```js
// app/adapters/application.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({

  namespace: 'api'
});
```

Try now!

4. Fake data with Factories

```
$ ember g mirage-factory category
```

```js
// mirage/factories/category.js
import { Factory } from 'ember-cli-mirage';

export default Factory.extend({

  name(i) {return `Category ${i}`}

});
```

Let's update our default scenario:

```js
// mirage/scenarios/default.js
export default function(server) {

  server.createList('category', 10);
}
```

Check your app.

Update `mirage/config.js` with shorthand

```js
this.get('/categories');
```

Try to save a new category...

Check console.

Extend config

```js
this.post('/categories');
```

Try to delete a new category...

Check console.

Extend config

```js
this.del('/categories/:id');
```

Using Faker in Factory

Check [faker.js][faker_js]

```js
// mirage/factories/category.js
import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({

  name: faker.commerce.department
});
```

One more!

Replace `get`, `post` and `del` with a single `resource` shorthand:

```js
this.resource('categories');
```

### Add Bootstrap

In an earlier implementation, this repository used [`ember-bootstrap`][ember_bootstrap], but I felt it was a little bit too abstract. The latest version of this project uses [`ember-cli-bootstrap-sassy`][ember-cli-bootstrap-sassy].

More details: http://yoember.com/#ember-bootstrap-sass

```
$ ember install ember-cli-sass
$ ember install ember-cli-bootstrap-sassy
$ ember install ember-bootstrap-nav-link
$ echo '@import "bootstrap";' > ./app/styles/app.scss && rm ./app/styles/app.css
```

application.hbs
```handlebars
<nav class="navbar navbar-inverse navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse"
              aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      {{link-to 'Product App' 'index' class="navbar-brand"}}
    </div>

    <div class="collapse navbar-collapse" id="navbar-collapse">

      <ul class="nav navbar-nav">

        {{#nav-link-to 'index'}}Home{{/nav-link-to}}
        {{#nav-link-to 'admin'}}Admin{{/nav-link-to}}

      </ul>

    </div>
  </div>
</nav>

<div class="container">
  {{outlet}}
</div>
```

app.scss update

```
body {
  padding-top: 70px
}
```

admin.hbs

```
<ul class="nav nav-pills">
  {{#nav-link-to 'admin.categories'}}Categories{{/nav-link-to}}
  {{#nav-link-to 'admin.products'}}Products{{/nav-link-to}}
</ul>

<hr>

{{outlet}}
```

### Save Category record to database

We can update now our `addNewCategory` action in `app/routes/admin/categories.js`.

Because the `id` of the record is generated by the backend, in our case our mock database system, we can remove this param from our function and from our template also. We can use Ember Bootstrap components for building our form.

```handlebars
{{!-- app/templates/admin/categories.hbs --}}
<h1>Admin - Categories</h1>

<div class="well well-sm">

  <form class="form-inline" {{action 'addNewCategory' newCategoryName on='submit'}}>
    <div class="form-group">
      <label for="new-category">New category:</label>
      {{input type="text" class="form-control" id="new-category" placeholder="Category name" value=newCategoryName}}
    </div>
    <button type="submit" class="btn btn-default">Add</button>
  </form>
</div>

<table class="table table-striped">
  <caption>List of categories</caption>
  <thead>
  <tr>
    <th>#</th>
    <th>Name</th>
    <th>Actions</th>
  </tr>
  </thead>
  <tbody>
  {{#each model as |category|}}
    <tr>
      <td>{{category.id}}</td>
      <td>{{category.name}}</td>
      <td>
        <button class="btn btn-xs btn-danger" {{action 'deleteCategory' category}}>Del</button>
      </td>
    </tr>
  {{/each}}
  </tbody>
</table>

Number of categories: {{model.length}}
```

```js
// app/routes/admin/categories.js
import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.findAll('category');
  },

  actions: {

    addNewCategory(name) {
      this.store.createRecord('category', { name }).save();
    },

    deleteCategory(category) {
      category.destroyRecord();
    }
  }
});
```

There is a `.save()` which is a `Promise`, so we can use `.then` to manage the callback, when the server respond arrives.

```js
.then(
  category => console.log('Response:', category),
  error => console.log(error)
)
```

Server respond can be positive or negative. It can "fulfill" or "reject" our request. The `.then()` method has two params, both are callback functions. The first will get the positive respond with the record, the second will get an error respond. You can play with it with changing our mock server (mirage) settings. Mirage can simulate negative responds also.

You can read more about mirage's route handler and post shorthands on the following pages:
http://www.ember-cli-mirage.com/docs/v0.2.x/route-handlers/
http://www.ember-cli-mirage.com/docs/v0.2.x/shorthands/#post-shorthands

If you add the following line to your mirage config file, it responds with a `500` error, which is a brutal internal server error code. 

```js
// /app/mirage/config.js
this.post('categories', 'category', 500);
```

If you extend your `app/routes/admin/categories.js` Category route handler with the following code, you can write out in your console the error message from mirage.

```js
    addNewCategory(name) {
      this.store.createRecord('category', { name }).save().then(
        category => {
          console.info('Response:', category);
          this.controller.set('newCategoryName', '');
        },
        error => {
          console.error('Error from server:', error);
        });
    },
```

We can improve further our model to manage the positive and negative responses automatically.

Better practice, if we create an empty model in the store when the user entering the page. On our category list page, our main model is a list of categories, which arrived from the server, this list is automatically added to the controller's `model` property.
 
 We can use the `setupController` hook in the route handler, to create a new empty category also and we can manually add it to a property, what we name it as `newCategory`.

```js
// app/routes/admin/categories.js
  setupController(controller, model) {
    this._super(controller, model);

    controller.set('newCategory', this.store.createRecord('category'));
  },
```

Now we can update our template:

```handlebars
<!-- /app/templates/admin/categories.hbs -->
  <div class="well well-sm">
    <form class="form-inline" {{action 'addNewCategory' newCategory on='submit'}}>
      <div class="form-group">
        <label for="new-category">New category:</label>
        {{input type="text" class="form-control" id="new-category" placeholder="Category name" value=newCategory.name}}
      </div>
      <button type="submit" class="btn btn-default">Add</button>
    </form>
  </div>
```
And the action in route handler:

```js
    addNewCategory(newCategory) {
      newCategory.save().then(
        category => {
          console.info('Response:', category);
          this.controller.set('newCategory', this.store.createRecord('category'));
        },
        error => {
          console.error('Error from server:', error);
        });
    },
```

### Error and loading state

Using `isError` to show some error message on the page.

```handlebars
<!-- /app/templates/admin/categories.hbs -->
{{#if newCategory.isError}}
  Error!!
  {{#each newCategory.errors as |error|}}
    {{error}}
  {{/each}}
{{/if}}
```
Further options managing errors: `error.hbs` or `error` action. You can have an `error.hbs` in the main route our subroutes, Ember automatically will show that page if the server response with error. Other option is an `error` action in your route, if a request in `model()` hook is failed, this action will be called automatically. More details in the official guide: https://guides.emberjs.com/v2.9.0/routing/loading-and-error-substates/

There is a loading state also, you can show a loading spinner or a message while Ember is downloading data in `model()` hook. Drop a `loading.hbs` in your template folder and/or subfolders. Emulate a slow server with mirage. Uncomment this line in `app/mirage/config.js`: `this.timing = 400;` and rewrite 400 for 2000 (2 seconds).

### Filter out the empty record

Previously we modified our route handler and we added a `createRecord()` in `setupController()` hook. Actually, this created a new empty record, which appears in the list. However, Ember Data automatically add a few state helper to the records. We will use `isNew` to filter out this record from the list.

Update the template:

```handlebars
  {{#each model as |category|}}
    {{#unless category.isNew}}
      <tr>
        <td>{{category.id}}</td>
        <td>
          {{category.name}}
        </td>
        <td>
          <button class="btn btn-xs btn-danger" {{action 'deleteCategory' category}}>Del</button>
        </td>
      </tr>
    {{/unless}}
  {{/each}}
```

### Edit a record

Extend the category model:

```js
// app/models/category.js
import DS from 'ember-data';

export default DS.Model.extend({

  name: DS.attr('string'),

  isEditing: false

});
```

Edit the name of a category with clicking on the name or a dedicated button.

```handlebars
  {{#each model as |category|}}
    {{#unless category.isNew}}
      <tr>
        <td>{{category.id}}</td>
        <td {{action 'editCategory' category}}>
          {{#if category.isEditing}}
            {{input value=category.name}}
            <button {{action 'updateCategory' category}}>Save</button>
          {{else}}
            {{category.name}}
          {{/if}}
        </td>
        <td>
          <button class="btn btn-xs btn-danger" {{action 'deleteCategory' category}}>Del</button>
          <button class="btn btn-xs btn-success" {{action 'editCategory' category}}>Edit</button>
        </td>
      </tr>
    {{/unless}}
  {{/each}}
```

Add actions to the route handler:

```js
actions: {

    addNewCategory(newCategory) {
      newCategory.save().then(
        category => {
          console.info('Response:', category);
          this.controller.set('newCategory', this.store.createRecord('category'));
        },
        error => {
          console.error('Error from server:', error);
        });
    },

    editCategory(category) {
      category.set('isEditing', true);
    },

    updateCategory(category) {
      category.save().then(
        category => category.set('isEditing', false)
      );
    },

    deleteCategory(category) {
      category.destroyRecord();
    }
}
```

The actual state of the categories admin page:

![The categories admin page][step_3_1]

## <a name='homework-1'></a>Homework 1 - Create the Admin page for Products

Create the Admin page for Products. You should basically repeat almost the same steps what we followed while we have been building the Categories page. 

1. Generate `admin/products` route and update the navigation bar on admin pages.

2. Generate a `product` model with the following fields:
  - `name` (string)
  - `sku` (string) (Sku = stock keeping unit - usually this is the barcode number in a shop.)
  - `unitPrice` (number)

3. Mock product model and server calls with Mirage. (Use `ember generate mirage-model` and `ember generate mirage-factory`. Update the scenario and the config file in `mirage` folder. Check the Faker.js website and find a related method to generate random product names. Mirage should generate at least 20 products.)

4. List all the products on `admin/products` page. (You have to add code to your `admin/product` route handler and implement handlebar in the connected template.)

5. Add a form to the product list page, where you can create and save a new product, implement the connected actions.

6. Add editing feature to the list. Three columns are in this list (name, sku, price). It is a nice solution, if there is an Edit button at the end of the row and clicking on this button, the row became a form. When the row is in editing state buttons should be "Save" and "Cancel". Implement the connected actions also.

![A product in edit mode][step_3_2]

[A possible solution in this commit][homework_1_solution_commit_link]

## <a name='relationship'></a>Lesson 3 - Manage relationship with Ember Data

Related guide: [Ember.js Guide - Model Relationships][ember_guide_relationships]

**Requirements in this lesson:**

- [ ] Extend Ember.js models with `hasMany` and `belongsTo` references.
- [ ] Add the relationship to the mock, so Mirage can manage 
- [ ] Add a new option to Product form

**Steps:**

* Extend models.
* Add extra column to Product list.
* Update mirage models with associations
  - http://www.ember-cli-mirage.com/docs/v0.2.x/models/#associations
  - http://www.ember-cli-mirage.com/docs/v0.2.x/factories/#factories-and-relationships
* Update mirage factories with `afterCreate()` 
* Add extra column to Categories with `{{category.products.length}}` 
* Check server calls in console, too many, reduce it with adding `includes` option to `findAll` in `model` hook.
* Add a select box to the Product create form. (Using `emberx-select` addon.)

```bash
$ ember install emberx-select
```

https://github.com/thefrontside/emberx-select

```handlebars
    <div class="form-group">
      <label for="category">Category:</label>
      {{#x-select id="category" class="form-control" value=newProduct.category as |xs|}}
        {{#each categories as |category|}}
          {{#xs.option value=category}}
            {{category.name}}
          {{/xs.option}}
        {{/each}}
      {{/x-select}}
    </div>
```

## <a name='homework-2'></a>Homework 2: List products on the home page.

![List products on the homepage][homework_2]

- [ ] Generate an `index` route.
- [ ] Download all product in `model` hook.
- [ ] List on `index.hbs` so it will appear on the home page.
- [ ] Add some style, for example `panel` from Bootstrap.

[A possible solution in this commit][homework_2_solution_commit_link]

## <a name='filter'></a>Lesson 4 - Filter products with categories

WIP

## <a name='shopping-cart'></a>Lesson 5 - Creating a shopping cart service and add/remove products in shopping cart.

(draft)

**Reading:**

* [Services][official_guide_services]
* [Dependency Injection][official_guide_di]

**Implementation steps:**

- [ ] Create shopping cart service with add/remove functions.
- [ ] Inject in the application (routes, controllers, components), so it will be available everywhere.
- [ ] Implement an `Add to Cart` button and action in the product boxes on the home page. 
- [ ] Create a shopping-cart component, which will be available from everywhere, so we can remove items or finalize the order.
 
```bash
$ ember generate service shopping-cart
```

* Add button to the product panel
* Add action to the `index.js` 
* Inject shopping-cart service

* Add a badge to the navbar, but how we access to the `shoppingCart`

* Dependency Injection, initializer

```bash
$ ember generate initializer shopping-cart
```

* Modal Window implementation
* Named outlet
* Checkout template and controller

```shell
$ ember g template checkout
$ ember g controller checkout
```

* Render in application route
* Close modal window action

* List products from service
* Remove item from the service
* Passing the index instead of the product


[ember_guide]: https://guides.emberjs.com/v3.1.0/getting-started/core-concepts
[ember_cli_mock_server]: https://ember-cli.com/user-guide/#mocks-and-fixtures
[actions_official_guide]: https://guides.emberjs.com/v3.1.0/templates/actions/
[official_guide_models]: https://guides.emberjs.com/v3.1.0/models/
[official_guide_services]: https://guides.emberjs.com/v3.1.0/applications/services/
[official_guide_di]: https://guides.emberjs.com/v3.1.0/applications/dependency-injection/

[route_handler_api]: http://emberjs.com/api/classes/Ember.Route.html
[native_array_doc]: http://emberjs.com/api/classes/Ember.NativeArray.html

[yoember.com]: http://yoember.com
[ember_mirage]: http://www.ember-cli-mirage.com/
[faker_js]: https://github.com/marak/Faker.js/
[ember_bootstrap]: http://kaliber5.github.io/ember-bootstrap/
[ember-cli-bootstrap-sassy]: https://github.com/lifegadget/ember-cli-bootstrap-sassy

[homework_1_solution_commit_link]: https://github.com/zoltan-nz/product-app/commit/b52617e960401f0c1d0c749fc78ae96866b4a0e8

[homework_2_solution_commit_link]: https://github.com/zoltan-nz/product-app/commit/d3bd96182847716388f471a916132eaaaef73880

[ember_guide_relationships]: https://guides.emberjs.com/v3.1.0/models/relationships/

[ember_concept_image]: https://guides.emberjs.com/v3.1.0/images/ember-core-concepts/ember-core-concepts.png
[ember_store_image]: https://guides.emberjs.com/v2..0/images/guides/models/finding-unloaded-record-step1-diagram.png

[nested-template]: doc/nested-template-ember.png
[step_1]: doc/step_1.png
[step_2_1]: doc/step_2_1.png
[step_2_2]: doc/step_2_2.png
[step_2_3]: doc/step_2_3.png
[step_3_1]: doc/step_3_1.png
[step_3_2]: doc/step_3_2.png
[homework_2]: doc/homework_2.png
