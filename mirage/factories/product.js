import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({

  name() { return faker.commerce.productName(); },
  sku() { return faker.random.uuid(); },
  unitPrice() { return faker.commerce.price(); }

});
