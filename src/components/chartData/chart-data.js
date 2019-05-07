const ChartData = {
  CHART_COLORS: [
    "#BF360C",
    "#FFB300",
    '#455A64',
    "#3949AB",
    "#00695C",
    "#E65100",
    "#e6e324",
    "#3ee61c",
    "#d748e6",
    "#52e4e6",
    "#a9e608",
    "#e60440",
    "#9464e6",
    "#38e67b",
    "#9c11a2",
    "#66051f",
    "#838325",
    "#e60932"

  ],

  /***********************************************Updating data in charts****************************************/

  addData: function(chart, data) {
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
  },
  /*************************************************************************************************************/
  /*********************************************Stability*******************************************************/

  /*Return an array of Build*/
  getBuilds: function(_data) {
    return _data.map(function (_obj) {
      return _obj['details']['name'];
    })
  },

  /*Returns labels & data(Build vs Pass/Executed Index) to be plotted in charts*/
  getBuildHealthData: function(_data) {
    var x = this.getBuilds(_data);
    var y = [];
    for (var i=0; i<_data.length; i++) {
      var scripts_count = Object.keys(_data[i]['scripts']).length;
      var pass = 0;
      for (var j in _data[i]['scripts']) {
        if (Object.values(_data[i]['scripts'][j]).reduce(function(a, b) { return a + b; }, 0) == 0){
          pass += 1
        };
      }
      y.push(pass/scripts_count)
    }
    return {
      labels: x,
      datasets: [
        { // one line graph
          label: 'Pass/Executed Index',
          data: y,
          backgroundColor: ["#A5D6A7"],
          borderColor: ["#388E3C"],
          borderWidth: 3
        }
      ]
    };
  },

  /*Returns data(Build vs Feature) to be plotted in charts*/
  getBuildFeatureData: function(_data) {
    var _b_dict = {};
    var y = {};
    let _dataset = [];
    for (var i=0; i<_data.length; i++) {
      _b_dict[_data[i]['details']['name']+i] = {};
      for (var j in _data[i]['scripts']) {
        _b_dict[_data[i]['details']['name']+i][j] = Object.values(_data[i]['scripts'][j]).reduce(function(a, b) { return a + b; }, 0);
        if (Object.keys(y).indexOf(j)<0) {y[j]=[]};
      }
    }
    console.log(_b_dict);
    var x = this.getBuilds(_data);
    var b_keys = Object.keys(_b_dict);
    for (var _c=0; _c<b_keys.length; _c++) {
      for (var _v in y) {
        if (_b_dict[b_keys[_c]][_v]) {
          y[_v].push(_b_dict[b_keys[_c]][_v]);
        } else if(_b_dict[b_keys[_c]][_v]==0) {
          y[_v].push(0)
        } else {
          y[_v].push(0)
        }
      }
    }

    var _c = 0;
    for(var i in y){
      _dataset.push({ // another line graph
        label: i,
        data: y[i],
        backgroundColor: [this.CHART_COLORS[_c]],
        borderColor: [this.CHART_COLORS[_c]],
        fill: false
      });
      _c += 1;
    }
    return{
      labels: x,
      datasets: _dataset
    };
  },

  /*Returns data(Total failures in each script for the selected build) to be plotted in Stack charts*/
  getStackData: function(_data, _build){
    var x ;
    var y = {};
    var _dataset = [];
    var build_index;
    var label;

    for(var i=0; i<_data.length; i++) {
      if(_data[i]['details']['name']==_build) {
        build_index = i;
        break;
      }
    }

    for(var j in _data[build_index]['scripts'])
    {
      label = Object.keys(_data[build_index]['scripts'][j]);
      for(var k=0; k<label.length; k++){
        if(Object.keys(y).indexOf(label[k]) < 0)
        {
          y[label[k]] = [];
        }

      }
    }
    x = Object.keys( _data[build_index]['scripts']);
    var _c = Object.keys(y);
    for(var j in _data[build_index]['scripts']){
      for(var i = 0; i<_c.length; i++)
      {
        if(_data[build_index]['scripts'][j][_c[i]])
        {
          y[_c[i]].push(_data[build_index]['scripts'][j][_c[i]]);
        }
        else
          y[_c[i]].push(0);
      }
    }
    var i = 0;
    for(var j in y)
    {
      _dataset.push({
        label: j,
        data: y[j],
        backgroundColor: this.CHART_COLORS[i],

      });
      i++;
    }
    return {labels: x, datasets:_dataset, build: _build};
  },

  /*Returns data(Total failures in each script) to be plotted in Pie charts*/
  getFeatureFailedData: function(_data, build_name, script_name) {
    var _s;
    var y = {};
    var _b;
    for (var i=0; i<_data.length; i++) {
      if (_data[i]['details']['name'] == build_name) {
        _s = _data[i]['scripts'];
        _b = _data[i]['details']['name'];
        break;
      }
    }
    if (!_s || !_b ) {

      return [[], []]
    }

    var _d = _s[script_name];
    return{
      labels: Object.keys(_d),
      datasets: [
        { // pie graph
          label: 'Failure Reasons',
          data: Object.values(_d),
          backgroundColor: this.CHART_COLORS,
          borderColor: this.CHART_COLORS,
          borderWidth: 0,
          events: []
        }
      ]
    };
  },

  /*Returns data with chart type, data & options to be plotted in BuildvsPass/executed index */
  buildHealthTrend: function (_data) {
    var obj = this;
    var _b_data = this.getBuildHealthData(_data);
    var data = {
      type: 'line',
      data: _b_data,
      options: {
        responsive: true,
        lineTension: 1,
        scales: {
        xAxes: [{
          ticks: {
            autoSkip: false
          }
        }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25
            }
          }]
        },
        legend:{
          display: true,
          labels: {
            boxWidth: 5
          }
        },
        //events: ['click'],
        onClick: function (e, _d) {
          var elm = this.getElementAtEvent(e);
          var subData = obj.buildFeatureChart(_data, elm[0]._chart.data.labels[elm[0]['_index']]);
          var el = e.srcElement.id;
          const ctx1 = document.getElementById("build-health-sub-chart");
          const ctx2 = document.getElementById("build-health-sub-chart-func");
          var my_chart;
          if(el === "build-health-trend-chart")
          {
            my_chart = new Chart(ctx1, {
              type: subData.type,
              data: subData.data,
              options: subData.options,
            });
          }
          if(el === "build-health-trend-chart-func")
          {
            my_chart = new Chart(ctx2, {
              type: subData.type,
              data: subData.data,
              options: subData.options,
            });
          }


            obj.addData(my_chart, subData);
          }
      }
    }
    return data;
  },

  /*Returns data with chart type, data & options to be plotted in vertial stack chart*/
  buildFeatureChart: function (_data, _build) {
    var _f_data = this.getStackData(_data, _build);
    var data = {
      type: 'bar',
      data: _f_data,
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
              callback: function(t) {
                var maxLabelLength = 3;
                if (t.length > maxLabelLength) return t.substr(0, maxLabelLength) + '...';
                else return t;
              }
            }
          }],
          yAxes: [{
            stacked: true
          }]
        },
        title: {
          display: true,
          text: _build
        },
        //events: ["click"],
        tooltips: {
          callbacks: {
            label: function(t, d) {
              var tp = d.labels[t.index] + " " + d.datasets[t.datasetIndex].label + " " +d.datasets[t.datasetIndex].data[t.index] ;
              return tp || '';
            }
          }
        }
      }
    }
    return data;
  },

  /*Returns data with chart type, data & options to be plotted in BuildvsPass/executed index */
  buildVsFeatureChart: function (_data) {
    let obj;
    obj = this;
    var data;
    data = {
      type: 'line',
      data: obj.getBuildFeatureData(_data),
      options: {
        legend: {
          display: true,
          labels: {
            boxWidth: 4
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false,
              maxRotation: 20,
              minRotation: 20
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }

          }]
        },
        onClick: function (e, _d) {
          var elm = this.getElementAtEvent(e);
          var el = e.srcElement.id;
          var build_name = _d[elm[0]["_datasetIndex"] - 1]._chart.data.labels[elm[0]["_index"]];
          var script_name = _d[elm[0]["_datasetIndex"] - 1]._chart.data.datasets[elm[0]["_datasetIndex"]].label;
          var subData = obj.FailureReasonsChart(_data, build_name, script_name);
          const ctx1 = document.getElementById("fail-reason-chart");
          const ctx2 = document.getElementById("fail-reason-chart-func");
          if (el === "build-vs-feature") {
            var my_chart = new Chart(ctx1, {
              type: subData.type,
              data: subData.data,
              options: subData.options
            });
          }

          if (el === "build-vs-feature-func") {
            var my_chart = new Chart(ctx2, {
              type: subData.type,
              data: subData.data,
              options: subData.options,
            });
          }


          obj.addData(my_chart, subData);
        }
      }
    }
    return data;
  },

  /*Returns data with chart type, data & options to be plotted in Pie chart */
  FailureReasonsChart: function (_data, _build, _script) {
    var data;
    data = {
      type: 'pie',
      data: this.getFeatureFailedData(_data, _build, _script),
      options: {
        cutoutPercentage: 0,
        rotation: -0.5 * Math.PI,
        circumference: 2 * Math.PI,
        animation: {
          animateRotate: true
        },
        title: {
          display: true,
          text: [_build, _script]
        },
        animation: {animateScale: false},
        legend: {
          labels: {fontSize: 10}
        },
      }
    };
    return data;
  },

  /*Returns data to be loaded in combo box  */
  getScriptListForBuild: function(_data, build_name){
    var _s;
    for (var i=0; i<_data.length; i++) {
      if (_data[i]['details']['name'] == build_name) {
        _s = _data[i]['scripts'];
        break;
      }
    }
    return _s;
  },
  /********************************************End Of Stability*********************************************************************/
  /*********************************************Functional***************************************************************************/

  /*Returns labels & data(Build vs Pass/Executed Index) to be plotted in charts*/
  getHealthDataFunc: function(_data){
    var x = this.getBuilds(_data);
    var y = [];
    for(var i=0; i<_data.length;i++){
      var pass = 0;
      var scr = _data[i]['scripts']
      for(var j=0; j<scr.length; j++){
        var k = Object.keys(_data[i]["scripts"][j]);
        k.forEach(function(item){
          var val = scr[j][item];
          if(item.toLowerCase().indexOf("status") > -1 && (val.toLowerCase() === "passed" || val.toLowerCase() === "pass")){
              pass += 1;
          }
        })
      }
      y.push(pass/scr.length);
    }
    return {
      labels: x,
      datasets: [
        { // one line graph
          label: 'Pass/Executed Index',
          data: y,
          backgroundColor: ["#A5D6A7"],
          borderColor: ["#388E3C"],
          borderWidth: 3
        }
      ]
    };

  },

  /*Returns data with chart type, data & options to be plotted in Build vs Pass executed index chart */
  HealthTrendFunc: function (_data) {
    var obj = this;
    var _b_data = this.getHealthDataFunc(_data);
    var data = {
      type: 'line',
      data: _b_data,
      options: {
        responsive: true,
        lineTension: 1,
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25
            }
          }]
        },
        legend:{
          display: true,
          labels: {
            boxWidth: 5
          }
        },
        //events: ['click'],
        onClick: function (e, _d) {
          var elm = this.getElementAtEvent(e);
          var subData = obj.buildFeatureChartFunc(_data, elm[0]._chart.data.labels[elm[0]['_index']]);
          var el = e.srcElement.id;
          const ctx1 = document.getElementById("build-health-sub-chart");
          const ctx2 = document.getElementById("build-health-sub-chart-func");
          var my_chart;
          if(el === "build-health-trend-chart")
          {
            my_chart = new Chart(ctx1, {
              type: subData.type,
              data: subData.data,
              options: subData.options,
            });
          }
          if(el === "build-health-trend-chart-func")
          {
            my_chart = new Chart(ctx2, {
              type: subData.type,
              data: subData.data,
              options: subData.options,
            });
          }


          obj.addData(my_chart, subData);
        }
      }
    }
    return data;
  },

  /*Returns list of scripts for the selected build*/
  getScriptListForFunc: function(_data, build_name){
    var _s;
    var val = [];
    for (var i=0; i<_data.length; i++) {
      if (_data[i]['details']['name'] === build_name) {
        _s = _data[i]['scripts'];
        _s.forEach(function(item){
          val.push(item["Script"].split('/').join(''));
        })
        break;
      }
    }
    return val;
  },

  /*Returns data with chart type, data & options to be plotted in vertical stack chart */
  buildFeatureChartFunc: function (_data, _build) {
    var _f_data = this.getStackDataFunc(_data, _build);
    var data = {
      type: 'bar',
      data: _f_data,
      options: {
        scales: {
          xAxes: [{
          }],
          yAxes: [{
          }]
        },
        title: {
          display: true,
          text: _build
        },
        events: ["click"],
        tooltips: {
          callbacks: {
            label: function(t, d) {
              //var tp = d.labels[t.index] + " " + d.datasets[t.datasetIndex].label + " " +d.datasets[t.datasetIndex].data[t.index] ;
              t.xLabel = d.datasets[t.datasetIndex].label;
              var tp = d.datasets[t.datasetIndex].label + " " +d.datasets[t.datasetIndex].data[t.index] ;
              return tp || '';
            }
          }
        }
      }
    }
    return data;
  },

  /*Returns labels & data(Pass/failed/unknown) to be plotted in vertical stack charts*/
  getStackDataFunc: function(_data, _build){
    var obj = this;
    var x ;
    var build_index;
    var  _dataset = [];
    var y = {};
    var z = {};

    for(var i=0; i<_data.length; i++) {
      if(_data[i]['details']['name']==_build) {
        build_index = i;
        break;
      }
    }
    _data[build_index]["scripts"].forEach(function(item){
      var k = Object.keys(item);
      k.forEach(function(key){
        if(key.toLowerCase().indexOf('status') > -1 ){
          if(Object.keys(y).indexOf(item[key]) < 0){
            var _s = item[key];
            _s = _s.toLowerCase();
            y[_s] = [];
            z[_s] = [];
          }
        }
      })
    })
    x = Object.keys(y);
    _data[build_index]["scripts"].forEach(function(item){
      x.forEach(function(key){
        var _c = Object.values(item);
        _c.forEach(function(i){
          if(i.toLowerCase() === key.toLowerCase()){
            var _l = key.toLowerCase();
            y[_l].push(1);
            z[_l].push(item["Script"]);

          }
        })
      })
   })
    var i = 0;
    for(var j in y)
    {
      var a = {};
      a[j] = y[j].reduce(function(a, b) { return a + b; }, 0);
      y[j] = [];
      y[j].push(a[j]);
      _dataset.push({
        label: j,
        data: y[j],
        backgroundColor: obj.CHART_COLORS[i],

      });
      i++;
    }
    return {labels: x, datasets:_dataset, build: _build};
  },

  /*Returns labels & data(Build vs Status) to be plotted in charts*/
  getBuildStatusTrend: function(_data) {
    var _b_dict= {};
    var _status = {};
    var _STATUS = [];
    var obj = this;
    var y = {};
    var  _dataset = [];

    for(var i=0; i<_data.length; i++){
      _data[i]["scripts"].forEach(function(item){
        var k = Object.keys(item);
        k.sort().forEach(function(key){
          if(key.toLowerCase().indexOf('status') > -1 ){
            var _s = item[key];
            _s = _s.toLowerCase();
            if(_STATUS.indexOf((_s)) < 0){
              _STATUS.push(_s);
            }
          }
        })
      })
    }

    for(var i=0; i<_data.length; i++){
      _b_dict[_data[i]["details"]["name"]+i] = {};
      _data[i]["scripts"].forEach(function(item){
        var k = Object.keys(item);
        k.sort().forEach(function(key){
          if(key.toLowerCase().indexOf('status') > -1 ){
            var _s = item[key];
            _s = _s.toLowerCase();
            if((Object.keys(_status).indexOf((_s)) < 0) && (Object.keys(y).indexOf((_s)) < 0 )){
              _status[_s] = 1;
               y[_s] = [];

            }
            else if(Object.keys(_status).indexOf((_s)) < 0 || (Object.keys(y).indexOf((_s)) < 0 )){
              _status[_s] = 1;
            }
            else{
              _status[_s] += 1;
            }
            _b_dict[_data[i]["details"]["name"]+i][_s] = _status[_s];
          }
        })
      })
      _STATUS.forEach(function(k){
        if(Object.keys(y).indexOf(k) < 0){
          y[k] = [];
          _b_dict[_data[i]["details"]["name"]+i][k] = 0;
        }
        else if(Object.keys(y).indexOf(k) > -1 && _b_dict[_data[i]["details"]["name"]+i][k] == null){
          _b_dict[_data[i]["details"]["name"]+i][k] = 0;
        }
        })

      var _l = Object.keys(_b_dict[_data[i]["details"]["name"]+i]);
      _l.forEach(function(v){
        y[v].push(_b_dict[_data[i]["details"]["name"]+i][v]);
      })

      _status = {};
    }

    var _c = 0;
    for(var j in y){
      _dataset.push({ // another line graph
        label: j,
        data: y[j],
        backgroundColor: [obj.CHART_COLORS[_c]],
        borderColor: [obj.CHART_COLORS[_c]],
        fill: false
      });
      _c++;
    }

    var b_keys = Object.keys(_b_dict);
    
    return{
      labels: b_keys,
      datasets: _dataset
    };
  },

  /*Returns data with chart type, data & options to be plotted in Build vs Status chart */
  buildVsStatusChart: function (_data) {
    let obj;
    obj = this;
    var data;
    data = {
      type: 'line',
      data: obj.getBuildStatusTrend(_data),
      options: {
        legend: {
          display: true,
          labels: {
            boxWidth: 7
          }
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false,
              maxRotation: 20,
              minRotation: 20
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }

          }]
        }
      }
    }
    return data;
  },

  /*********************************************End of Functional***************************************************************************/
