import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.store.findAll('product');
  },

  actions: {

    addToShoppingCart(product) {

      // `shoppingCart` injected as a Service in initializer, so we can call it with this syntax
      this.shoppingCart.add(product);
    }
  }

});
