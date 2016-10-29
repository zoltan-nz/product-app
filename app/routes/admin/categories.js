import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.findAll('category');
  },

  setupController(controller, model) {
    this._super(controller, model);

    controller.set('newCategory', this.store.createRecord('category'));
  },

  actions: {

    addNewCategory(newCategory) {
      newCategory.save().then(
        category => {
          console.info('Response:', category);
          this.controller.set('newCategory', this.store.createRecord('category'));
        },
        error => {
          console.error('Error from server:', error);
        });
    },

    editCategory(category) {
      category.set('isEditing', true);
    },

    updateCategory(category) {
      category.save().then(
        category => category.set('isEditing', false)
      );
    },

    deleteCategory(category) {
      category.destroyRecord();
    }

    // error() {
    //   console.log('error');
    // }

  }
});
