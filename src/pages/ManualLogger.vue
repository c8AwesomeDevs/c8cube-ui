<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <div class="text-right">
          <md-button class="md-danger" @click="showDialog = true">New Batch</md-button>
        </div>
        <md-card>
          <md-card-header data-background-color="red">
            <h4 class="title">Batch List</h4>
          </md-card-header>
          <md-card-content>
            <md-table v-model="batches">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                  <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
                  <md-table-cell md-label="Description">{{ item.description }}</md-table-cell>
                  <md-table-cell md-label="Date Uploaded">{{ item.created_at }}</md-table-cell>
                  <!-- <md-table-cell md-label="Uploaded By">{{ item.uploaded_by }}</md-table-cell> -->
                  <md-table-cell md-label="Validated">
                    <md-icon :class="item.validated == 1 ? 'text-green' : 'text-gray'">check</md-icon>
                  </md-table-cell>
                  <md-table-cell md-label="Archived">
                    <md-icon :class="item.written ? 'text-green' : 'text-gray'">check</md-icon>
                  </md-table-cell>
                  <md-table-cell md-label="Data Set">
                    <md-button class="md-dense md-raised md-primary" @click="viewDetails(item.id)">Details</md-button>
                  </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>

    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Manual Logger Info</md-dialog-title>
      <md-dialog-content>
        <md-field>
          <label>Name</label>
          <md-input v-model="batch.name"></md-input>
        </md-field>
        <md-field>
          <label>Textarea</label>
          <md-textarea v-model="batch.description" required></md-textarea>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-danger" @click="saveBatch">Save</md-button>
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
    .text-green {
      color : green !important;
    }
    .text-gray {
      color : #ccc !important;
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
      batches : [],
      showDialog : false,
      batch : {},
      user : {}
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));

    axios({
        url : BASE_URL + '/manual-logger/batches',
        method : 'GET',
        headers : {
          'Authorization' : 'Bearer ' + this.user.token,
        }
      }).then(response => {
        this.batches = response.data;
      })
  },
  methods : {
    saveBatch() {
      axios({
        url : BASE_URL + '/manual-logger/batches',
        method : 'POST',
        data : this.batch,
        headers : {
          'Authorization' : 'Bearer ' + this.user.token,
          'Content-Type' : 'multipart/form-data'
        }
      }).then(response => {
        this.batches.push(response.data);
        this.showDialog = false;
      })
    },
    viewDetails(id) {
      this.$router.push({name : 'ManualLoggerDetails', params : {id : id}});
    }
  }
};
</script>
