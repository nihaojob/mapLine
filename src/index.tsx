import React from 'react';
import _ from 'lodash';
import './index.less';

declare let AMap: any;

interface IEntranceState {
  elId: string;
}

interface donePathItem {
  LT: number[];
}

interface pathItem extends donePathItem {
  iconText: string;
  title: string;
  theme?: number;
}

interface anime {
  show?: boolean;
  icon?: string;
  pathColor?: string;
  type?: 'path' | 'done';
  movealong?: () => void;
}

interface defaultOptions {
  keyword?: boolean;
  style?: React.CSSProperties;
  path: Array<pathItem>;
  pathColor?: string;
  donePath?: Array<donePathItem>;
  donePathColor?: string;
  marker?: {
    show?: boolean;
    styles?: any;
  };
  anime?: anime;
  animeMarker?: Function;
  position?: {
    // 当前坐标
    show?: boolean;
    icon?: string;
    LT: number[];
  };
  allLine?: any;
  complete?: (event: any) => void;
}

interface ITextPaperProps extends defaultOptions {}

class Maps extends React.Component<ITextPaperProps, IEntranceState, any> {
  map: {
    setFitView: Function;
  };
  options: any;
  constructor(props: Readonly<ITextPaperProps>) {
    super(props);
    this.state = {
      elId: String(Math.random()).split('.')[1],
    };

    const defaultOptions: defaultOptions = {
      keyword: false,
      style: {},
      path: [],
      pathColor: '#1890ff',
      donePath: [],
      donePathColor: '#bfbfbf',
      marker: {
        show: true,
        styles: '', // 自定义主题 未来配置多个UI样式
      },
      anime: {
        // 路径回放
        show: false,
        icon: 'https://webapi.amap.com/images/car.png',
        pathColor: '#722ed1',
        type: 'path', // path done 沿着回放
      },
      position: {
        // 当前坐标
        show: false,
        icon: 'https://webapi.amap.com/images/car.png',
        LT: [],
      },
    };

    this.options = _.merge(defaultOptions, props);
    this.map = {
      setFitView: () => {},
    };
  }

  public componentDidMount() {
    this.createdMap();
    // 单条线路
    this.options.keyword ? this.keywordLine() : this.ployOneLine();
  }

  // 坐标渲染入口
  public ployOneLine() {
    const options = this.options;
    const mainParam = this.dataToParams(options.path);
    const doneParam = this.dataToParams(options.donePath);

    this.getDrivLineData(mainParam, (path: any, source: any) => {
      this.getDrivLineData(doneParam, (path2: any) => {
        this.initStepMap(path, path2, source);
      });
    });
  }

  // 关键字渲染入口
  public keywordLine() {
    // 汉字搜索
    this.getDrivLineData(...this.options.path, (path: any, source: any) => {
      console.log(...this.options.donePath,'this.options.donePath');
      this.getDrivLineData(...this.options.donePath, (path2: any) => {
        console.log(2222);
        this.initStepMap(path, path2, source);
      });
    });
  }

  // 坐标与关键字公共方法
  public initStepMap(path: any, donePath: any, source: any) {
    const { options } = this;
    // 绘制全长线路
    const routeLine = this.ployLine(path, options.pathColor);
    const donePathLine = this.ployLine(donePath, options.donePathColor);
    this.map.setFitView([routeLine, donePathLine]);

    // 动画展示 灰色或者全部
    if (options.anime.show) {
      const carAnime = (pathData: any) => {
        const carMarker = this.carAnime(pathData, options.anime.pathColor);
        this.props.animeMarker && this.props.animeMarker(carMarker);
      };
      options.anime.type === 'path' && carAnime(path);
      options.anime.type === 'done' && carAnime(donePath);
    }
    // 当前车坐标
    options.position.show && this.addCarIndex(options.position.LT);

    // marke添加
    const markArr = [source.start, ...source.waypoints, source.end].map(
      (item, index) => {
        const pathIndexItem = options.path[index];
        // 选中增加当前汽车图表
        if (pathIndexItem.active) {
          const { lat, lng } = item.location;
          this.addCarIndex([lng, lat]);
        }
        return {
          LT: item.location,
          title: item.name,
          ...pathIndexItem,
        };
      }
    );

    if (options.marker.show) {
      this.addMarke(markArr);
    }
    options.complete &&
      options.complete({ path, donePath, source, markArr, map: this.map });
  }

  public dataToParams(options: any[]) {
    if (!options[0].hasOwnProperty('keyword')) {
      return this.lineUtil(options).param;
    } else {
      return options;
    }
  }

  // 创建地图
  public createdMap() {
    const map = new AMap.Map(this.state.elId, {
      // center: [116.397559, 39.89621],
      zoom: 14,
      mapStyle: 'amap://styles/whitesmoke', // 主题
      showLabel: false, // 隐藏label
    });
    AMap.plugin(['AMap.ToolBar'], function() {
      // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
      map.addControl(
        new AMap.ToolBar({
          // 简易缩放模式，默认为 false
          liteStyle: true,
        })
      );
    });
    this.map = map;
    return map;
  }

