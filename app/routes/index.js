import Ember from 'ember';

export default Ember.Route.extend({

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
