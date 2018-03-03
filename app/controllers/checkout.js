import Controller from '@ember/controller';

export default Controller.extend({

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
