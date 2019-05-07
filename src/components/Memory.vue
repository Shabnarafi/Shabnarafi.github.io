<template>
  <v-layout row wrap>
    <v-flex xs12 sm8 md6 pa-2>
      <v-card class="elevation-2">
        <v-card-title>
          <v-flex xs12>
          <h1>Boot Time</h1>
          </v-flex>
          <v-divider></v-divider>
          <canvas id="performance1"></canvas>
        </v-card-title>
        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12 sm4 md6 pa-2>
      <!--<v-card class="elevation-2">
        <v-card-title>
          <v-flex xs12>
            Build Details:
          </v-flex>
          <v-divider></v-divider>
          <v-flex xs12>
            <v-card-title>
              <h3>Date:</h3>
            </v-card-title>
            <v-card-title>
              <h3>Type:</h3>
            </v-card-title>
          </v-flex>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
        </v-card-actions>
      </v-card>-->
      <v-card class="elevation-2">
        <v-card-title>
          <v-flex xs12>
          <h1>WIFI Connect</h1>
          </v-flex>
          <v-divider></v-divider>
          <canvas id="memory1"></canvas>
        </v-card-title>
        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Chart from 'chart.js';
import ChartData from './chartData/chart-data';

export default {
  name: 'Performance',
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      });
    }
  },
  mounted() {
    this.createChart('performance1', this.PerformanceChart);
    this.createChart('memory1', this.PerformanceChart);
  },
  data () {
    return {
        PerformanceChart: ChartData.Performance(),
        MemoryChart: ChartData.Performance()
      }
  },
}
</script>

<style>
</style>
