<template>
  <div>
    <a-button class="editable-add-btn" @click="handleAdd">
      Add
    </a-button>
    <a-table
      :columns="columns"
      :row-key="record => record.login.uuid"
      :data-source="data"
      :loading="loading"
      style="min-width: 800px"
      :showHeader="false"
    >
      <template slot="name" slot-scope="text, record">
        {{ record.name.first }} {{ record.name.last }}
        <editable-cell
          :text="text"
          @change="onCellChange(record.login.uuid, 'name', $event)"
        />
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="data.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.login.uuid)"
        >
          <a href="javascript:">Delete</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>
<script>
import reqwest from "reqwest";

const EditableCell = {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="value" @change="handleChange" @pressEnter="check" /><a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
          />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
        </div>
      </div>
    `,
  props: {
    text: String
  },
  data() {
    return {
      value: this.text,
      editable: false
    };
  },
  methods: {
    handleChange(e) {
      this.value = e.target.value;
    },
    check() {
      this.editable = false;
      this.$emit("change", this.value);
    },
    edit() {
      this.editable = true;
    }
  }
};
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    width: "20%",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "Gender",
    dataIndex: "gender",
    filters: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" }
    ],
    width: "20%"
  },
  {
    title: "Email",
    dataIndex: "email"
  },
  {
    title: "operation",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" }
  }
];

export default {
  components: {
    EditableCell
  },
  data() {
    return {
      data: [],
      loading: false,
      columns
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch(params = {}) {
      console.log("params:", params);
      this.loading = true;
      reqwest({
        url: "https://randomuser.me/api",
        method: "get",
        data: {
          results: 5,
          ...params
        },
        type: "json"
      }).then(data => {
        // Read total count from server
        // pagination.total = data.totalCount;
        this.loading = false;
        this.data = data.results;
      });
    },
    onDelete(key) {
      const data = [...this.data];
      this.data = data.filter(item => item.login.uuid !== key);
    },
    handleAdd(params = {}) {
      this.loading = true;
      reqwest({
        url: "https://randomuser.me/api",
        method: "get",
        data: {
          results: 1,
          ...params
        },
        type: "json"
      }).then(data => {
        console.log("add data is", data.results[0]);
        // Read total count from server
        // pagination.total = data.totalCount;
        this.loading = false;
        this.data = [...this.data, data.results[0]];
      });
    },
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.dataSource];
      const target = dataSource.find(item => item.login.uuid === key);
      if (target) {
        target[dataIndex] = value;
        this.dataSource = dataSource;
      }
    }
  }
};
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
