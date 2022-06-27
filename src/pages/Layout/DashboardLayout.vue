<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link :to="{name : 'Profile'}">
        <md-icon>person</md-icon>
        <p>Profile</p>
      </sidebar-link>
      <sidebar-link :to="{name : 'Dashboard'}">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link :to="{name : 'Certificates'}">
        <md-icon>library_books</md-icon>
        <p>Certificates</p>
      </sidebar-link>
      <sidebar-link :to="{name : 'ManualLogger'}">
        <md-icon>save_as</md-icon>
        <p>Manual Logger</p>
      </sidebar-link>
      <sidebar-link :to="{name : 'TagConfigurations'}" v-if="user.access_level == 'admin'">
        <md-icon>edit_calendar</md-icon>
        <p>Tag Configurations</p>
      </sidebar-link>
      <sidebar-link :to="{name : 'Users'}" v-if="user.access_level == 'admin'">
        <md-icon>manage_accounts</md-icon>
        <p>Users</p>
      </sidebar-link>
      <li class="md-list-item">
        <a class="md-list-item-router md-list-item-container md-button-clean" @click="logout()">
          <div class="md-list-item-content md-ripple">
            <i class="md-icon md-icon-font md-theme-default">power_settings_new</i>
            <p>Sign-Out</p>
          </div>
        </a>
      </li>
      <!-- <sidebar-link>
        <md-icon>edit_calendar</md-icon>
        <p>Log-Out</p>
      </sidebar-link> -->
      <!-- <sidebar-link to="/dashboard/user">
        <md-icon>person</md-icon>
        <p>User Profile</p>
      </sidebar-link>
      <sidebar-link to="/dashboard/table">
        <md-icon>content_paste</md-icon>
        <p>Table list</p>
      </sidebar-link>
      <sidebar-link to="/dashboard/typography">
        <md-icon>library_books</md-icon>
        <p>Typography</p>
      </sidebar-link>
      <sidebar-link to="/dashboard/icons">
        <md-icon>bubble_chart</md-icon>
        <p>Icons</p>
      </sidebar-link>
      <sidebar-link to="/dashboard/maps">
        <md-icon>location_on</md-icon>
        <p>Maps</p>
      </sidebar-link> -->
    </side-bar>

    <div class="main-panel">
      <!-- <top-navbar></top-navbar> -->
      <dashboard-content> </dashboard-content>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
// import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";

export default {
  components: {
    // TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu,
  },
  mounted() {
    if(!localStorage.getItem('user')) {
      this.$router.push({name : 'Login'});
    }
    this.user = JSON.parse(localStorage.getItem('user'));
  },
  methods : {
    logout() {
      localStorage.removeItem('user');
      this.$router.push({name : 'Login'});
    }
  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background : #EEEEEE !important;');
  },
  data() {
    return {
      user : '',
      sidebarBackground: "red",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg"),
    };
  },
};
</script>
