import createModel from 'minimalist-store';

const store = {
  name: 'Diel',
  age: 10,
  secondName: 'Duarte',
  get doubleAge() {
    return this.age * 2;
  }
};

const model = createModel(store);

setInterval(() => {
  model.set = { age: Math.random() };
}, 400);

model.subscribe(['age'], () => {
  console.log('AGE >>>', model.age);
});

model.subscribe(['name'], () => {
  console.log('NAME >>>', model.age);
});

setInterval(() => {
  model.set = { name: 'anything' };
}, 3000);