/**************************************Performance*************************************/
  getParams: function(_data){
  let _p = {};
  for(var i=0; i<_data.length; i++){
    Object.keys(_data[i]["paramMap"]).forEach(function(key){
        if(Object.keys(_p).indexOf(key) < 0){
          _p[key] = [];
        }
    })
  }
  return _p;
},

  getParamsComboBox: function(graphData) {
    let item;
    let _s = {};
    item = ChartData.getParams(graphData);
    item = Object.keys(item);
    item.forEach(function(val){
      if(val.toLowerCase() === "channel change" || val.toLowerCase() === 'boot time' || val.toLowerCase() === 'power mode time' ){
        if(Object.keys(_s).indexOf('BasicParameters') < 0){
          _s['BasicParameters'] = [];
          _s['BasicParameters'].push(val)
        }
        else{
          _s['BasicParameters'].push(val)
        }
      }
      if(val.toLowerCase() === "key_response(bt)" || val.toLowerCase() === 'key_response(ir)'){
        if(Object.keys(_s).indexOf('Key_Response') < 0){
          _s['Key_Response'] = [];
          let pos1 = val.indexOf('(');
          pos1 = pos1 + 1;
          let pos2 = val.lastIndexOf(')');
          val = val.slice(pos1, pos2);
          _s['Key_Response'].push(val)
        }
        else{
          let pos1 = val.indexOf('(');
          pos1 = pos1 + 1;
          let pos2 = val.lastIndexOf(')');
          val = val.slice(pos1, pos2);
          _s['Key_Response'].push(val)
        }
      }
      if(val.toLowerCase() === "wifi pairing" || val.toLowerCase() === 'bt pairing'){
        if(Object.keys(_s).indexOf('Connectivity') < 0){
          _s['Connectivity'] = [];
          _s['Connectivity'].push(val)
        }
        else{
          _s['Connectivity'].push(val)
        }
      }
      if(val.toLowerCase() === "search area launch" || val.toLowerCase() === 'now and next launch' || val.toLowerCase() === 'browse area launch'
        || val.toLowerCase() === 'youtube launch' || val.toLowerCase() === "search area navigation" || val.toLowerCase() === "now and next navigation"
      || val.toLowerCase() === 'browse area navigation' || val.toLowerCase() === 'youtube navigation'){
        if(Object.keys(_s).indexOf('MenuNavigation') < 0){
          _s['MenuNavigation'] = [];
          _s['MenuNavigation'].push(val)
        }
        else{
          _s['MenuNavigation'].push(val)
        }
      }
      if(val.toLowerCase() === "epg cache update performance" || val.toLowerCase() === 'epg bring up first time' || val.toLowerCase() === 'epg bring up later' || val.toLowerCase() === 'epg/menu navigation'){
        if(Object.keys(_s).indexOf('EPGPerformance') < 0){
          _s['EPGPerformance'] = [];
          _s['EPGPerformance'].push(val)
        }
        else{
          _s['EPGPerformance'].push(val)
        }
      }
      if(val.toLowerCase() === "launch of app screens first time" || val.toLowerCase() === 'launch of app screens later'){
        if(Object.keys(_s).indexOf('LaunchAppScreens') < 0){
          _s['LaunchAppScreens'] = [];
          _s['LaunchAppScreens'].push(val)
        }
        else{
          _s['LaunchAppScreens'].push(val)
        }
      }
    })
    return _s;
  },

  getParamData: function(_data, param){
    let obj = this;
    let y = {};
    let x = [];
    let _dataset = [];
      for(var i = 0; i<_data.length; i++){
        if(Object.keys(_data[i]["paramMap"]).indexOf(param) > -1){
              Object.keys(_data[i]["paramMap"][param]).forEach(function(key){
                if(Object.keys(y).indexOf(key.toLowerCase()) < 0){
                  y[key] = [];
                  y[key].push(_data[i]["paramMap"][param][key]);
                }
                else{
                  y[key].push(_data[i]["paramMap"][param][key]);
                }
              })
        }
      }
      x = this.getBuilds(_data);
      let _c = 0;
      for(var j in y){
        _dataset.push({
          label: j,
          data: y[j],
          backgroundColor: [obj.CHART_COLORS[_c]],
          borderColor: [obj.CHART_COLORS[_c]],
          fill: false
        });
        _c++;
      }

      return{labels: x, datasets: _dataset };
},

  performance: function (_data, param) {
    var data = {
      type: 'line',
      data: this.getParamData(_data, param),
      options: {
        legend: {
          display: true,
          labels: {
            boxWidth: 4
          }
        },
        responsive: true,
        lineTension: 1,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25
            }
          }]
        }
      }
    }
    return data;
  },

/******************************************************End Of Performance***************************************************************************/
  Memory: function () {
    var data = {
      type: 'line',
      data: {
        labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        datasets: [
          { // one line graph
            label: 'Number of Moons',
            data: [0, 0, 1, 2, 67, 62, 27, 14],
            backgroundColor: [
              'rgba(54,73,93,.5)', // Blue
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)'
            ],
            borderColor: [
              '#36495d',
              '#36495d',
              '#36495d',
              '#36495d',
              '#36495d',
              '#36495d',
              '#36495d',
              '#36495d',
            ],
            borderWidth: 3,
            fill: false
          },
          {
            label: 'BenchMark',
            data: [50, 50, 50, 50, 50, 50, 50, 50],
            backgroundColor: [
              'rgba(71, 183,132,.5)' // Green
            ],
            borderColor: [
              '#47b784'
            ],
            borderWidth: 3,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        lineTension: 1,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25
            }
          }]
        }
      }
    }
    return data;
  }
}

export default ChartData
