import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Maps from '../.';

import '../dist/mapLine.min.css';
import './index.less';
const path = [
  {
    iconText: '起',
    title: '重庆',
    LT: [106.550464, 29.563761],
  },
  {
    iconText: '转',
    title: '西安',
    LT: [108.939621, 34.343147],
  },
  {
    iconText: '支',
    title: '郑州',
    theme: 6,
    active: true,
    LT: [116.438068, 39.706265],
  },
  {
    iconText: '干',
    title: '潍坊',
    theme: 8,
    LT: [119.107078, 36.70925],
  },
  {
    iconText: '干',
    theme: 9,
    LT: [120.374402, 36.168923],
    title: '青岛',
  },
  {
    iconText: '终',
    title: '武汉',
    theme: 12,
    LT: [114.30219, 30.572921],
  },
];

const donePath = [
  {
    LT: [106.550464, 29.563761],
  },
  {
    LT: [108.939621, 34.343147],
  },
];

const textPath = [
  {
    keyword: '济南',
    city: '济南',
    title: '济南',
    iconText: '起',
    tmpl: function utliTmpl(markItem: {
      iconText: String;
      title: String;
      theme?: 1 | undefined;
    }) {
      const { title } = markItem;
      return `<div class="tmplItem">${title}</div>`;
    },
  },
  {
    keyword: '石家庄',
    city: '石家庄',
    title: '1111',
    iconText: '仓',
  },
  {
    keyword: '郑州',
    city: '郑州',
    title: '1111',
    iconText: '仓',
    active: true,
    theme: 7,
  },
  {
    keyword: '长沙',
    city: '长沙',
    title: '1111',
    iconText: '仓',
    theme: 9,
  },
  {
    keyword: '广州',
    city: '广州',
    title: '1111',
    iconText: '重',
    theme: 5,
  },
];

const options = {
  //   path,
  path: textPath,
  keyword: true,
  donePath: [
    {
      keyword: '济南',
      city: '济南',
    },
    {
      keyword: '石家庄',
      city: '石家庄',
    },
  ],
  position: {
    show: true,
    LT: [108.939621, 34.343147],
  },
};

const options1 = {
  path,
  donePath,
  position: {
    show: true,
    LT: [108.939621, 34.343147],
  },
};

const App = () => {
  return (
    <div>
      <div>关键字</div>
      <Maps {...options} />
      <div>坐标</div>
      <Maps {...options1} />
      {/* <Maps {...options} /> */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
