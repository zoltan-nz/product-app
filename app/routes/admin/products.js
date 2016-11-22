import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.findAll('product');
  },

  setupController(controller, model) {
    this._super(controller, model);

    controller.set('newProduct', this.store.createRecord('product'));
  },

  actions: {

    addNewProduct(newProduct) {
      newProduct.save().then(
        product => {
          console.info('New product saved: ', product);

          // Reset the `newProduct` property with an empty record.
          this.controller.set('newProduct', this.store.createRecord('product'));
        },
        error => {
          console.error('Error from server:', error);
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
