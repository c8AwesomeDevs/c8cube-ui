<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-button :to="{name : 'Certificates'}" class="md-success md-simple md-dense" >
            <md-icon>arrow_left</md-icon> Back to Certificates List
        </md-button>
        <md-card>
            <md-card-header data-background-color="red">
                <h4 class="title">
                     Certificate Details
                </h4>
            </md-card-header>
            <md-card-content>
              <div class="md-layout">
                <div class="md-layout-item">
                    <md-field>
                        <label>Certificate Number</label>
                        <md-input v-model="metadata.certificate_number"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item">
                    <md-field>
                        <label>Date</label>
                        <md-input v-model="metadata.certificate_date" required></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item">
                    <md-field v-if="certificate.certificate_type == 'coal'">
                        <label>Vessel</label>
                        <md-input v-model="metadata.vessel_name" required></md-input>
                    </md-field>
                </div>
              </div>

              <md-table md-card>
                <md-table-row :key="d.id" v-for="d in data">
                    <md-table-cell md-label="Parameter">
                      <md-field class="no-margin outline">
                        <label>Parameter</label>
                        <md-input v-model="d.parameter"></md-input>
                      </md-field>
                    </md-table-cell>
                    <md-table-cell md-label="Tag Name">
                      <md-field class="no-margin">
                        <label>PI Tag Name</label>
                        <md-input v-model="d.tagname"></md-input>
                      </md-field>
                    </md-table-cell>
                    <md-table-cell md-label="Data Type">
                      <md-field class="no-margin">
                        <md-icon class="md-danger">{{d.value ? 'check' : 'warning'}}</md-icon>
                        <label>Value</label>
                        <md-input v-model="d.value"></md-input>
                      </md-field>
                    </md-table-cell>
                </md-table-row>
              </md-table>
              
              <div class="md-layout">
                <div class="md-layout-item">
                  <md-button class="md-warning no-margin" @click="update" :disabled="loading">Update</md-button>
                </div>
                <div class="md-layout-item text-right">
                  <md-button class="md-success no-margin" @click="writeToPI" :disabled="loading">Write To PI</md-button>
                </div>
              </div>
            </md-card-content>
        </md-card>
      </div>
    </div>
    <md-dialog :md-active.sync="alert">
        <md-dialog-title>{{ dialogTitle }}</md-dialog-title>
        <md-dialog-content>
            {{ dialogMessage }}
        </md-dialog-content>
        <md-dialog-actions>
            <md-button class="md-primary md-simple" @click="alert = false">OK</md-button>
        </md-dialog-actions>
    </md-dialog>
  </div>
</template>
<style scoped>
  .no-margin {
    margin : 0;
  }
</style>
<script>
import axios from 'axios';
import {BASE_URL} from '../components/Config/BASE_URL';
export default {
  name: "Certificate-Details",
  metaInfo : {
    title : 'C8 Cube | Certificated Details'
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
        metadata : {},
        data : [],
        dialogMessage : null,
        dialogTitle : null,
        alert : false,
        loading : false,
        user : {},
        certificate : {}
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    axios({
      url : BASE_URL + '/parse-data/' + this.$route.params.id,
      method : 'GET',
      headers : {Authorization : 'Bearer ' + this.user.token}
    }).then(response => {
        this.metadata = response.data.certificate;
        this.data = response.data.parameters;
        this.certificate = response.data.certificate;
    });
  },
  methods : {
    update() {
        this.loading = true;
        axios({
            url : BASE_URL + '/certificates/'+ this.$route.params.id +'/update-data',
            method : 'POST',
            data : {data : this.data, metadata : this.metadata},
            headers : {
              'Content-Type' : 'application/json',
              'Authorization' : 'Bearer ' + this.user.token
            }
        }).then(response => {
            this.loading = false;
            this.alert = true;
            this.dialogTitle = 'Success';
            this.dialogMessage = 'Parameters have been updated'

            this.metadata = response.data.certificate;
            this.data = response.data.parameters;
        }).catch(error => {
            this.loading = false;
            this.alert = true;
            this.dialogTitle = 'Error';
            this.dialogMessage = "Error " + error.response.status + "<br/> Please Contact your System Administrator."
        });
    },
    writeToPI() {
        this.loading = true;
        axios({
            url : BASE_URL + '/certificates/'+ this.$route.params.id +'/write-to-pi',
            method : 'POST',
            data : {data : this.data},
            headers : {
              'Content-Type' : 'application/json',
              'Authorization' : 'Bearer ' + this.user.token
            }
        }).then(response => {
            this.loading = false;
            this.alert = true;
            this.dialogTitle = 'Success';
            this.dialogMessage = 'Data has been written to PI.'
        }).catch(error => {
            this.loading = false;
            this.alert = true;
            this.dialogTitle = 'Error';
            this.dialogMessage = "Error " + error.response.status + "<br/> Please Contact your System Administrator."
        });
    }
  }
};
</script>