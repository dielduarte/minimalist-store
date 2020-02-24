function assignWithGetters(target, ...sources) {
  sources.forEach(source => {
    Object.defineProperties(
      target,
      Object.keys(source).reduce((descriptors, key) => {
        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
        return descriptors;
      }, {})
    );
  });
  return target;
}

export default function createModel(obj) {
  let copy = assignWithGetters({}, obj);
  let subscribeMap = {};

  Object.defineProperty(copy, 'set', {
    set: v => (copy = { ...copy, ...v })
  });

  Object.defineProperty(copy, 'subscribe', {
    value: (fieldsList, callback) => {
      subscribeMap = {
        ...subscribeMap,
        [fieldsList.toString()]: callback
      };
    }
  });

  return new Proxy(copy, {
    get: function(target, prop) {
      return Reflect.get(target, prop);
    },
    set: function(target, prop, value) {
      if (prop !== 'set') return true;

      let changedKeysMap = [];
      let subscribeMapCopy = Object.assign({}, subscribeMap);

      const executeSubscribersForEachKey = k => ([subscribe, cb]) => {
        if (subscribe.includes(k)) {
          cb();
          delete subscribeMapCopy[subscribe];
        }
      };

      return Promise.all(
        Object.entries(value).map(([key, v]) => {
          return new Promise((resolve, reject) => {
            changedKeysMap.push(key);
            if (Reflect.set(target, key, v)) resolve(true);
            else reject(false);
          });
        })
      ).then(resolvers => {
        if (resolvers.every(Boolean)) {
          changedKeysMap.forEach(k => {
            Object.entries(subscribeMapCopy).forEach(
              executeSubscribersForEachKey(k)
            );
          });
        }
      });
    }
  });
}
