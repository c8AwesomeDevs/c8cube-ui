<template>
  <div class="content" md-theme="default-default">
      <div class="md-layout">
          <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"></div>
          <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33">
                <md-card class="mt-30">
                    <md-card-header data-background-color="red">
                        <md-card-header-text>
                            <span class="md-title">C8 Cube</span>
                        </md-card-header-text>
                    </md-card-header>
                    <md-card-content>
                        <md-field>
                            <label>Email</label>
                            <md-input v-model="email" type="email"></md-input>
                        </md-field>
                        <md-field>
                            <label>Password</label>
                            <md-input v-model="password" type="password"></md-input>
                        </md-field>
                    </md-card-content>
                    <md-card-actions layout="row" layout-align="end center">
                        <md-button data-background-color="red" @click="login">Log-In</md-button>
                    </md-card-actions>
                </md-card>
          </div>
          <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"></div>
      </div>
  </div>
</template>
<style scoped>
.mt-30 {
    margin-top : 10%;
}
</style>
<script>
import axios from 'axios';
import {BASE_URL} from '../components/Config/BASE_URL';

export default {
    name : 'Dashboard',
    metaInfo : {
        title : 'C8 Cube | Login'
    },
    data() {
        return {
            email : '',
            password : ''
        }
    },
    mounted() {
        if(localStorage.getItem('user')) {
            this.$router.push({name : 'Dashboard'});
        }
    },
    beforeCreate() {
        if(this.$route.name == 'Login') {
            document.querySelector('body').setAttribute('style', 'background : url(' + require("@/assets/img/bg.png") +') center; background-size : cover');
        }
    },
    methods :  {
        login() {
            axios({
                url : BASE_URL + '/login',
                method : 'POST',
                data : {email : this.email, password : this.password},
                headers : {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                localStorage.setItem('user', JSON.stringify(response.data));

                this.$router.push({name : 'Dashboard'});
            }).catch(ex => {

            });
            // this.$router.push({name : 'Dashboard'});
        }
    }
};
</script>
