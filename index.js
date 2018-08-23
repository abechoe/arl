class ActiveRecordLite {
  constructor(collection) {
    this.collection = collection;
  }

  find(id) {
    return this.collection.filter((item) => item.id === id);
  }

  where(properties) {
    const matches = this.collection.filter(function(item) {
      let allMatch = true;

      for(let property in properties) {
        if ((!property in item) || item[property] !== properties[property]) {
          allMatch = false;
        }
      }

      return allMatch;
    });

    return new ActiveRecordLite(matches);
  }

  not(callback) {
    const newList = this.collection.filter(function(item) {
      return !callback(item);
    });

    return new ActiveRecordLite(newList);
  }

  order(attr, direction) {
    let orderedList;


    if (this.collection.some((item) => !(attr in item))) {
      orderedList = [];
      return new ActiveRecordLite(orderedList);
    }

    if (!direction || direction === 'asc') {
      orderedList = this.collection.slice().sort(function(firstItem, secondItem) {
        return ('' + firstItem[attr]).localeCompare(secondItem[attr]);
      });
    } else if (direction === 'desc') {
      orderedList = this.collection.slice().sort(function(firstItem, secondItem) {
        return ('' + secondItem[attr]).localeCompare(firstItem[attr]);
      });
    } else {
      orderedList = this.collection;
    }

    return new ActiveRecordLite(orderedList);
  }

  pluck(...args) {
    const pluckedList = this.collection.map(function(item) {
      return args.reduce(function(newObj, property) {
        if (property in item) {
          newObj[property] = item[property];
        }

        return newObj;
      }, {});
    });

    return new ActiveRecordLite(pluckedList);
  }

  group(attr) {
    // first, get all the different values of this passed in attribute
    const attrValues =  this.collection.map(function(item) {
      if (attr in item) {
        return item[attr];
      }
    });

    // get unique values from this array:
    const uniques = attrValues.filter(function(value, index) {
      return attrValues.indexOf(value) === index;
    });

    const self = this;
    const groups = uniques.reduce(function(newObj, category) {
      newObj[category] = self.where({[attr]: category});
      return newObj;
    }, {});

    return groups;
  }

  render() {
    return this.collection;
  }
}

module.exports = ActiveRecordLite;