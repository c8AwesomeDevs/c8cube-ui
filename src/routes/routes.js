import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import Login from "@/pages/Login.vue";
import Certificates from "@/pages/Certificates.vue";
import CertificateDetails from "@/pages/CertificateDetails.vue";
import CertificateDetailsValidated from "@/pages/CertificateDetailsValidated.vue";
import TagConfigurations from "@/pages/TagConfigurations.vue";
import ManualLogger from "@/pages/ManualLogger.vue";
import ManualLoggerDetails from "@/pages/ManualLoggerDetails.vue";
import Users from "@/pages/Users.vue";
import Profile from "@/pages/Profile.vue";

const routes = [
  {
    path : "/",
    component : Login,
    name : 'Login'
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "profile",
        name: "Profile",
        component: Profile,
      },
      {
        path: "home",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "certificates",
        name: "Certificates",
        component: Certificates,
      },
      {
        path: "tag-configurations",
        name: "TagConfigurations",
        component: TagConfigurations,
      },
      {
        path: "certificates/:id",
        name: "CertificateDetails",
        component: CertificateDetails,
      },
      {
        path: "certificates/:id/validated",
        name: "CertificateDetailsValidated",
        component: CertificateDetailsValidated,
      },
      {
        path: "manual-logger",
        name: "ManualLogger",
        component: ManualLogger,
      },
      {
        path: "manual-logger/:id",
        name: "ManualLoggerDetails",
        component: ManualLoggerDetails,
      },
      {
        path: "users",
        name: "Users",
        component: Users,
      },
      // {
      //   path: "table",
      //   name: "Table List",
      //   component: TableList,
      // },
      // {
      //   path: "typography",
      //   name: "Typography",
      //   component: Typography,
      // },
      // {
      //   path: "icons",
      //   name: "Icons",
      //   component: Icons,
      // },
      // {
      //   path: "maps",
      //   name: "Maps",
      //   meta: {
      //     hideFooter: true,
      //   },
      //   component: Maps,
      // },
      // {
      //   path: "notifications",
      //   name: "Notifications",
      //   component: Notifications,
      // },
      // {
      //   path: "upgrade",
      //   name: "Upgrade to PRO",
      //   component: UpgradeToPRO,
      // },
    ],
  },
];

export default routes;
