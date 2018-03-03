import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({

  name: faker.commerce.productName,
  sku: faker.random.uuid(),
  unitPrice: faker.commerce.price,

  afterCreate(product /*, server */) {
    product.categoryId = faker.random.number({min: 1, max: 10});
    product.save();
  }
});
