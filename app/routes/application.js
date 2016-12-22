import Ember from 'ember';

export default Ember.Route.extend({

  actions: {

    openCheckout() {
      this.render('checkout', {
        into: 'application',
        outlet: 'modal',
        controller: 'checkout'
      });
    },

    closeCheckout() {
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
