<template>
  <div>
    <header-section></header-section>
    <v-content>
      <v-container fluid>
        <v-layout row wrap>
          <v-slide-y-transition mode="out-in">
              <router-view ></router-view>
          </v-slide-y-transition>
        </v-layout>
      </v-container>
    </v-content>
    <footer-section></footer-section>
  </div>
</template>

<script>
  import Header from './partials/Header'
  import Footer from './partials/Footer'

  export default {
    name: 'Dashboard',
    methods:{

    },
    data () {
      return {

      }
    },
    components: {
      'header-section': Header,
      'footer-section': Footer
    }
  }
</script>


<style scoped>
.topbar {
  background-color: #1867c0;
  color: #ffffff;
}
</style>
