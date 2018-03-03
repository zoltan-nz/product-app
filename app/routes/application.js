import Route from '@ember/routing/route';

export default Route.extend({

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
