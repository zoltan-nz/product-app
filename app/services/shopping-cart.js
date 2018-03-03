import Service from '@ember/service';

export default Service.extend({

  items: null,

  add(product) {
    this.get('items').pushObject(product);
    this.set('items', [])
  },

  remove(product) {
    this.get('items').removeObject(product);
  },

  empty() {
    this.get('items').clear();
  },

  reset() {
    this.set('items', []);
  }
});
