---
layout: post
title: "echarts的使用"
author: "Luo"
categories: [home,notes]
tags: [home,question,notes]
discription: 'echarts的引用、配置及使用'
image: arctic-5.jpg
---

#### echarts的所有配置可参考[官网文档](https://echarts.apache.org/zh/index.html)查看。

##### 1. npm引入echarts

```
npm i v-charts echarts -S
```

##### 2. main.js中按需引入

```
import VeLine from 'v-charts/lib/line.common'
import VeRing from 'v-charts/lib/ring.common'
import 'echarts/lib/component/title'; // 如果要使用title属性一定要引入
Vue.component(VeLine.name, VeLine)
Vue.component(VeRing.name, VeRing)
```

##### 3. 页面中使用

###### 折线图

```
<ve-line :data="chartData" :settings="chartSettings" :extend="extend" :data-empty="dataEmpty"></ve-line>
import 'v-charts/lib/style.css'
  export default {
    data () {
      let that = this;
      let n = 0;
      this.chartSettings = {
        yAxisName: ['案件数量'],
        xAxisName: ['日期']
      }
      this.extend = {
        color: ['#40A1FC', '#40CCCA', '#53CB77', '#F9D248', '#F0617C', '#965FE1'],
        legend: {
          right: 50,
          icon: 'roundRect'
        },
        grid: {
          left: 0,
          right: 50,
          bottom: 20,
          top: 60,
          containLabel: true
        },
        xAxis: {
          nameLocation: 'end',
          nameTextStyle: {
            color: '#000',
            fontSize: 14,
            fontWeight: 'bold',
            padding: [0, 10, 0, 0]
          },
          axisLabel: {
            interval: function (index, value) {
              if (index == 0) {
                n = 0
              }
              let chartData = that.chartData.rows;
              let length = that.chartData.rows.length;
              let m = Math.floor(length / 7)
              if (chartData && length > 7) {
                if (((m * n + 1) == index + 1) || index + 1 == length) {
                  n++
                  return value;
                }
              } else {
                return value;
              }
            }
          }
        },
        yAxis: {
          nameTextStyle: {
            color: '#000',
            fontSize: 14,
            fontWeight: 'bold',
            padding: [0, 0, 10, 30]
          },
          minInterval: 1,
          splitLine: {
            lineStyle: {
              color: '#F1F1F1'
            }
          }
        }
      }
      return {
        legendData: [],
        chartData: {
          columns: ['dealDayNum', '新增案件', `组庭案件`, '完结案件'],
          rows: []
        },
        dataEmpty: false
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
        this.chartData.rows = []
        this.dataEmpty = false
        this.$http({
          url: this.$http.adornUrl('/arbitration/casebaseinfo/statisticsInfo'),
          method: 'post',
          data: this.$http.adornParams({
            startTime: this.startTime,
            endTime: this.endTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.statisticsInfoVO) {
              let list1 = data.statisticsInfoVO.caseNumByDateList
              if (list1 && list1.length > 0) {
                for (let i = 0; i < list1.length; i++) {
                  this.chartData.rows.push({'新增案件': list1[i].addCaseNum, '组庭案件': list1[i].auditCaseNum, dealDayNum: list1[i].dealDate, '完结案件': list1[i].endcaseNum})
                }
              } else {
                this.dataEmpty = true
              }
            } else {
              this.dataEmpty = true
            }
          } else {
            this.$message.warning(data.msg)
          }
        })
      }
    }
  }
```

###### 环形图

```
<ve-ring ref="ringChart" :data="chartData" :extend="ringExtend" :title="ringTitle"></ve-ring>

import 'v-charts/lib/style.css'
export default {
  data () {
    let that = this;
    this.ringExtend = {
      // color: ['#38B46C','#E9A00F', '#BB69DB', '#F35C6A'],
      legend: {
        show: true,
        type: 'scroll',
        orient: 'vertical',
        icon: 'circle',
        left: '66%',
        top: '20%',
        formatter: function (name) {
          var total = 0;
          var target = 0;
          let data = that.chartData.rows;
          for (var i = 0; i < data.length; i++) {
            total += data[i].user;
            if (data[i].num == name) {
              target = data[i].user;
            }
          }
          let per = ''
          if (/(^[1-9]\d*$)/.test((target / total) * 100)) {
            per = (target / total) * 100
          } else {
            per = ((target / total) * 100).toFixed(2)
          }
          var str = '{a|' + name + '}' + '{b|' + per + '%' + '}' + '      ' + target
          return str
        },
        textStyle: {
          rich: {
            a: {
              width: 100
            },
            b: {
              width: 40,
              color: [0, 0, 0, 0.3]
            }
          }
        }
      },
      label: {
        formatter: function (params) {
          let per = params.percent + '%';
          let str = params.name + ' : ' + params.data.value + '(' + per + ')'
          return str
        }
      },
      series: {
        radius: ['35%', '55%'],
        center: ['30%', '50%'],
        itemStyle: {
          normal: {
            borderWidth: 3, // 图形数据间隔
            borderColor: '#fff'
          }
        }
      }
    }
    return {
      list: [
        { 'num': '周一', 'user': 1393 },
        { 'num': '周二', 'user': 3530 },
        { 'num': '周三', 'user': 2923 },
        { 'num': '周四', 'user': 1723 },
        { 'num': '周五', 'user': 3792 },
        { 'num': '周六', 'user': 4593 },
        { 'num': '周日', 'user': 4003 },
        { 'num': '周八', 'user': 3530 },
        { 'num': '周九', 'user': 2923 },
        { 'num': '周十', 'user': 1723 },
        { 'num': '周十一', 'user': 3792 },
        { 'num': '周十二', 'user': 4593 },
        { 'num': '周十三', 'user': 4003 },
        { 'num': '周十四', 'user': 1723 },
        { 'num': '周十五', 'user': 3792 },
        { 'num': '周十六', 'user': 4593 },
        { 'num': '周十七', 'user': 4003 },
        { 'num': '周十八', 'user': 4593 },
        { 'num': '周十九', 'user': 4003 },
        { 'num': '周二十 ', 'user': 4003 }
      ],
      chartData: {
        columns: ['num', 'user'],
        rows: []
      },
      ringTotal: 0,
      ringTitle: {}
    }
  },
  mounted () {
    this.ringTotal = 0
    for (let i = 0; i < this.list.length; i++) {
      this.ringTotal = this.ringTotal + this.list[i].user
      this.chartData.rows.push(this.list[i])
    }
    this.ringTitleEvent()
    let time = setInterval(() => {
      if (this.$refs.ringChart) {
        this.echart = this.$refs.ringChart.echarts
        this.setDispatch()
        clearInterval(time)
      }
    }, 50)
  },
  methods: {
    setDispatch () {
      this.echart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0
      });
    },
    ringTitleEvent () {
      this.ringTitle = {
        text: [
          '{name|案由类型}',
          '{value|' + parseFloat(this.ringTotal).toLocaleString() + '}'
        ].join('\n'),
        top: 'center',
        left: '29.4%',
        textAlign: 'center',
        textStyle: {
          rich: {
            value: {
              color: '#333',
              fontSize: 18,
              fontWeight: 'bold',
              lineHeight: 30,
              fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC"'
            },
            name: {
              color: '#777',
              fontSize: 14,
              fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC"'
            }
          }
        }
      }
    }
  }
}

```

