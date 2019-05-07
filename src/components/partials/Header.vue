<template>
  <div>
    <v-navigation-drawer permanent v-model="drawer" :mini-variant.sync="mini" :class="$root.sidebarBg" class="ligthen-2" light app stateless hide-overlay>
      <v-toolbar flat lighten :class="$root.sidebarBg" class="lighten-3">
        <v-list class="pa-0">
          <v-list-tile avatar>
             <v-toolbar-side-icon @click.native.stop="mini = !mini"></v-toolbar-side-icon>
            <v-list-tile-content>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <!-- Menus -->
        <v-list-group prepend-icon="" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>Stability</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="(_g, i) in stability" :key="i" ref="stability">
            <v-list-tile-title v-text="_g[0]" @click="pathToStability($refs.stability[i])"></v-list-tile-title>
          </v-list-tile>
        </v-list-group>

        <v-list-group prepend-icon="" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>Performance</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="(_g, i) in performance" :key="i" ref="performance">
            <v-list-tile-title v-text="_g[0]" @click="pathToPerformance($refs.performance[i])"></v-list-tile-title>
          </v-list-tile>
        </v-list-group>

        <v-list-group prepend-icon="" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>Functional</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="(_g, i) in functional" :key="i" ref="functional">
            <v-list-tile-title v-text="_g[0]" @click="pathTofunctional($refs.functional[i])"></v-list-tile-title>
          </v-list-tile>
        </v-list-group>
        <!-- Menus -->
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed app light class="white">
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu ref="menu1" :close-on-content-click="false" v-model="menu1" :nudge-right="40" :return-value.sync="startDate"
        lazy transition="scale-transition" offset-y full-width min-width="290px" class="pr-5">
        <v-text-field slot="activator" v-model="startDate" label="Start date" prepend-icon="event"></v-text-field>
        <v-date-picker v-model="startDate" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="save_Start_Date">OK</v-btn>
        </v-date-picker>
      </v-menu>
      <v-menu ref="menu2" :close-on-content-click="false" v-model="menu2" :nudge-right="40" :return-value.sync="endDate"
        lazy transition="scale-transition" offset-y full-width min-width="290px">
        <v-text-field slot="activator" v-model="endDate" label="End date" prepend-icon="event"></v-text-field>
        <v-date-picker v-model="endDate" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="menu2 = false">Cancel</v-btn>
          <v-btn flat color="primary" @click="save_End_Date">OK</v-btn>
        </v-date-picker>
      </v-menu>

      <v-btn flat class="hidden-sm-and-down" id="submit" @click="onSubmit()" v-on:load="onSubmit()">Submit</v-btn>

      <v-menu bottom left transition="slide-y-transition">
        <!--<v-btn slot="activator" icon>
          <v-icon class="grey--text text--lighten-1">account_circle</v-icon>
        </v-btn>-->
        <v-list>
          <v-list-tile to="/settings">
            <v-list-tile-action>
              <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>lock_open</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

    </v-toolbar>
  </div>
</template>

<script>
  import EventBus from '../event-bus';

  export default {
    name: 'Header',
    computed: {
    },
    methods: {

      save_Start_Date: function(){
        this.$store.dispatch('saveStartDate', this.startDate);
        this.$refs.menu1.save(this.startDate);

      },
      save_End_Date: function(){
        this.$store.dispatch('saveEndDate', this.endDate);
        this.$refs.menu2.save(this.endDate);
      },

      pathToStability: function(i){
        let key = i.$vnode.data.key;
        let target = this.stability[key][1];
        let path = "dashboard#" + target;
        this.$router.push({path: path});
      },

      pathTofunctional: function(i){
        let key = i.$vnode.data.key;
        let target = this.functional[key][1];
        let path = "dashboard#" + target;
        this.$router.push({path: path});
      },

      pathToPerformance: function(i){
        let key = i.$vnode.data.key;
        let target = this.performance[key][1];
        let path = "dashboard#" + target;
        this.$router.push({path: path});
      },

      onSubmit: function(){
        EventBus.$emit('data_Btw_Dates', this.startDate, this.endDate);

      }
    },
    mounted(){
      this.onSubmit();
    },
    data () {
      return {
        title: 'Test Manager',
        drawer: true,
        mini: true,
        right: null,
        stability: [
          ['Health Trend', 'build-health-trend-chart'],
          ['Feature Trend', 'build-vs-feature']
        ],
        performance: [
          ['EPG Performance','EPGPerformance'],
          ['Basic Parameters', 'BasicParameters'],
          ['Menu Navigation', 'MenuNavigation'],
          ['Connectivity', 'Connectivity'],
          ['Key Response', 'Key_Response'],
          ['Launch App Screens', 'LaunchAppScreens']

        ],
        functional: [
          ['Health Trend', 'build-health-trend-chart-func'],
          ['Status Trend', 'build-vs-feature-func']
        ],
        menu1: false,
        menu2: false,
        startDate: this.$store.state.startDate,
        endDate: this.$store.state.endDate,
        startmodal: false,
        endmodal: false
      }
    }
  }
</script>
