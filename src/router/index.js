import { createRouter, createWebHistory } from "vue-router";
import UploadFileView from "@/views/UploadFileView";

const routes = [
  {
    path: "/",
    name: "",
    component: UploadFileView,
  },
  {
    path: "/UploadFile",
    name: "",
    component: UploadFileView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
