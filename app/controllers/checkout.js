import Ember from 'ember';

export default Ember.Controller.extend({

actions: {
  removeItem(product) {
    this.shoppingCart.remove(product);
  }
}
});
