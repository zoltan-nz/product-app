import Service from '@ember/service';

export default Service.extend({

  items: null,

  init() {
    this.items = [];
  },

  add(product) {
    this.items.pushObject(product);
  },

  remove(product) {
    this.items.removeObject(product);
  },

  empty() {
    this.items.clear();
  },

  reset() {
    this.items = [];
  },
});
