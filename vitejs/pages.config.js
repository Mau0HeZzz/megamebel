import { resolve } from 'path'

const pages = [
  {name: 'index', path: resolve(__dirname, '../index.html')},
  {name: 'home', path: resolve(__dirname, '../pages/home.html')},
];

export default pages