  // 取值方式修改，LT坐标转换
  public lineUtil(lineArr: any) {
    // 坐标转换 后续使用
    const lineArrCopy = [...lineArr].map(item => {
      item.LT = new AMap.LngLat(item.LT[0], item.LT[1]);
      return item;
    });
    // 切分开始、结束、途径点
    const [start, ...waypoints] = lineArrCopy;
    const end = waypoints.pop();
    return {
      start,
      end,
      lineArrCopy: [...lineArrCopy],
      waypoints,
      // getDrivLineData 需要的数据格式
      param: [
        start.LT,
        end.LT,
        {
          waypoints:
            waypoints.length !== 0 ? waypoints.map(item => item.LT) : [],
        },
      ],
    };
  }

  // 获取导航数据
  public getDrivLineData(option: any = [], cb?: Function) {
    let cbfn: any = cb || function() {};
    if (arguments.length === 1) {
      return option([], null);
    }
    const driving = createDriv();
    // 参数拼接
    let param = [];
    // 适配关键字搜索
    if (arguments.length > 2) {
      const optionArr = [...Array.from(arguments)];
      cbfn = optionArr.pop();
      param = [optionArr, successFn];
    } else {
      param = [...option, successFn];
    }

    // 搜索
    driving.search(...param);

    // 返回结果处理函数
    function successFn(status: string, result: { routes: string | any[] }) {
      if (status === 'complete') {
        if (result.routes && result.routes.length) {
          // 绘制第一条路线，也可以按需求绘制其它几条路线
          const path = parseRouteToPath(result.routes[0]);
          cbfn(path, result);
        }
      } else {
        // log.error('获取驾车数据失败：' + result)
      }
    }

    // 创建线路规划
    function createDriv() {
      const drivingOption = {
        policy: AMap.DrivingPolicy.LEAST_TIME,
        ferry: 1, // 是否可以使用轮渡
        province: '京', // 车牌省份的汉字缩写
        strategy: 10,
      };
      // 构造路线导航类
      return new AMap.Driving(drivingOption);
    }

    // 规划数据转路径
    function parseRouteToPath(route: { steps: string | any[] }) {
      const path = [];
      for (let i = 0, l = route.steps.length; i < l; i++) {
        const step = route.steps[i];
        // 简版路径
        path.push(step.start_location);
      }
      return path;
    }
  }

  // 画线
  public ployLine(path: any, strokeColor: string) {
    // 线路
    const routeLine = new AMap.Polyline({
      path: path,
      isOutline: true,
    //   outlineColor: '#ffeeee',
      borderWeight: 2,
      strokeWeight: 5,
      strokeColor,
      lineJoin: 'round',
      map: this.map,
      strokeOpacity: 0.8,
    });

    AMap.event.addListener(routeLine, 'mouseover', function(e: {
      target: { setOptions: (arg0: { strokeOpacity: number }) => void };
    }) {
      e.target.setOptions({
        strokeOpacity: 0.5,
      });
    });

    AMap.event.addListener(routeLine, 'mouseout', function(e: {
      target: { setOptions: (arg0: { strokeOpacity: number }) => void };
    }) {
      e.target.setOptions({
        strokeOpacity: 1,
      });
    });
    return routeLine;
  }

  // 画节点
  public addMarke(markArr: any[]) {
    return markArr.map(item => {
      return new AMap.Marker({
        position: item.LT,
        content: item.tmpl ? item.tmpl(item) : utliTmpl(item),
        map: this.map,
      });
    });
    // html模板拼接 根据code对应css主题
    function utliTmpl(markItem: {
      iconText: String;
      title: String;
      theme?: 1 | undefined;
    }) {
      const { iconText, title, theme = 'default' } = markItem;
      const config = {
        1: 'themeRed',
        2: 'themeVolcano',
        3: 'themeOrange',
        4: 'themeGold',
        5: 'themeYellow',
        6: 'themeLime',
        7: 'themeGreen',
        8: 'themeCyan',
        9: 'themeBlue',
        10: 'themeGeekBlue',
        11: 'themePurple',
        12: 'themeMagenta',
        default: 'themeGrey',
      };
      return `<div class="markBox ${config[theme]}"><span class="mis"></span><span class="icon">${iconText}</span>${title}</div>`;
    }
  }

  // 画汽车动画
  public carAnime(path: any, colorStr: string) {
    // 汽车图标
    const carMarker = new AMap.Marker({
      map: this.map,
      // position: ,
      icon: this.options.anime.icon,
      offset: new AMap.Pixel(-26, -13),
      autoRotation: true,
      angle: -90,
    });

    const passedPolyline = this.ployLine(null, colorStr);
    // 移动速度
    carMarker.moveAlong(path, 500000);
    // 形式过的动画
    carMarker.on('moving', function(e: { passedPath: any }) {
      passedPolyline.setPath(e.passedPath);
    });

    carMarker.on('movealong', () => {
      this.options.anime.movealong && this.options.anime.movealong();
    });
    return carMarker;
  }
  // 添加汽车当前节点
  public addCarIndex(LT: [Number, Number]) {
    // 汽车图标
    new AMap.Marker({
      map: this.map,
      position: LT,
      icon: this.options.position.icon,
      offset: new AMap.Pixel(-26, -13),
      autoRotation: true,
      angle: -90,
    });
  }
  public render() {
    return (
      <div
        id={this.state.elId}
        style={{ width: '100%', height: '300px', ...this.props.style }}
      ></div>
    );
  }
}

export default Maps;
