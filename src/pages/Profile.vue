<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50"
      >
        <md-card>
            <md-card-header data-background-color="red">
                <h4 class="title">My Profile</h4>
            </md-card-header>
            <md-card-content>
                <md-field>
                    <label>Name</label>
                    <md-input v-model="profile.name" readonly></md-input>
                </md-field>
                <md-field>
                    <label>Email</label>
                    <md-input v-model="profile.email" readonly></md-input>
                </md-field>
                <md-field>
                    <label>Level</label>
                    <md-input v-model="profile.access_level" readonly></md-input>
                </md-field>
                <md-field>
                    <label>Date Registered</label>
                    <md-input v-model="profile.created_at" readonly></md-input>
                </md-field>
            </md-card-content>
            <md-card-actions>
                <md-button class="md-danger" @click="showResetPassword()">Reset Password</md-button>
            </md-card-actions>
        </md-card>
      </div>
    </div>
    <md-dialog :md-active.sync="showDialog">
        <md-progress-bar md-mode="indeterminate" class="md-accent" v-if="loading"></md-progress-bar>
        <md-dialog-title>Password Reset</md-dialog-title>
            <md-dialog-content class="md-dialog-lg">
                <md-field>
                    <label>Current Password</label>
                    <md-input v-model="password.current_password" type="password"></md-input>
                </md-field>
                <div class="md-layout">
                    <div class="md-layout-item no-padding-left">
                        <md-field>
                            <label>New Password</label>
                            <md-input v-model="password.new_password" type="password"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item no-padding-right">
                        <md-field>
                            <label>Confirm New Password</label>
                            <md-input v-model="password.confirm_password" type="password"></md-input>
                        </md-field>
                    </div>
                </div>
            </md-dialog-content>
        <md-dialog-actions>
            <md-button class="md-danger" :disabled="loading" @click="resetPassword()">Reset Password</md-button>
        </md-dialog-actions>
    </md-dialog>
  </div>
  
</template>
<style scoped>
    .no-padding-left {
        padding-left : 0;
    }
    .no-padding-right {
        padding-right : 0;
    }
</style>
<script>
import axios from 'axios';
import {BASE_URL} from '../components/Config/BASE_URL';

export default {
    name: "Profile",
    metaInfo : {
        title : 'C8 Cube | Profile'
    },
    data() {
        return {
            user : {},
            profile : {},
            showDialog : false,
            password : {},
            loading : false
        }
    },
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        axios({
            url : BASE_URL + '/profile',
            method : 'GET',
            headers : {
            Authorization : 'Bearer ' + this.user.token
            }
        }).then(response => {
            this.profile = response.data;
        })
    },
    methods : {
        showResetPassword() {
            this.showDialog = true;
        },
        resetPassword() {
            if(!this.password.new_password || !this.password.confirm_password) {
                alert('Password fields are required.');
                return;
            }

            axios({
                url : BASE_URL + '/profile/password',
                method : 'POST',
                data : this.password,
                headers : {
                    Authorization : 'Bearer ' + this.user.token,
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                localStorage.removeItem('user');

                alert('Password has been Reset!\nYou will need to login your account again.');
                this.$router.push({name : 'Login'});
                this.showDialog = false;
            }).catch(err => {
                alert(err.response.data.message);
            });
        }
    }
};
</script>
