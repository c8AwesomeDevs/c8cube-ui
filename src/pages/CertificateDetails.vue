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
                <h4 class="title">Certificate Details</h4>
            </md-card-header>
            <md-card-content>
              <div class="md-layout">
                <div class="md-layout-item">
                    <md-field>
                        <label>Certificate Number</label>
                        <md-input v-model="metadata.certificate_number" ref="certificate" required></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item">
                    <md-field>
                        <label>Date (YYYY-MM-DD)</label>
                        <md-input v-model="metadata.date" required></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item">
                    <md-field v-if="certificate.certificate_type == 'coal'">
                        <label>Vessel</label>
                        <md-input v-model="metadata.vessel" required></md-input>
                    </md-field>
                </div>
              </div>

              <md-table md-card>
                <md-table-row :key="c.id" v-for="c in configurations">
                    <md-table-cell md-label="Parameter">
                      <md-field class="no-margin outline">
                        <label>Parameter</label>
                        <md-input v-model="c.parameter"></md-input>
                      </md-field>
                    </md-table-cell>
                    <md-table-cell md-label="Tag Name">
                      <md-field class="no-margin">
                        <label>PI Tag Name</label>
                        <md-input v-model="c.tagname"></md-input>
                      </md-field>
                    </md-table-cell>
                    <md-table-cell md-label="Data Type">
                      <md-field class="no-margin">
                        <md-icon class="md-danger">{{c.value ? 'check' : 'warning'}}</md-icon>
                        <label>Value</label>
                        <md-input v-model="c.value"></md-input>
                      </md-field>
                    </md-table-cell>
                </md-table-row>
              </md-table>
              
              <div class="md-layout" v-if="user.access_level == 'validator'">
                <div class="md-layout-item">
                  
                </div>
                <div class="md-layout-item text-right">
                  <md-button class="md-warning no-margin" @click="validate">Validate</md-button>
                </div>
              </div>
            </md-card-content>
        </md-card>
      </div>
    </div>
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
        showDialog : false,
        certificate : {},
        metadata : {},
        file : null,
        certificates : [],
        configurations : [],
        user : {}
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    axios.get(BASE_URL + '/parse-data/' + this.$route.params.id, 
        {headers : {'Authorization' : 'Bearer ' + this.user.token}}
      )
      .then(response => {
        if(response.data.certificate.validated == 1) {
          this.$router.push({
            name : 'CertificateDetailsValidated',
            params : {id : this.$route.params.id}
          });
          return;
        }
        var details = response.data;
        this.metadata = details.metadata;
        this.data = details.data;
        this.certificate = details.certificate;

        this.configurations = response.data.configurations.map(c => {
          c.value = this.data[c.parameter];
          return c;
        });
      });
  },
  methods : {
    validate() {
      let errorCount = this.checkForm();
      if(errorCount.length > 0) {
        alert(errorCount.join("\n"));
        return;
      }

      axios({
        url : BASE_URL + '/certificates/'+ this.$route.params.id +'/validate',
        method : 'POST',
        data : {data : this.configurations, metadata : this.metadata},
        headers : {
          Authorization : 'Bearer ' + this.user.token
        }
      }).then(response => {
        this.$router.push({name : 'CertificateDetailsValidated', params : {id : this.$route.params.id}})
      })
    },
    checkForm() {
      let errors = [];
      if(!this.metadata.certificate_number) {
        errors.push('Certificate Number is Required');
      }
      if(!this.metadata.date) {
        errors.push('Date is Required');
      }
      if(!this.metadata.vessel && this.certificate.certificate_type == 'coal') {
        errors.push('Vessel Name is Required');
      }

      this.configurations.forEach(c => {
        if(!c.value) {
          errors.push(c.parameter + " value is required.");
        }
      });

      return errors;
    }
  }
};
</script>