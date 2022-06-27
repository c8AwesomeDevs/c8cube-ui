<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <div class="text-right">
          <md-button class="md-danger" @click="addUser">Add User</md-button>
        </div>
        <md-card>
          <md-card-header data-background-color="red">
            <h4 class="title">Users List</h4>
          </md-card-header>
          <md-card-content>
            <md-table v-model="users">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                  <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
                  <md-table-cell md-label="Email">{{ item.email }}</md-table-cell>
                  <md-table-cell md-label="Access Level">{{ item.access_level }}</md-table-cell>
                  <md-table-cell md-label="Action">
                    <md-button @click="editUser(item)" class="md-warning md-sm simple"><md-icon>edit</md-icon> Edit</md-button>
                    <md-button @click="confirmDeletion(item)" class="md-danger md-sm simple"><md-icon>delete</md-icon> Del</md-button>
                  </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <md-dialog :md-active.sync="dialog">
        <md-progress-bar md-mode="indeterminate" class="md-accent" v-if="loading"></md-progress-bar>
        <md-dialog-title>User Details</md-dialog-title>
            <md-dialog-content class="md-dialog-lg">
                <md-field>
                    <label>Name</label>
                    <md-input v-model="user_details.name"></md-input>
                </md-field>
                <md-field>
                    <label>Email</label>
                    <md-input v-model="user_details.email" type="email"></md-input>
                </md-field>
                <md-field v-if="user_details.id == undefined">
                    <label>Password</label>
                    <md-input v-model="user_details.password" type="password"></md-input>
                </md-field>
                <md-field v-if="user_details.id == undefined">
                    <label>Confirm Password</label>
                    <md-input v-model="user_details.password_confirmation" type="password"></md-input>
                </md-field>

                <div class="md-layout">
                    <div class="md-layout-item"><md-radio v-model="user_details.access_level" value="admin">Admin</md-radio></div>
                    <div class="md-layout-item"><md-radio v-model="user_details.access_level" value="uploader">Uploader</md-radio></div>
                    <div class="md-layout-item"><md-radio v-model="user_details.access_level" value="validator">Validator</md-radio></div>
                </div>
            </md-dialog-content>
        <md-dialog-actions>
            <md-button class="md-danger" :disabled="loading" @click="saveUser()">Save</md-button>
        </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="confirmation_dialog">
      <md-dialog-title>Delete Account</md-dialog-title>
      <md-dialog-content>
          This account ({{ user_details.name }}) will be deleted permanently. <br>
          Are you sure you want to continue?
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-default" @click="confirmation_dialog = false">No</md-button>
        <md-button class="md-danger" @click="deleteUser()">Yes</md-button>
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
  name: "Users",
  metaInfo : {
    title : 'C8 Cube | Users'
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
        users : [],
        user : {},
        user_details : {},
        dialog : false,
        confirmation_dialog : false,
        loading : false
    };
  },
  mounted() {
      this.user = JSON.parse(localStorage.getItem('user'));

      axios({
          url : BASE_URL + '/users',
          method : 'GET',
          headers : {
              Authorization : 'Bearer ' + this.user.token
          }
      }).then(response => {
          this.users = response.data;
      }).catch(ex => {
          alert(JSON.stringify(ex));
      })
  },
  methods : {
    addUser() {
        this.user_details = {};
        this.dialog = true;
    },
    editUser(u) {
        this.user_details = u;
        this.dialog = true;
    },
    confirmDeletion(u) {
        this.user_details = u;
        this.confirmation_dialog = true;
    },
    deleteUser() {
        axios({
            url : BASE_URL + '/users/' + this.user_details.id,
            method : 'DELETE',
            headers : {
                Authorization : 'Bearer ' + this.user.token
            }
        }).then(response => {
            this.users = response.data;
        }).catch(ex => {
            alert(JSON.stringify(ex));
        })
    },
    saveUser() {
        if(this.user_details.id == undefined) {
            axios({
                url : BASE_URL + '/users',
                method : 'POST',
                data : this.user_details,
                headers : {
                    'Authorization' : 'Bearer ' + this.user.token,
                    'Content-Type' : 'multipart/form-data'
                }
            }).then(response => {
                this.users.push(response.data);
                this.dialog = false;
            }).catch(ex => {
                alert(JSON.stringify(ex));
            })
        }
        else {
            axios({
                url : BASE_URL + '/users/' + this.user_details.id,
                method : 'POST',
                data : this.user_details,
                headers : {
                    'Authorization' : 'Bearer ' + this.user.token,
                    'Content-Type' : 'multipart/form-data'
                }
            }).then(response => {
                this.users = response.data;
                this.dialog = false;
            }).catch(ex => {
                alert(JSON.stringify(ex));
            })
        }
    }
  }
};
</script>
