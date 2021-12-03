<template>
  <div id="app">
    <button class="paging-btn paging-btn_type_none"
      :disabled="typePaging === 'none'"
      @click="changePaging('none')"
    >
      Сортировка и фильтрация
    </button>
    <button class="paging-btn paging-btn_type_static"
      :disabled="typePaging === 'static'"
      @click="changePaging('static')"
    >
      Статическая пагинация
    </button>
    <button class="paging-btn paging-btn_type_infinite"
      :disabled="typePaging === 'infinite'"
      @click="changePaging('infinite')"
    >
      Бесконечный скролл
    </button>
    <TableWrapper :typePaging="typePaging" />
  </div>
</template>

<script>
import TableWrapper from './components/Table/index.vue'

export default {
  name: 'App',
  components: {
    TableWrapper
  },
  data() {
    return {
      typePaging: 'none',
    }
  },
  methods: {
    changePaging(type) {
      this.typePaging =  type;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.paging-btn {
  margin: 20px 0;
  height: 40px;
  padding: 0 15px;
  font-size: 16px;
  color: #2c3e50;
  background-color: #75f8f8c0;
  border: none;
  cursor: pointer;
}

.paging-btn:disabled{
  background-color: rgba(128, 233, 109, 0.856);
  font-weight: 600;
  cursor: default;
}
</style>
