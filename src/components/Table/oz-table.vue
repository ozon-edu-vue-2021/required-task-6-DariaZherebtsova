<script lang="jsx">
import { orderBy } from 'lodash/collection';
import debounce from 'lodash.debounce';
import DotsLoaderIcon from './dost-loader.svg';
import OzTablePaginator from './oz-table-paginator';
import getNextDirection from '../../utils/getNextDirection.js';

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
    typePaging: {
      type: String,
      default: 'none'
    },
    itemsPerPage: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      sortProps: {},
      isToggleSort: false,
      filterText: {},
    };
  },
  mounted() {

  },
  computed: {
    sortedRows() {
      let res =  [];
      let arrSortProps = Object.keys(this.sortProps).filter(item => this.sortProps[item] !== 'none');
      if (arrSortProps.length) {
        let arrSortDirections = arrSortProps.map(prop => this.sortProps[prop]);
        res = orderBy(this.rows, arrSortProps, arrSortDirections);
      } else {
        res =  this.rows;
      }

      Object.keys(this.filterText).forEach(prop => {
        if (this.filterText[prop]) {
          res = res.filter(row => {
            return String(row[prop]).search(this.filterText[prop]) > -1
          })
        }
      });

      if (this.typePaging === 'none') {
        this.resetCurrentPage();
      }

      if (this.typePaging === 'static') {
        res = this.getStaticPage(res);
      }

      if (this.typePaging === 'infinite') {
        res = this.getInfinitePage(res);
      }

      return res;
    }
  },
  methods: {
    toggleSort(prop) {
      this.isToggleSort = true;
      this.sortProps = {
        ...this.sortProps,
        [prop]: !this.sortProps?.[prop] ? getNextDirection('none') : getNextDirection(this.sortProps[prop]),
      };
    },
    setFilterText(e) {
      this.filterText = e.target.value;
    },
    toggleFilter(e, prop) {
      this.isToggleSort = true;
      this.filterText = {
        ...this.filterText,
        [prop]: e.target.value,
      };
    },
    renderHead(h, columnsOptions) {
      const { $style, sortProps } = this;

      return columnsOptions.map((column) => {
        const renderedTitle = column.scopedSlots.title ? column.scopedSlots.title() : column.title;
        let sortIcon = 'sort';

        if (sortProps?.[column.prop] && sortProps[column.prop] !== 'none') {
          sortIcon = this.sortProps[column.prop] === 'asc' ? 'sort-amount-down' : 'sort-amount-up';
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
    setItemsPerPage(e) {
      this.$emit('setItemsPerPage', Number(e.target.value));
    },
    renderStaticPager() {
      const { totalPages, currentPage, $listeners } = this;
      const { getPage } = $listeners;
      const listOptions = [5, 10, 20, 50].map((number) => {
        if (number === this.itemsPerPage) {
          return <option selected value={number}>{number}</option>
        } else {
          return <option value={number}>{number}</option>
        }
      });

      return (
        <div class={ this.$style.staticPager }>
          <OzTablePaginator totalPages={totalPages} currentPage={currentPage} on={{ getPage: getPage }} />
          <select class={ this.$style.staticPagerSelect } on={{ change: (e) => this.setItemsPerPage(e) }} name="select" size="1">
            {listOptions}
          </select>
        </div>
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
    },
    resetCurrentPage() {
      if (this.isToggleSort) {
        this.$emit('resetCurrentPage');
        this.isToggleSort = false;
      }
    },
    getStaticPage(rows) {
      this.resetCurrentPage();

      let start = (this.currentPage - 1) * this.itemsPerPage;
      let end = start + this.itemsPerPage;
      end = rows.length && end > rows.length ? rows.length : end;

      return rows.slice(start, end);
    },
    getInfinitePage(rows) {
      this.resetCurrentPage();

      let end = this.currentPage === 1 ? 20 : this.currentPage * 10;
      end = rows.length && end > rows.length ? rows.length : end;

      return rows.slice(1, end);
    },
  },
  render(h) {
    const { $style, typePaging } = this;
    const columnsOptions = this.getColumnOptions();
    const columnsHead = this.renderHead(h, columnsOptions);
    const rows = this.renderRows(h, columnsOptions);



    return (
      <div>
        <table class={$style.table}>
          <thead>{...columnsHead}</thead>
          <tbody>{...rows}</tbody>
        </table>

        {typePaging === 'static'
          ? this.renderStaticPager() 
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
    border-bottom: 1px solid var(--grey);
    padding: 1rem 1rem;
  }

  .headerCell {
    composes: cell;
    background: var(--light-blue);
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .headerCellContent {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;
  }

  .headerCellInputSmall {
    width: 50px;
  }

  .sortIcon {
    margin-left: 8px;
    margin-right: 24px;
  }

  .sortIcon:hover {
    cursor: pointer;
  }

  .staticPager {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #c8cacc;
    margin-left: 8px;
  }

  .staticPagerSelect {
    border: none;
  }
</style>
