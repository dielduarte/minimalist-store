a minimalist store using as maximum as possible of native object features + Proxy

## Usage Example

```js
import createModel, { onChangeEventName } from 'minimalist-store';

const store = {
  name: 'Diel',
  age: 10,
  get doubleAge() {
    return this.age * 2;
  }
};

const model = createModel(store);

// randomly generating a new `age` value each 400ms, just to test

setInterval(() => {
  model.set = { name: 'Laryssa', age: Math.random() };
}, 400);

window.addEventListener(onChangeEventName, () => {
  console.log('new update >>>>', model, model.doubleAge);
});

```