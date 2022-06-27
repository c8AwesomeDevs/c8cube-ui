<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <div class="text-right">
          <md-button class="md-danger" @click="showUploadDialog = true">Bulk Upload</md-button>
        </div>
        <md-card>
          <md-card-header data-background-color="red">
            <h4 class="title">Batch List</h4>
          </md-card-header>
          <md-card-content>
              <div class="text-right">
                  <md-button class="md-sm" @click="configureColumns">Update Columns</md-button>
              </div>
              <md-table>
                    <md-table-row>
                        <md-table-head v-for="c in columns" :key="c.text">
                            {{ c }}
                        </md-table-head>
                    </md-table-row>
                    <md-table-row v-for="(r, r_idx) in rows" :key="r_idx">
                      <md-table-cell v-for="(c, c_idx) in columns" :key="c_idx">
                        <md-field class="no-margin" v-if="c_idx == 0">
                          <label>YYYY-MM-dd HH:mm:ss</label>
                          <md-input v-model="r.values[c_idx]"></md-input>
                        </md-field>
                        <md-field class="no-margin" v-if="c_idx > 0">
                          <label>{{ c }}</label>
                          <md-input v-model="r.values[c_idx]"></md-input>
                        </md-field>
                      </md-table-cell>
                    </md-table-row>
              </md-table>
              <div class="text-left">
                <md-button class="md-sm md-default" @click="addRow">Add Row</md-button>
              </div>
              <div class="text-right">
                <md-button class="md-normal md-warning" :disabled="loading" @click="saveData">Save Only</md-button>
                <md-button class="md-normal md-success" :disabled="loading" @click="saveAndWrite">Save & Write to PI</md-button>
              </div>
          </md-card-content>
        </md-card>
      </div>
    </div>

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Columns</md-dialog-title>
      <md-dialog-content>
        <md-table>
            <md-table-row v-for="(c, idx) in columns_collection" :key="c.idx">
                <md-table-cell v-if="idx > 0">
                    <md-field class="no-margin">
                        <label>Column Name</label>
                        <md-input v-model="c.value"></md-input>
                    </md-field>
                </md-table-cell>
            </md-table-row>
        </md-table>
        <div class="text-right">
            <md-button class="md-sm" @click="addColumn">Add</md-button>
        </div>
        <md-button class="md-danger md-block" @click="saveColumns">Save and Close</md-button>
      </md-dialog-content>
    </md-dialog>

    <md-dialog :md-active.sync="showUploadDialog">
      <md-dialog-title>Upload CSV File</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>Upload files</label>
          <md-file @change="handleFileUpload($event)" accept=".csv" placeholder="A nice input placeholder" />
        </md-field>
        <div class="text-center">
          <img src="@/assets/img/manual-logger-format.jpg" alt="" height="50">
        </div>

        <md-button class="md-danger md-block" @click="uploadFile" :disabled="loading">Upload File</md-button>
      </md-dialog-content>
    </md-dialog>

    <md-dialog :md-active.sync="alertDialog">
      <md-dialog-title>{{ alert.title }}</md-dialog-title>
      <md-dialog-content>
        {{ alert.message }}
      </md-dialog-content>
      <md-dialog-actions>
        <md-button :class="alert.class" @click="alertDialog=false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>
<style scoped>
    .md-dialog-lg {
        width : 500px;
    }
    .no-margin {
        margin : 0;
    }
    .pl-0 {
      padding-left : 0px;
    }
    .pr-0 {
      padding-right : 0px;
    }
</style>
<script>
import axios from 'axios';
import {BASE_URL} from '../components/Config/BASE_URL';

export default {
  name: "Manual-Logger",
  metaInfo : {
    title : 'C8 Cube | Manual Logger'
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading : false,
      batches : [],
      showDialog : false,
      showUploadDialog : false,
      alertDialog : false,
      batch : {},
      user : {},
      columns : ['Timestamp', 'Tag 1'],
      rows : [],
      columns_collection : [],
      file : null,
      alert : {}
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));

    axios({
        url : BASE_URL + '/manual-logger/batches/' + this.$route.params.id,
        method : 'GET',
        headers : {
          'Authorization' : 'Bearer ' + this.user.token,
        }
      }).then(response => {
        let data = JSON.parse(response.data.data);
        this.columns = data.columns;
        this.rows = data.rows;
      })
  },
  methods : {
    configureColumns() {
        this.columns_collection = [];
        this.columns.forEach((c, idx) => {
            this.columns_collection.push({value : c})
        });

        this.showDialog = true;
    },
    addColumn() {
        this.columns_collection.push({
            value : ''
        });
    },
    addRow() {
      this.rows.push({values : []})
    },
    saveColumns() {
        this.columns = this.columns_collection.map(c => {
            return c.value;
        });
    },
    saveData() {
      this.loading = true;
      axios({
        url : BASE_URL + '/manual-logger/batches/' + this.$route.params.id,
        method : 'POST',
        data : {rows : this.rows, columns : this.columns},
        headers : {
          'Authorization' : 'Bearer ' + this.user.token,
        }
      }).then(response => {
        let data = JSON.parse(response.data.data);
        this.columns = data.columns;
        this.rows = data.rows;
        
        this.alertDialog = true;
        this.alert = {
          class : 'md-success',
          title : 'Success!',
          message : 'Data has been saved!'
        };
        this.showDialog = false;
        this.loading = false;
      }).catch(err => {
        alert(JSON.stringify(err));
        this.loading = false;
      })
    },
    saveAndWrite() {
      this.loading = true;
      axios({
        url : BASE_URL + '/manual-logger/batches/' + this.$route.params.id + '/write',
        method : 'POST',
        data : {rows : this.rows, columns : this.columns},
        headers : {
          'Authorization' : 'Bearer ' + this.user.token,
        }
      }).then(response => {
        this.alertDialog = true;
        this.alert = {
          class : 'md-success',
          title : 'Success!',
          message : 'Data has been saved and Written to PI!'
        };

        this.loading = false;
      })
    },
    handleFileUpload(e) {
      let file = e.target.files[0];
      this.file = file;
    },
    uploadFile() {
      this.loading = true;
      axios({
        url : BASE_URL + '/manual-logger/batches/' + this.$route.params.id + '/csv',
        method : 'POST',
        data : {file : this.file},
        headers : {
          'Content-Type' : 'multipart/form-data',
          'Authorization' : 'Bearer ' + this.user.token,
        }
      }).then(response => {
        let data = JSON.parse(response.data.data);
        this.columns = data.columns;
        this.rows = data.rows;
        this.showUploadDialog = false;
        this.loading = false;
      }).catch(err => {
        alert(JSON.stringify(err));
        this.loading = false;
      })
    }
  }
};
</script>
