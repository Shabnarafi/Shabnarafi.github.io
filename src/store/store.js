import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
var DD = today.getDate()-1;
var MM = today.getMonth();

if(dd<10){
  dd = '0' + dd;
}

if(mm<10){
  mm = '0' + mm;
}

if(DD === 0){
  if(MM % 2 !== 0 && MM < 10){
    DD = 31;
    MM = '0' + MM;
  }
  else if(MM % 2 === 0 && MM < 10){
    DD = 30;
    MM = '0' + MM;
  }
  else if(MM % 2 !== 0 && MM >= 10){
    DD = 31;
    MM = MM;
  }
  else if(MM % 2 === 0 && MM >= 10){
    DD = 30;
    MM = MM;
  }
  else if(MM === 2){
    DD = 28;
    MM = '0' + MM;
  }
  else if(MM === 0){
    MM = 12;
  }
   else if(DD<10){

     DD = '0' + DD;
  }
   else{
     DD = DD;
}}

if(DD !== 0){
  if(DD < 10){
    DD = '0' + DD;
    MM = mm;
  }
  else{
    DD = DD;
    MM = mm;
  }
}



today = yyyy + '-' + mm + '-' + dd;
var yesterday = yyyy + '-' + MM + '-' + DD;

const state = {
  //startDate: '2017-02-10',
  //endDate: '2019-02-10',
  transitionName: 'slide-left',
  startDate: yesterday,
  endDate: today
}

const mutations = {
  saveStartDate_Mutation (state, date){
    state.startDate = date;
  },

  saveEndDate_Mutation (state, date){
    state.endDate = date;
  }
}

const actions = {
  saveStartDate: function({ commit }, new_startDate) {
    commit("saveStartDate_Mutation", new_startDate);
  },
  saveEndDate: function({ commit }, new_endDate) {
    commit("saveEndDate_Mutation", new_endDate);
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
