/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Maps from '../src/index';
import renderer from 'react-test-renderer';

// PromiseScript加载
function getAmapuiPromise() {
  const script = buildScriptTag(
    'https://webapi.amap.com/maps?v=1.4.15&key=4b26f928ce0449393eadd00a763cb6e3&plugin=AMap.Driving'
  );
  const p = new Promise(resolve => {
    script.onload = () => {
      resolve();
    };
  });
  document.body.appendChild(script);
  return p;
}
// 创建script标签
function buildScriptTag(src: string) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.src = src;
  return script;
}

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

const options = {
  path,
  donePath,
  position: {
    show: true,
    LT: [108.939621, 34.343147],
  },
};

describe('it', () => {
  it('正常渲染', () => {
    // 加载高德后执行
    getAmapuiPromise().then(() => {
      initDemo();
    });
    function initDemo() {
      const div = document.createElement('div');
      ReactDOM.render(<Maps {...options} />, div);
      ReactDOM.unmountComponentAtNode(div);
    }
  });

  test('快照存储', () => {
    // 加载高德后执行
    getAmapuiPromise().then(() => {
      initDemo();
    });

    function initDemo() {
      const component = renderer.create(<Maps {...options} />);
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
      // re-rendering
      // tree = component.toJSON();
      // expect(tree).toMatchSnapshot();
      // manually trigger the callback
      // tree.props.onMouseLeave();
      // re-rendering
      // tree = component.toJSON();
      // expect(tree).toMatchSnapshot();
    }
  });
});
