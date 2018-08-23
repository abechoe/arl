class ActiveRecordLite {
  constructor(collection) {
    this.collection = collection;
  }

  find(id) {
    return this.collection.filter((item) => item.id === id);
  }

  where(properties) {
    let matches = [];

    this.collection.forEach(function(object) {
      let allMatch = true;

      for (let property in properties) {
        if (!(property in object) || object[property] !== properties[property]) {
          allMatch = false;
        }
      }

      if (allMatch) {
        matches.push(object);
      }
    });

    return new ActiveRecordLite(matches);
  }

  not(callback) {
    let newList = [];

    this.collection.forEach(function(item) {
      if (!callback(item)) {
        newList.push(item);
      }
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
    let pluckedList;

    pluckedList = this.collection.map(function(item) {
      let newObj = {};

      args.forEach(function(property) {
        if (property in item) {
          newObj[property] = item[property];
        }
      });

      return newObj;
    });

    return new ActiveRecordLite(pluckedList);
  }

  group(attr) {
    // first, get all the different values of this passed in attribute
    let attrValues =  this.collection.map(function(item) {
      if (attr in item) {
        return item[attr];
      }
    });

    // get unique values from this array:
    let uniques = [];
    attrValues.forEach(function(value) {
      if (uniques.indexOf(value) === -1) {
        uniques.push(value);
      }
    });

    let groups = {};
    uniques.forEach(function(category) {
      groups[category] = this.where({[attr]: category});
    }, this);

    return groups;
  }

  render() {
    return this.collection;
  }
}

module.exports = ActiveRecordLite;