import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Maps from '../.';

import '../dist/mapLine.min.css'
const path = [
  {
      iconText:'起',
      title:'重庆',
      LT:[106.550464,29.563761],
  },
  {
      iconText:'转',
      title:'西安',
      LT:[108.939621,34.343147],
  },
  {
      iconText:'支',
      title:'郑州',
      theme:6,
      LT:[116.438068,39.706265],
  },
  {
      iconText:'干',
      title:'潍坊',
      theme:8,
      LT:[119.107078,36.70925],
  },
  {
      iconText:'干',
      theme:9,
      LT:[120.374402,36.168923],
      title:'青岛'
  },
  {
      iconText:'终',
      title:'武汉',
      theme:12,
      LT:[114.30219,30.572921],
  },
]

const donePath = [
{
  LT:[106.550464,29.563761],
},
{
  LT:[108.939621,34.343147],
},
]

const options = {
path,
donePath,
position:{
  show: true,
  LT: [108.939621,34.343147],
},
}


const App = () => {
  return (
    <div>
      <Maps {...options} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
