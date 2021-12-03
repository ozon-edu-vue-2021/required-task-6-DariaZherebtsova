<script lang="jsx">
import { orderBy } from 'lodash/collection';
import debounce from 'lodash.debounce';
// import FilterDropdown from './filter-dropdown';
import DotsLoaderIcon from './dost-loader.svg';
import OzTablePaginator from './oz-table-paginator';

export default {
  name: 'oz-table',
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    totalPages: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 0
    },
    staticPaging: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sortProp: {},
      sortDirection: '',
      // filterProp: '',
      filterText: {},
    };
  },
  computed: {
    sortedRows() {
      let res =  [];
      let arrSortProps = [];
      let arrSortDirections = [];

      Object.keys(this.sortProp).forEach(prop => {
        if (this.sortProp[prop]?.changed) {
          arrSortProps.push(prop);
          arrSortDirections.push(this.sortProp[prop].direction);
        }
      })

      console.log('--arrSortProps', arrSortProps);

      if (arrSortProps.length) {
        console.log('--sort');
        res = orderBy(this.rows, arrSortProps, arrSortDirections);
      } else {
        res =  this.rows;
      }

      // if (!this.sortProp) {
      //   res =  this.rows;
      // } else {
      //   res = orderBy(this.rows, [this.sortProp], [this.sortDirection]);
      // }

      Object.keys(this.filterText).forEach(prop => {
        console.log('--filter prop', prop);
        console.log('--filter this.filterText[prop]', this.filterText[prop]);
        if (this.filterText[prop]) {
          res = res.filter(row => {
            return String(row[prop]).search(this.filterText[prop]) > -1
          })
        }
      });

      // res = res.filter(row => {
      //   return String(row[this.filterProp]).search(this.filterText) > -1
      // })

      return res;
    }
  },
  methods: {
    toggleSort(prop) {
      this.sortProp = {
        ...this.sortProp,
        [prop]: {
          changed: true,
          direction: (this.sortProp[prop]?.direction === 'desc' || !this.sortProp[prop]?.direction) ? 'asc' : 'desc',
        }
      };
      console.log('--this.sortProp', this.sortProp);
      // this.sortDirection = (this.sortDirection === 'desc' || !this.sortDirection) ? 'asc' : 'desc';
    },
    setFilterText(e) {
      this.filterText = e.target.value;
    },
    toggleFilter(e, prop) {
      console.log('---prop', prop);
      console.log('---e', e);
      // this.filterProp = prop;
      this.filterText = {
        ...this.filterText,
        [prop]: e.target.value,
      };
    },
    renderHead(h, columnsOptions) {
      const { $style, sortProp } = this;

      return columnsOptions.map((column) => {
        // console.log('---column', column);
        const renderedTitle = column.scopedSlots.title ? column.scopedSlots.title() : column.title;
        let sortIcon = 'sort';

        if (sortProp[column.prop]?.direction) {
          sortIcon = this.sortProp[column.prop].direction === 'asc' ? 'sort-amount-down' : 'sort-amount-up';
        }



        return (
          <th key={column.prop} class={$style.headerCell}>
            <div class={$style.headerCellContent}>
              <span>{renderedTitle}</span>
              <font-awesome-icon
                class={$style.sortIcon}
                icon={sortIcon}
                on={{ click: () => this.toggleSort(column.prop) }}
              />
              <input type="search"
                on={{ input: debounce((e) => this.toggleFilter(e, column.prop), 200) }}
                class={column.type === 'number' ? $style.headerCellInputSmall : ''}
              />
              <font-awesome-icon
                icon="filter"
              />
            </div>
          </th>
        );
      });
    },
    renderRows(h, columnsOptions) {
      return this.sortedRows.map((row, index) => {
        return <tr key={row.id || index}>{...this.renderColumns(h, row, columnsOptions)}</tr>;
      });
    },
    renderColumns(h, row, columnsOptions) {
      return columnsOptions.map((column) => {
        return (
          <td key={column.prop} class={this.$style.cell}>
            {column.scopedSlots.body ? column.scopedSlots.body({ row }) : row[column.prop]}
          </td>
        );
      });
    },
    getColumnOptions() {
      return this.$slots.default.
        filter(item => item.componentOptions && item.componentOptions.tag === 'oz-table-column').
        map(column =>
          Object.assign({}, column.componentOptions.propsData, {
              scopedSlots: column.data.scopedSlots || {}
            }
          )
        );
    },
    renderInfPager() {
      const directives = [
        {
          name: 'detect-viewport',
          value: {
            callback: this.$listeners.getPage
          }
        }
      ];

      const style = {
        background: `url("${DotsLoaderIcon}") no-repeat center`
      };

      return (
        <div {...{ class: this.$style.infPager, style, directives }} />
      );
    }
  },
  render(h) {
    const { $style, totalPages, currentPage, staticPaging, $listeners } = this;
    const { getPage } = $listeners;
    const columnsOptions = this.getColumnOptions();
    const columnsHead = this.renderHead(h, columnsOptions);
    const rows = this.renderRows(h, columnsOptions);



    return (
      <div>
        <table class={$style.table}>
          <thead>{...columnsHead}</thead>
          <tbody>{...rows}</tbody>
        </table>

        {staticPaging
          ? <OzTablePaginator totalPages={totalPages} currentPage={currentPage} on={{ getPage: getPage }} />
          : this.renderInfPager()
        }

      </div>  
    );
  }
};
</script>

<style module>
  .table {
    border-spacing: 0;
    margin: 8px;
    width: 100%;
  }

  .cell {
    text-align: left;
    border-bottom: 1px solid #c8cacc;
    padding: 1rem 1rem;
  }

  .headerCell {
    composes: cell;
    background: #75f8f8c0;
  }

  .headerCellContent {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }

  .headerCellInputSmall {
    width: 60px;
  }

  .sortIcon {
    margin-left: 8px;
    margin-right: 24px;
  }

  .sortIcon:hover {
    cursor: pointer;
  }
</style>
