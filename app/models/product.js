import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  sku: attr('string'),
  unitPrice: attr('number'),

  category: belongsTo('category'),

  isEditing: false
});
