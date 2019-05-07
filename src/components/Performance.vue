<template>
<v-layout row wrap>
<v-flex xs12 sm8 md6 pa-2>
  <v-card class="elevation-2">
      <v-divider></v-divider>
      <v-layout row wrap align-center>
        <v-flex md12>
          <v-card class="elevation-1" height="100%">
            <slot name="perf-params" v-bind="items"></slot>
          </v-card>
        </v-flex>
      </v-layout>
      <slot name="spin-perf"></slot>
      <slot name="perf-graph" v-bind="graph"></slot>
    <v-card-actions>
    </v-card-actions>
  </v-card>
</v-flex>
</v-layout>
</template>

<script>

export default {
name: 'Performance',
props: {
  items: Array,
  graph: Object
},
mounted() {
},
data () {
return {

  }
},
}
</script>

<style>
</style>
