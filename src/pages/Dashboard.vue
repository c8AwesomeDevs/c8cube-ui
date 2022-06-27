<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33"
      >
        <stats-card data-background-color="gray">
          <template slot="header">
            <md-icon>pending_actions</md-icon>
          </template>

          <template slot="content">
            <p class="category">Queued</p>
            <h3 class="title">{{ details.queued }}</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              Total Number of Uploaded Certificates
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>document_scanner</md-icon>
          </template>

          <template slot="content">
            <p class="category">Processing</p>
            <h3 class="title">
              {{ details.processing }}
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              Total Number of Certificates on Process
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33"
      >
        <stats-card data-background-color="blue">
          <template slot="header">
            <md-icon>post_add</md-icon>
          </template>

          <template slot="content">
            <p class="category">Extracted</p>
            <h3 class="title">
              {{ details.extracted }}
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              Total Number of Extracted Certificates
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33"
      >
        <stats-card data-background-color="purple">
          <template slot="header">
            <md-icon>task</md-icon>
          </template>

          <template slot="content">
            <p class="category">Validated</p>
            <h3 class="title">
              {{ details.validated }}
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              Total Number of Validated Certificates
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33"
      >
        <stats-card data-background-color="green">
          <template slot="header">
            <md-icon>archive</md-icon>
          </template>

          <template slot="content">
            <p class="category">Archived</p>
            <h3 class="title">
              {{ details.archived }}
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              Total Number of Archived Certificates
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-33"
      >
        <stats-card data-background-color="red">
          <template slot="header">
            <md-icon>assignment_late</md-icon>
          </template>

          <template slot="content">
            <p class="category">Failed</p>
            <h3 class="title">
              {{ details.failed }}
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              Total Number of Failed Certificates
            </div>
          </template>
        </stats-card>
      </div>
    </div>
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="red">
            <h4 class="title">Recent Activities</h4>
          </md-card-header>
          <md-card-content>
            <md-table v-model="logs">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Date">
                  {{ item.created_at }}
                </md-table-cell>
                <md-table-cell md-label="Activity Description">
                  {{ item.description }}
                </md-table-cell>
                <md-table-cell md-label="Performed By">
                  {{ item.name }}
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {BASE_URL} from '../components/Config/BASE_URL';
import {
  StatsCard,
} from "@/components";

export default {
  name : 'Dashboard',
  metaInfo : {
    title : 'C8 Cube | Dashboard'
  },
  components: {
    StatsCard,
  },
  data() {
    return {
      details : {
        queued : 0,
        processing : 0,
        extracted : 0,
        validated : 0,
        archived : 0,
        failed : 0
      },
      user : {},
      logs : []
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
    axios({
      url : BASE_URL + '/dashboard',
      method : 'GET',
      headers : {
        Authorization : 'Bearer ' + this.user.token
      }
    }).then(response => {
        response.data.certificates.forEach(c => {
          this.details[c.status] = c.total;
        });

        this.logs = response.data.logs.map(log => {
          var timestamp = new Date(log.created_at);
          log.created_at = timestamp.toLocaleString();
          return log;
        });
    })
  }
};
</script>
