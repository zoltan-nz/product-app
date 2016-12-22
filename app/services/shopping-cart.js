import Ember from 'ember';

export default Ember.Service.extend({

  items: [],

  add(product) {
    this.get('items').pushObject(product);
  },

  remove(product) {
    this.get('items').removeObject(product);
  },

  empty() {
    this.get('items').clear();
  }
});
