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
import { Directive } from '@/directives/detect-viewport';
import '@/css/main.css';

library.add(faSortAmountUp, faSortAmountDown, faSort, faFilter, faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.directive('detect-viewport', Directive);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
