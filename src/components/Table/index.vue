<template>
  <oz-table
    :rows="rows"
    :total-pages="50"
    :current-page="currentPage"
    :static-paging="typePaging === 'static'"
    @getPage="getData"
    @resetCurrentPage="resetCurrentPage"
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
    if (this.typePaging === 'none') {
      this.getAll();
    } else {
      this.blockingPromise = this.getAll();
    }
  },
  data() {
    return {
      rows: [],
      currentPage: 1,
      blockingPromise: null,
    };
  },
  watch: {
    typePaging() {
      this.rows = [];
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
          this.getPage(number ? number : this.currentPage);
          // this.getAll();
          break;

        case 'infinite':
          if (!this.blockingPromise) {
            this.blockingPromise = this.getPage(1);
            this.blockingPromise = this.infGetPage();
            this.blockingPromise = this.infGetPage();
          } else {
            this.blockingPromise =this.infGetPage();
          }
          break;  
      
        default:
          break;
      }
    },
    async getAll() {
      const res = await fetch(`https://jsonplaceholder.typicode.com/comments`);
      this.rows = await res.json();
    },
    async getPage(number) {
      console.log('--getPage', number);
      if (!this.rows.length) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments`);
        this.rows = await res.json();
      }
      // const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${number}`);
      // this.rows = await res.json();
      this.currentPage = number;
    },
    async infGetPage() {
      this.blockingPromise && await this.blockingPromise;
      const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${this.currentPage + 1}`);
      const newRows = await res.json();
      this.rows = [...this.rows, ...newRows];
      this.currentPage++;
    },
    resetCurrentPage() {
      console.log('--resetCurrentPage');
      this.currentPage = 1;
    }
  }
};
</script>
