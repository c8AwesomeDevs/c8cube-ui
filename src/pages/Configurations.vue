<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
            <md-card-header data-background-color="green">
                <h4 class="title">PI Web API Settings</h4>
            </md-card-header>
            <md-card-content>
                <div class="md-layout">
                    <div class="md-layout-item">
                        <md-field>
                            <label>Base URL</label>
                            <md-input v-model="url"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item">
                        <md-field>
                            <label>Username</label>
                            <md-input v-model="username"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item">
                        <md-field>
                            <label>Password</label>
                            <md-input type="password" v-model="password"></md-input>
                        </md-field>
                    </div>
                </div>
                <div class="md-layout">
                    <div class="md-layout-item">
                    </div>
                    <div class="md-layout-item">
                    </div>
                    <div class="md-layout-item text-right">
                        <md-button class="md-raised md-success">Save</md-button>
                    </div>
                </div>
            </md-card-content>
        </md-card>
      </div>
    </div>
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
export default {
  name: "configurations",
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
        file : null,
        certificates : []
    };
  },
  mounted() {
    axios
      .get('http://localhost:8000/api/certificates')
      .then(response => {
          this.certificates = response.data;
      });
  },
  methods : {
  }
};
</script>
