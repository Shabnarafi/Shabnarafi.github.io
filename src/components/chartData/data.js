

export const Data = {
  data: [
    {
      "scripts": {
        "script1": {"reboot": 1, "crash": 0, "block": 3},
        "script2": {"reboot": 1, "crash": 3, "block": 5},
        "script3": {"reboot": 1, "crash": 1, "block": 4},
        "script4": {"reboot": 6, "crash": 0, "block": 3},
        "script5": {"reboot": 5, "crash": 2, "block": 1},
      },
      "details": {
        "name": "build1", "executed_on": "12/01/18", "build_type": "nightly"
      }
    },
    {
      "scripts": {
        "script1": {"reboot": 0, "crash": 0, "block": 0},
        "script2": {"reboot": 0, "crash": 0, "block": 0},
        "script4": {"reboot": 3, "crash": 0, "block": 3},
        "script5": {"reboot": 5, "crash": 5, "block": 2},
      },
      "details": {
        "name": "build2", "executed_on": "12/01/18", "build_type": "nightly"
      }
    },
    {
      "scripts": {
        "script1": {"reboot": 0, "crash": 0, "block": 0},
      },
      "details": {
        "name": "build3", "executed_on": "12/01/18", "build_type": "nightly"
      }
    }
  ],

  getBuilds: function(_data) {
    return _data.map(function (_obj) {
      return _obj['details']['name']
    })
  },

  getBuildHealthData: function(_data) {
    var x = _getBuilds(_data);
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
          borderWidth: 3
        }
      ]
    };
  },

  getBuildFeatureData: function(_data) {
    var _b_dict = {};
    var y = {};
    for (var i=0; i<_data.length; i++) {
      _b_dict[_data[i]['details']['name']] = {};
      for (var j in _data[i]['scripts']) {
        _b_dict[_data[i]['details']['name']][j] = Object.values(_data[i]['scripts'][j]).reduce(function(a, b) { return a + b; }, 0);
         if (Object.keys(y).indexOf(j)<0) {y[j]=[]};
      }
    }

    var x = Object.keys(_b_dict);
    for (var _c=0; _c<x.length; _c++) {
      for (var _v in y) {
        if (_b_dict[x[_c]][_v]) {
          y[_v].push(_b_dict[x[_c]][_v]);  
        } else if(_b_dict[x[_c]][_v]==0) {
          y[_v].push(0)
        } else {
          y[_v].push(null)
        }
      }
    }
    
    return [x, y]
  },

  getStackData: function(_data,_build){
    var x ;
    var y ;
    var label;
    var y_reboot = [];
    var y_crash = [];
    var y_block = [];
    for(var i=0; i<_data.length; i++)
    {
      if(_data[i]['details']['name'] == _build)
      {
        build_Index = i;
        break;
      }
    }
    x = Object.keys(_data[build_Index]['scripts']);
    for(var j in _data[build_Index]['scripts'])
    {
      label = Object.keys(_data[build_Index]['scripts'][j]);

      y_reboot.push(Object.values(_data[build_Index]['scripts'][j])[0]);
      y_crash.push(Object.values(_data[build_Index]['scripts'][j])[1]);
      y_block.push(Object.values(_data[build_Index]['scripts'][j])[2]);
    }
    return [x, label, y_reboot, y_crash, y_block]
  },


  getFeatureFailedData: function(_data, build_name, script_name) {
    var _s;
    var y = {};
    var _b;
    for (var i=0; i<_data.length; i++) {
      if (_data[i]['details']['name'] == build_name) {
        _s = _data[i]['scripts'];
        _b = _data[i]['details']['name'];
      }
    }
    if (!_s || !_b ) {

      return [[], []]
    }

    var _d = _s[script_name];
    return [Object.keys(_d), Object.values(_d)]
  }


};

export default Data;