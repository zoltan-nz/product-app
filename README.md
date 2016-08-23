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


[yoember.com]: http://yoember.com
[nested-template]: doc/nested-template-ember.png
[step_1]: doc/step_1.png
[step_2_1]: doc/step_2_1.png
