<template>
  <div :class="$style.tableWrapper">
    <oz-table
      v-if="Boolean(rows.length)"
      :rows="rows"
      :items-per-page="itemsPerPage"
      :total-pages="totalPages"
      :current-page="currentPage"
      :type-paging="typePaging"
      @getPage="getData"
      @resetCurrentPage="resetCurrentPage"
      @setItemsPerPage="setItemsPerPage"
    >
      <oz-table-column prop="id" title="ID" type="number" />
      <oz-table-column prop="postId" title="Post ID" type="number"/>

      <oz-table-column prop="email" type="string">
        <template #title>
          <b>Email</b>
        </template>

        <template #body="{ row }">
          <a :href="`mailto:${row.email}`">{{ row.email }}</a>
        </template>
      </oz-table-column>

      <oz-table-column prop="name" title="Name" type="string" />
    </oz-table>
    <div v-else :class="$style.loader"></div>
  </div>
</template>

<script>
import OzTable from './oz-table';
import OzTableColumn from './oz-table-column';

export default {
  name: 'TableWrapper',
  components: {
    OzTableColumn,
    OzTable
  },
  props: {
    typePaging: {
      type: String,
      default: 'none'
    },
  },
  created() {
    this.getAll();
  },
  data() {
    return {
      rows: [],
      currentPage: 1,
      itemsPerPage: 10, 
    };
  },
  computed: {
    totalPages() {
      return 500 / this.itemsPerPage;
    }
  },
  watch: {
    typePaging() {
      this.currentPage = 1;
      this.blockingPromise = null;
      this.getData();
    }
  },
  methods: {
    async getData(number) {
      switch (this.typePaging) {
        case 'none':
          this.getAll();
          break;
        
        case 'static':
          this.currentPage = number ? number : this.currentPage;
          break;

        case 'infinite':
          this.currentPage++;
          break;  
      
        default:
          break;
      }
    },
    async getAll() {
      const res = await fetch(`https://jsonplaceholder.typicode.com/comments`);
      this.rows = await res.json();
    },
    resetCurrentPage() {
      this.currentPage = 1;
      window.scrollTo(0, 0);
    },
    setItemsPerPage(number) {
      this.itemsPerPage = number;
      this.currentPage = 1;
    }
  }
};
</script>

<style module>
.tableWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.loader {
  margin-top: 100px;
  border: 16px solid var(--light-grey);
  border-top: 16px solid var(--light-green);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
