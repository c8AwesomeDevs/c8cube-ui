<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <div class="text-right" v-if="user.access_level == 'uploader' || user.access_level == 'admin'">
          <md-button class="md-danger" @click="showDialog = true">Upload Certificate</md-button>
        </div>
        <md-card>
          <md-card-header data-background-color="red">
            <h4 class="title">Certificates List</h4>
          </md-card-header>
          <md-card-content>
            <md-table v-model="certificates">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                  <md-table-cell md-label="File Name">{{ item.filename }}</md-table-cell>
                  <md-table-cell md-label="Certificate Type">{{ item.certificate_type }}</md-table-cell>
                  <md-table-cell md-label="Date Uploaded">{{ item.created_at }}</md-table-cell>
                  <md-table-cell md-label="Uploaded By">{{ item.uploaded_by }}</md-table-cell>
                  <md-table-cell md-label="Status">
                      <md-button 
                          @click="viewDetails(item)"
                          class="md-sm no-margin"
                          :class="statusColors[item.status]" >
                          {{ item.status }}
                      </md-button>
                  </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>

    <md-dialog :md-active.sync="showDialog">
        <md-dialog-title>Upload Certificate</md-dialog-title>
            <md-dialog-content class="md-dialog-lg">
                <md-radio v-model="certificate.certificate_type" value="coal">
                    COAL
                </md-radio>
                <md-radio v-model="certificate.certificate_type" value="dga">
                    DGA
                </md-radio>
                 <md-field>
                    <label>Upload files</label>
                    <md-file @change="handleFileUpload( $event )" placeholder="Upload Certificate" accept="application/pdf"/>
                </md-field>
            </md-dialog-content>
        <md-dialog-actions>
            <md-button class="md-success" @click="uploadFile()">Upload</md-button>
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
</style>
<script>
import axios from 'axios';
import {BASE_URL} from '../components/Config/BASE_URL';

export default {
  name: "certificates",
  metaInfo : {
    title : 'C8 Cube | Certificates'
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
        showDialog : false,
        certificate : {certificate_type : 'coal'},
        file : null,
        certificates : [],
        statusColors : {
          queued : '',
          processing : 'md-warning',
          extracted : 'md-info',
          validated : 'md-primary',
          archived : 'md-success',
          failed : 'md-danger'
        },
        user : {}
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    axios
      .get(BASE_URL + '/certificates', {headers : {'Authorization' : 'Bearer ' + this.user.token}})
      .then(response => {
          this.certificates = response.data;
      });
  },
  methods : {
    uploadFile() {
        let formData = new FormData();
        formData.append('file', this.file);
        formData.append('certificate_type', this.certificate.certificate_type);

        axios.post(BASE_URL + '/certificates',
            formData,
            {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Bearer ' + this.user.token
            }
            }
        ).then(response => {
            this.showDialog = false;
            this.certificates.unshift(response.data);
        })
        .catch(function(){
            console.log('FAILURE!!');
        });
    },
    handleFileUpload(e){
        // this.file = this.$refs.file.files[0];
        let file = e.target.files[0];
        this.file = file;
    },
    viewDetails(certificate) {
      if(certificate.validated == 1) {
        this.$router.push({name : 'CertificateDetailsValidated', params : {id : certificate.id}});
      }
      else {
        this.$router.push({name : 'CertificateDetails', params : {id : certificate.id}});
      }
    }
  }
};
</script>