注意：

legend多个添加滚动方法，main.js中添加

```
import 'echarts/lib/component/legendScroll';
```

成图如下：

![img]({{ site.github.url }}/assets/img/ring_1.png)

配置二：

```

  import 'v-charts/lib/style.css'
  export default {
    data () {
      let that = this;
      // 饼状图
      this.ringExtend = {
        color: ['#40A1FC', '#40CCCA', '#53CB77', '#F9D248', '#F0617C', '#965FE1', '#53CB77'],
        legend: {
          show: true,
          type: 'scroll',
          orient: 'vertical',
          icon: 'circle', // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
          left: '42%',
          top: '20%',
          formatter: function (name) {
            var total = 0;
            var target;
            let data = that.ringData.rows;
            for (var i = 0; i < data.length; i++) {
              total += data[i].value;
              if (data[i].name == name) {
                target = data[i].value;
              }
            }
            let per = ''
            if (/(^[1-9]\d*$)/.test((target / total) * 100)) {
              per = (target / total) * 100
            } else {
              per = ((target / total) * 100).toFixed(2)
            }
            var str = '{a|' + name + '}' + '{b|' + per + '%' + '}' + '    ' + target + '件'
            return str
          },
          textStyle: {
            rich: {
              a: {
                width: 180
              },
              b: {
                width: 40,
                color: [0, 0, 0, 0.3]
              }
            }
          }
        },
        tooltip: {
          show: true
        },
        series: {
          radius: ['44%', '60%'],
          center: ['22%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
            formatter: ['{b}', '{c}' + '件'].join('\n'),
            align: 'center',
            lineHeight: 20
          },
          emphasis: {
            label: {
              show: true,
              position: 'center',
              fontSize: '12',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          show: false
        }
      }
      return {
        caseNumList: [],
        causeList: [],
        opinion: [],
        timer: null,
        ringData: {
          columns: ['name', 'value'],
          rows: []
        },
        dataEmpty1: false,
        ringTotal: 0,
        ringTitle: {},
        legendData: [],
        dataEmpty: false
      }
    },
    created () {
      this.getData()
    },
    methods: {
      getData () {
        this.ringData.rows = []
        this.dataEmpty = false
        this.dataEmpty1 = false
        this.ringTitle = {}
        this.ringTotal = 0
        this.$http({
          url: this.$http.adornUrl('/arbitration/casebaseinfo/statisticsInfo'),
          method: 'post',
          data: this.$http.adornParams({
            startTime: this.startTime,
            endTime: this.endTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.statisticsInfoVO) {
              this.legendData = []
              let causeCaseNumList = data.statisticsInfoVO.causeCaseNumList
              this.dataEmpty1 = !causeCaseNumList || (causeCaseNumList && causeCaseNumList.length == 0)
              if (causeCaseNumList && causeCaseNumList.length > 0) {
                for (let i = 0; i < causeCaseNumList.length; i++) {
                  this.ringTotal = this.ringTotal + parseInt(causeCaseNumList[i].count)
                  let name = causeCaseNumList[i].causeName
                  this.ringData.rows.push({value: parseInt(causeCaseNumList[i].count), name: name})
                  this.legendData.push(causeCaseNumList[i].causeName)
                }
                // this.ringTitleEvent()
              } else {
                this.dataEmpty1 = true
              }
            } else {
              this.dataEmpty = true
              this.dataEmpty1 = true
            }
          } else {
            this.$message.warning(data.msg)
          }
        })
      }
    }
  }
```

成图如下：

![img]({{ site.github.url }}/assets/img/echarts_2.png)
