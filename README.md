
maplib2
===========

![CI](https://github.com/nihaojob/mapLine/workflows/CI/badge.svg)
[![License](https://img.shields.io/github/license/nihaojob/mapLine)](https://www.npmjs.com/package/maplib2)
![issues](https://img.shields.io/github/issues/nihaojob/mapLine)
[![GitHub forks](https://img.shields.io/github/forks/nihaojob/mapLine)](https://github.com/nihaojob/mapLine/network)
[![GitHub stars](https://img.shields.io/github/stars/nihaojob/mapLine)](https://github.com/nihaojob/mapLine/stargazers)
![Vsersion](https://img.shields.io/badge/npm-0.1.3-green)


### 概述
[文档](http://nihaojob.gitee.io/carui/#/carui/maps?anchor=%E4%BB%A3%E7%A0%81%E6%BC%94%E7%A4%BA)，一个基于高德地图的线路展示React组件。

更便捷的完成地图展示的开发，**不需要再学习高德的Api**。
<img src="http://nihaojob.gitee.io/carui/demo.png" width="75%"  />


### 起步

1. 引入高德SDK
需要在页面中引入高德SDK文件，并修改为你的Key。

```html
<!-- html部分添加 -->
<script src="https://webapi.amap.com/maps?v=1.4.15&key=你的key&plugin=AMap.Driving"></script>
```

2. 安装
```bash
# use Npm
$ npm install maplib2

# or Yarn
$ yarn add maplib2
```

3. 使用
```js
import Maplib2 from 'maplib2'
import 'maplib2/dist/mapLine.min.css'

<Maplib2 {...options} />
```

## 代码演示

[示例](http://nihaojob.gitee.io/carui/#/carui/maps?anchor=%E4%BB%A3%E7%A0%81%E6%BC%94%E7%A4%BA)

```tsx
import Maplib2 from 'maplib2'
import 'maplib2/dist/mapLine.min.css'

// 重庆--西安--郑州--济南--潍坊--青岛--潍坊
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

export default () => <Maps {...options} />;
```


## API

属性如下

| 参数         | 说明               | 类型    |  默认值 |
| ------------| ------------------ | ------ |--------|
| path        | 路径数据           | `Array`   |          |
| pathColor   | 路径颜色           | `String`  | `#1890ff`  |
| donePath    | 已完成路径         | `Array`   |           |
| donePathColor | 已完成路径颜色    | `String`  |`#bfbfbf` |
| marker       | 节点样式          | `Object`   |       |
| anime        | 轨迹回放          | `Object`   |       |
| animeMarker  | 获取回放节点动画对象 | `Function`  |       |
| position     | 当前位置          | `Object`   |       |


### path


| 参数      | 说明               | 类型    |  默认值 |
| -------- | ------------------ | ------ |--------|
| iconText | 图标文字            |`String`  |       |
| title    | mark文字            |`String` |       |
| LT       | 坐标 [经度,纬度]     |`Array`   |        |
| theme     | 主题 1-12          |`number` |随机分配  |

### donePath

| 参数      | 说明               | 类型    |  默认值 |
| -------- | ------------------ | ------ |--------|
| LT       | 坐标 [经度,纬度]     |`Array`   |        |

### marker

| 参数      | 说明               | 类型    |  默认值 |
| -------- | ------------------ | ------ |--------|
| show     | marker显示/隐藏      |`Boolean`|`true`  |
| styles   | marker主题(暂未开放) |`String` |        |


### anime

| 参数      | 说明               | 类型    |  默认值 |
| -------- | ------------------ | ------ |--------|
| show     | 显示/隐藏            |`Boolean`|`true`  |
| icon     | 节点图标             |`String` |        |
| pathColor| 回放后的路径颜色      | `String` | `#722ed1`|
| type     | 回放路径 `path` || `donePath`   | `String` | `path`|


### position

| 参数      | 说明               | 类型    |  默认值 |
| -------- | ------------------ | ------ |--------|
| show     | 显示/隐藏            |`Boolean`|`true`  |
| icon     | 节点图标             |`String` |        |
| LT       | 坐标 [经度,纬度]     |`Array`   |        |



## ToDoList
- [X] 隐藏展示配置
- [X] 颜色配置
- [X] 无途经点
- [X] 添加第一版文档
- [X] 发布npm
- [x] NPM 文档更新
- [x] TypeScript 类型抽出
- [x] 关键字搜索
- [ ] Jest 测试用例增加 快照未生效，增加测试用例debug方式
- [ ] 多条线路配置


## Licensed

MIT.

