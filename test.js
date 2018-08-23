var ActiveRecordLite = require('./index.js');
var chai = require('chai');
var should = chai.should();

describe('ActiveRecordLite', function() {
  var ar;
  var collection;

  before(function() {
    collection = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        occupation: 'plumber',
        birthday: new Date('December 17, 1995'),

      },
      {
        id: 2,
        firstName: 'James',
        lastName: 'White',
        occupation: 'pastor',
        birthday: new Date('May 14, 1981'),
      },
      {
        id: 3,
        firstName: 'Mario',
        lastName: 'Luigi',
        occupation: 'plumber',
        birthday: new Date('January 20, 1975'),
      },
    ];

    ar = new ActiveRecordLite(collection);
  });

  describe('#find', function() {
    it('retrieves an object by its id', function() {
      ar.find(1).should.eql([collection[0]]);
    });

    it('returns an empty array for an id that does not exist', function() {
      ar.find(100).should.eql([]);
    });
  });

  describe('#where', function() {
    it('retrieves a list of objects based on a specified property', function() {
      ar.where({occupation: 'plumber'}).render().length.should.equal(2);
    });

    it('retrieves a list of objects based on multiple properties', function() {
      ar.where({occupation: 'plumber', firstName: 'Mario'}).render().length.should.equal(1);
    });

    it('returns an empty list when there are no matches', function() {
      ar.where({firstName: 'David'}).render().should.eql([]);
    });
  })

  describe('#not', function() {
    it('returns a list with the specified property excluded', function() {
      ar.not(function(item) {
        return item.occupation == 'plumber';
      }).render().length.should.equal(1);
    });
  });

  describe('#order', function() {
    it('returns an empty list if the attribute does not exist', function() {
      ar.order('foo').render().length.should.equal(0);
    });

    it('orders the objects in descending order by default', function() {
      ar.order('id').render().map((obj) => obj.id).should.eql([1, 2, 3]);
    });

    it('can return the objects based in descending order', function() {
      ar.order('id', 'desc').render().map((obj) => obj.id).should.eql([3, 2, 1]);
    });

    it('orders attributes whose values are strings', function() {
      ar.order('firstName', 'asc').render().map((obj) => obj.firstName).should.eql(['James', 'John', 'Mario']);
    });
  });

  describe('#pluck', function() {
    it('returns an array of single attributes', function() {
      ar.pluck('firstName').render().should.eql([{firstName: 'John'}, {firstName: 'James'}, {firstName: 'Mario'}]);
    });

    it('returns an array of multiple attributes', function() {
      ar.pluck('id', 'firstName', 'lastName').render().should.eql([
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        id: 2,
        firstName: 'James',
        lastName: 'White',
      },
      {
        id: 3,
        firstName: 'Mario',
        lastName: 'Luigi',
      },
      ]);
    });
  });

  describe('#group', function() {
    it('groups ActiveRecordLite objects by an attribute', function() {
      Object.keys(ar.group('occupation')).length.should.equal(2);
    });
  });
});
