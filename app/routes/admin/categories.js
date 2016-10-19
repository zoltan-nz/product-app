import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.findAll('category');
  },

  actions: {

    addNewCategory(name) {
      this.store.createRecord('category', { name }).save();
    },

    deleteCategory(category) {
      category.destroyRecord();
    }
  }
});
