a minimalist store using as maximum as possible of native object features + Proxy

## Usage Example

```js
import createModel from 'minimalist-store';

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
  model.set = { age: Math.random() };
}, 400);

// add a subscribe by fields that you wanna do something when updated
// subscribe can be used multiple times, 
// passing a list of fields to watch
model.subscribe(['age'], () => {
  console.log('new change >>>', model.doubleAge);
});

```