import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {

    removeItem(product) {
      this.shoppingCart.remove(product);
    },

    clear() {
      this.shoppingCart.reset();
    },

    order() {

      // Does nothing... ;)
      this.shoppingCart.reset();
      this.send('closeCheckout');
    }
  }
});
