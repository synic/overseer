import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    const legalities = [];
    if (serialized !== undefined) {
      serialized.forEach((legality) => {
        if (legality.legality !== 'Banned') {
          let format = legality.format;
          if (legality.legality === 'Restricted') {
            format += ' (Restricted)';
          }
          legalities.push(format);
        }
      });
    }

    return legalities.join(', ');
  },

  serialize(deserialized) {
    // TODO: this will break if we ever try to create a record
    // using this serializer.
    return deserialized;
  }
});
