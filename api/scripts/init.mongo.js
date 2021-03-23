/* eslint linebreak-style: ["error", "windows"] */
/* global db print */
/* eslint no-restricted-globals: "off" */

db.products.remove({});

const productsDB = [
  {
    id: 1,
    category: 'shirt',
    name: 'XYZ',
    price: 500,
    image: 'https://www/google.com',
  },
  {
    id: 2,
    category: 'jeans',
    name: 'ABC',
    price: 800,
    image: 'https://www/google.com',
  },
];

db.products.insertMany(productsDB);
const count = db.products.count();
print('The New entry has been inserted ', count, 'products');
db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });
db.products.createIndex({ id: 1 }, { unique: true });
