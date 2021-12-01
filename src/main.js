import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSortAmountUp,
  faSortAmountDown,
  faSort,
  faFilter,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VTooltipPlugin from 'v-tooltip';
import { Directive } from '@/directives/detect-viewport';

import 'v-tooltip/dist/v-tooltip.css'

library.add(faSortAmountUp, faSortAmountDown, faSort, faFilter, faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VTooltipPlugin);
Vue.directive('detect-viewport', Directive);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
