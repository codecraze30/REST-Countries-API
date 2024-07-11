import HomePage from "./components/HomePage.vue";
import CountryDetail from "./components/CountryDetail.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    props: true,
    meta: {
      title: "REST API Countries App - Homepage",
    },
  },
  {
    path: "/:country",
    name: "country-detail",
    component: CountryDetail,
    props: true,
    meta: {
      title: "REST API Countries App",
    },
  },
];

export default routes;
