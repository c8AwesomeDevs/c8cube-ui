<template>
    <div class="content">
        <div class="md-layout">

            <div
                class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
            >
                <div class="text-right">
                    <md-button class="md-danger" @click="showDialog = true">Upload CSV</md-button>
                </div>
                <md-card>
                    <md-card-header data-background-color="red">
                        <h4 class="title">Tag Configuration</h4>
                    </md-card-header>
                    <md-card-content>
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item"></div>
                            <div class="md-layout-item"></div>
                            <div class="md-layout-item">
                                <md-field>
                                    <label for="type">Certificate Type</label>
                                    <md-select v-model="certificateType" name="type" id="type" @md-selected="getTagConfigurations(certificateType)">
                                        <md-option value="coal">COAL</md-option>
                                        <md-option value="dga">DGA</md-option>
                                    </md-select>
                                </md-field>
                            </div>
                        </div>
                        <md-table v-model="tags">
                            <md-table-row>
                                <md-table-head>Parameter</md-table-head>
                                <md-table-head>Tag Name</md-table-head>
                                <md-table-head>Data Type</md-table-head>
                            </md-table-row>
                            <md-table-row slot="md-table-row" slot-scope="{ item }">
                                <md-table-cell md-label="Parameter">
                                    {{ item.parameter }}
                                </md-table-cell>
                                <md-table-cell md-label="Tag Name">
                                    {{ item.tagname }}
                                </md-table-cell>
                                <md-table-cell md-label="Data Type">
                                    {{ item.datatype }}
                                </md-table-cell>
                            </md-table-row>
                        </md-table>
                    </md-card-content>
                </md-card>
            </div>
        </div>
        <md-dialog :md-active.sync="showDialog">
            <md-progress-bar md-mode="indeterminate" class="md-accent" v-if="loading"></md-progress-bar>
            <md-dialog-title>Upload CSV for {{ certificateType.toUpperCase() }} Tag Configuration</md-dialog-title>
                <md-dialog-content class="md-dialog-lg">
                    <md-field>
                        <label>Upload files</label>
                        <md-file @change="handleFileUpload( $event )" placeholder="Upload Certificate" accept=".csv"/>
                    </md-field>
                    <img src="@/assets/img/tagconfig.jpg" alt="" width="400">
                </md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-success" :disabled="loading" @click="uploadFile()">Upload</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>
<script>
import axios from 'axios'
import {BASE_URL} from '../components/Config/BASE_URL';
export default {
    name : 'TagConfigurations',
    metaInfo : {
        title : 'C8 Cube | Tag Configurations'
    },
    data() {
        return {
            certificateType : 'coal',
            tags : [],
            type : 'coal',
            showDialog : false,
            file : null,
            loading : false,
            user : {}
        }
    },
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        axios.get(BASE_URL + '/tag-configurations/' + this.certificateType, {headers : {'Authorization' : 'Bearer ' + this.user.token}})
        .then(response => {
            this.tags = response.data;
        })
    },
    methods: {
        uploadFile() {
            this.loading = true;

            let formData = new FormData();
            formData.append('file', this.file);

            axios({
                url : BASE_URL + '/tag-configurations/' + this.certificateType,
                method : 'POST',
                data : formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization' : 'Bearer ' + this.user.token
                }
            }).then( response => {
                this.tags = response.data;
                this.loading = false;
                this.showDialog = false;
            }).catch( error => {
                console.log(error);
                this.loading = false;
            });
        },
        getTagConfigurations(type) {
            axios.get(BASE_URL + '/tag-configurations/' + this.certificateType, {headers : {'Authorization' : 'Bearer ' + this.user.token}})
            .then(response => {
                this.tags = response.data;
            })
        },
        handleFileUpload(e){
            // this.file = this.$refs.file.files[0];
            let file = e.target.files[0];
            this.file = file;
        }
    }
}
</script>
