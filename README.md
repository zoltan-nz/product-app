# Products App

```
$ ember new products-app
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
|`payed`|boolean
|`lineItems`|hasMany
|`total`|number

|`lineItem`||
|---|---
|`shoppingCart`|belongsTo
|`product`|belongsTo
|`quantity`|number
|`sum`|number

## Requirements

* [ ] Admin user can navigate to `/admin`
* [ ] Admin user can CRUD `categories` on `/admin/categories` 
* [ ] Admin user can CRUD `products` on `/admin/products`
* [ ] Admin user can change the `category` of a `product`
* [ ] User can see the list of products on the `home` (`index`)
* [ ] User can filter the list of products clicking on a `category`
