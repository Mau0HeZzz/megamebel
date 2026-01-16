import { resolve } from 'path'

const pages = [
  {name: 'index', path: resolve(__dirname, '../index.html')},
  {name: 'home', path: resolve(__dirname, '../pages/home.html')},
  {name: 'listing', path: resolve(__dirname, '../pages/listing.html')},
  {name: 'product', path: resolve(__dirname, '../pages/product.html')},
];

export default pages