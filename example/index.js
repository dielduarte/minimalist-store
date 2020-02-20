import createModel, { onChangeEventName } from 'minimalist-store';

const store = {
  name: 'Diel',
  age: 10,
  get doubleAge() {
    return this.age * 2;
  }
};

const model = createModel(store);

setInterval(() => {
  model.set = { name: 'Laryssa', age: Math.random() };
}, 400);

window.addEventListener(onChangeEventName, () => {
  console.log('new update >>>>', model, model.doubleAge);
});
