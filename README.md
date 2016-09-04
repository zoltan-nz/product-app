# Product App

We are going to build a web application which could be a web-shop or a product management app. We can add products, they can belong to a category. We can manage categories also. First of all let's focus on the administration area, later we build the "store front" where a user can collect products in a shopping cart.
 
I suppose, you already finished the [Ember.js Tutorial][yoember.com], where you built the Library App, so you know roughly how we build Ember application on "Ember Way". For this reason, I don't explain everything, we can focus only the main steps. (It means, you will see all the steps with less explanation. ;)

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

* [x] Admin user can navigate to `/admin`
* [ ] Admin user can CRUD (create, read, update, delete) `categories` on `/admin/categories`
* [ ] Admin user can CRUD `products` on `/admin/products`
* [ ] Admin user can change the `category` of a `product`
* [ ] User can see the list of products on the `home` (`index`)
* [ ] User can filter the list of products clicking on a `category`

## 1. Home page and Admin page

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

## 2. Categories Page and CRUD interface

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

Brilliant, you can add and remove items from an array model, however if you reload the page, all added data is gone.

[yoember.com]: http://yoember.com
[nested-template]: doc/nested-template-ember.png
[ember_guide]: https://guides.emberjs.com/v2.7.0/getting-started/core-concepts
[ember_concept_image]: https://guides.emberjs.com/v2.7.0/images/ember-core-concepts/ember-core-concepts.png
[ember_cli_mock_server]: https://ember-cli.com/user-guide/#mocks-and-fixtures
[ember_mirage]: http://www.ember-cli-mirage.com/
[route_handler_api]: http://emberjs.com/api/classes/Ember.Route.html
[actions_official_guide]: https://guides.emberjs.com/v2.7.0/templates/actions/
[native_array_doc]: http://emberjs.com/api/classes/Ember.NativeArray.html

[step_1]: doc/step_1.png
[step_2_1]: doc/step_2_1.png
[step_2_2]: doc/step_2_2.png
[step_2_3]: doc/step_2_3.png
