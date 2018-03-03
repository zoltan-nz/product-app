import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return hash({
      products: this.store.findAll('product'),
      categories: this.store.findAll('category')
    });
  },

  setupController(controller, hash) {
    const model = hash.products;
    const categories = hash.categories;

    this._super(controller, model);

    controller.set('newProduct', this.store.createRecord('product'));
    controller.set('categories', categories);
  },

  actions: {

    addNewProduct(newProduct) {
      newProduct.save().then(
        product => {
          console.info('New product saved: ', product); // eslint-disable-line no-console

          // Reset the `newProduct` property with an empty record.
          this.controller.set('newProduct', this.store.createRecord('product'));
        },
        error => {
          console.error('Error from server:', error);  // eslint-disable-line no-console
        });
    },

    editProduct(product) {
      product.set('isEditing', true);
    },

    cancelEditing(product) {
      product.rollbackAttributes();
      product.set('isEditing', false);
    },

    updateProduct(product) {
      product.save().then(
        product => product.set('isEditing', false)
      );
    },

    deleteProduct(product) {
      product.destroyRecord();
    }
  }
});
