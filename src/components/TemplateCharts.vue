<template>
  <v-layout row justify-space-between>
    <v-flex xs12 sm8 md8 pa-2>
      <v-divider></v-divider>
      <v-card class="elevation-5">
        <v-card-title>
          <v-flex xs12>
            <h1>{{title}}</h1>
          </v-flex>
          <v-divider></v-divider>
        </v-card-title>
          <slot name="main-graph" v-bind="Graph"></slot>
      </v-card>
    </v-flex>
    <v-flex xs12 sm4 md4 pa-2>
      <v-card class="elevation-5">
        <v-card-title>
          <v-flex xs12>
            <h2>{{subTitle}}</h2>
          </v-flex>
          <v-divider></v-divider>
          <v-layout row wrap align-space-between justify-space-between>
            <v-flex md12>
              <v-card class="elevation-1">
                <slot name="select-build-Health" v-bind="items"></slot>
              </v-card>
            </v-flex>
            <v-flex md6>
              <v-card class="elevation-1">
                <slot name="select-build" v-bind="items"></slot>
              </v-card>
            </v-flex>
            <v-divider></v-divider>
            <v-flex md6>
              <v-card class="elevation-1">
                <slot name="select-script" v-bind="items"></slot>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-title>
          <slot name="sub-graph" v-bind="Graph"></slot>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

  export default {
    name: 'TrendIssueCharts',
    props: {
      title: String,
      Graph: Object,
      subTitle: String,
      items: Array,
      mainTitle: String,
      id: String
    },
    data () {
      return {

      }
    }
  }
</script>
<style>

</style>
