# Product App

```shell
$ ember new product-app
```

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

* [x] Admin user can navigate to `/admin`
* [ ] Admin user can CRUD `categories` on `/admin/categories` 
* [ ] Admin user can CRUD `products` on `/admin/products`
* [ ] Admin user can change the `category` of a `product`
* [ ] User can see the list of products on the `home` (`index`)
* [ ] User can filter the list of products clicking on a `category`

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

Create an `admin` route, add a header to the main page and add a link to the `application` template.

```shell
ember g route admin
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

### `admin/categories` page

Create a categories page under admin route and add a link to the main admin page.

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
