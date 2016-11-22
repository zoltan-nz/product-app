import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  sku: DS.attr('string'),
  unitPrice: DS.attr('number'),

  isEditing: false
});
