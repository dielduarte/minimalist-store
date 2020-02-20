export const onChangeEventName = 'minimalistOnChange';

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

  Object.defineProperty(copy, 'set', {
    set: v => (copy = { ...copy, ...v })
  });

  return new Proxy(copy, {
    get: function(target, prop) {
      return Reflect.get(target, prop);
    },
    set: function(target, prop, value) {
      if (prop === 'set') {
        Promise.all(
          Object.entries(value).map(([key, v]) => {
            return new Promise((resolve, reject) => {
              if (Reflect.set(target, key, v)) resolve(true);
              else reject(false);
            });
          })
        ).then(resolvers => {
          if (resolvers.every(Boolean)) {
            window.dispatchEvent(new CustomEvent(onChangeEventName));
          }
        });
      }

      return true;
    }
  });
}
