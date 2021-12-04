<template>
  <div id="app">
    <button :class="$style.pagingButton"
      :disabled="typePaging === 'none'"
      @click="changePaging('none')"
    >
      Сортировка и фильтрация
    </button>
    <button :class="$style.pagingButton"
      :disabled="typePaging === 'static'"
      @click="changePaging('static')"
    >
      Статическая пагинация
    </button>
    <button :class="$style.pagingButton"
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

<style module>
.pagingButton {
  margin: 20px 0;
  height: 40px;
  padding: 0 15px;
  font-size: 16px;
  color: var(--dark-grey);
  background-color: var(--light-blue);
  border: none;
  cursor: pointer;
}

.pagingButton:disabled{
  background: var(--light-green);
  font-weight: 600;
  cursor: default;
}
</style>
