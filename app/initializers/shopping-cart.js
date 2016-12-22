export function initialize(application) {
  application.inject('route', 'shoppingCart', 'service:shopping-cart');
  application.inject('controller', 'shoppingCart', 'service:shopping-cart');
  application.inject('component', 'shoppingCart', 'service:shopping-cart');
}

export default {
  name: 'shopping-cart',
  initialize
};
