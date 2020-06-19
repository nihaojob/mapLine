import React from 'react';
import _ from 'lodash';
import './index.less';

declare let AMap: any;

interface ITextPaperProps {
  anime: anime;
  path: Array<pathItem>;
  donePath: Array<[number, number]>;
  animeMarker: Function;
  allLine: any;
}
interface IEntranceState {
  elId: string;
}

interface pathItem {
  iconText: string;
  title: string;
  theme: number;
  LT: Array<[number, number]>;
}

interface anime {
  show: boolean;
  icon: string;
  pathColor: string;
  type: Array<[number, number]>;
}

interface defaultOptions {
  path: any;
  pathColor: string;
  donePath: any;
  donePathColor: string;
  marker: {
    show: boolean;
    styles: any;
  };
  anime: {
    // 路径回放
    show: boolean;
    icon: string;
    pathColor: string;
    type: string;
  };
  position: {
    // 当前坐标
    show: boolean;
    icon: string;
    LT: Array<any>;
  };
}

class Maps extends React.Component<ITextPaperProps, IEntranceState, any> {
  // keyCITY: { keyword: string; city: string; }[];
  map: {
    setFitView: any;
  };
  options: any;
  constructor(props: Readonly<ITextPaperProps>) {
    super(props);
    this.state = {
      elId: String(Math.random()).split('.')[1],
    };

    const defaultOptions: defaultOptions = {
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
        type: 'path', // 沿着done或者all回放
      },
      position: {
        // 当前坐标
        show: false,
        icon: 'https://webapi.amap.com/images/car.png',
        LT: [],
      },
    };

    this.options = _.merge(defaultOptions, props);
    //     this.keyCITY = [
    //         {
    //             keyword:'重庆',
    //             city:'苏州'
    //         },
    //         {
    //             keyword:'西安',
    //             city:'南京'
    //         },
    //         {
    //             keyword:'重庆',
    //             city:'合肥'
    //         },
    //         {
    //             keyword:'合肥',
    //             city:'合肥'
    //         },
    //         {
    //             keyword:'西安',
    //             city:'西安'
    //         },
    //         {
    //             keyword:'重庆',
    //             city:'重庆'
    //         },
    //         {
    //             keyword:'上海',
    //             city:'上海'
    //         },
    //         ];
    this.map = {
      setFitView: {},
    };
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

  // 获取导航数据
  public getDrivLineData(option?: any, cb?: Function) {
    let cbfn: any = cb || function() {};
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
      // let index = 0
      for (let i = 0, l = route.steps.length; i < l; i++) {
        const step = route.steps[i];
        // 简版路径
        path.push(step.start_location);
        // 详细路径 倍数取值
        // for (let j = 0, n = step.path.length; j < n; j++) {
        //     index++;
        //     if(index%10 ===0 ){
        //         path.push(step.path[j])
        //     }
        // }
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
      outlineColor: '#ffeeee',
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
        content: utliTmpl(item),
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
    return carMarker;
  }

  public initLintKeyTest(option: any) {
    const func = (path: any, source: any) => {
      const markArr = [source.start, ...source.waypoints, source.end].map(
        (item, index) => {
          return {
            type: '仓',
            code: Math.round(Math.random() * 10),
            LT: item.location,
            cityName: item.cityname,
            ...option[index],
          };
        }
      );
      this.addMarke(markArr);

      const colorStr = Color();
      const shortLines = this.ployLine(path, colorStr);

      this.carAnime(path, Color());
      this.map.setFitView([shortLines]);

      function Color() {
        var colorElements = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f';
        var colorArray = colorElements.split(',');
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += colorArray[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    };
    option.push(func);
    // 汉字搜索
    this.getDrivLineData(...option); // tslint:disable-line
  }

  public componentDidMount() {
    this.createdMap();
    // this.initLintKeyTest(this.keyCITY)
    const { allLine } = this.props;

    if (allLine) {
      // 多条线路
      // allLine.forEach(options => {
      //     this.initLintKeyTest(options)
      // })
    } else {
      // 单条线路
      this.ployOneLine();
    }
  }
  public ployOneLine() {
    const options = this.options;

    const lineData = this.lineUtil(options.path);
    this.getDrivLineData(lineData.param, (path: any) => {
      // 绘制全长线路
      const routeLine = this.ployLine(path, options.pathColor);
      this.map.setFitView([routeLine]);

      // 当前车坐标
      options.position.show && this.addCarIndex(options.position.LT);

      // marke添加
      options.marker.show && this.addMarke(lineData.lineArrCopy);

      // 绘制动画
      const carAnime = (pathData: any) => {
        if (options.anime.show) {
          const carMarker = this.carAnime(pathData, options.anime.pathColor);
          const carPop = this.props.animeMarker || function() {};
          carPop(carMarker);
        }
      };

      // 灰色线路
      if (options.donePath.length > 0) {
        const doneDataArr = this.lineUtil(options.donePath);
        this.getDrivLineData(doneDataArr.param, (donePath: any) => {
          this.ployLine(donePath, options.donePathColor);

          // 动画展示
          if (options.anime.show && options.anime.type === 'donePath') {
            carAnime(donePath);
          }
        });
      }

      // 动画展示
      if (options.anime.show && options.anime.type === 'path') {
        carAnime(path);
      }
    });
  }
  public addCarIndex(LT: any) {
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
        style={{ width: '100%', height: '500px' }}
      ></div>
    );
  }
}

export default Maps;
// export { default as Maps }
