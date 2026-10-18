import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import ModuleView from "../views/ModuleView.vue";
import Login from "../views/Login.vue";
import { hasLocalAccess } from "../auth";

const routes = [
 { path: "/", redirect: "/login" },
 { path: "/login", name: "login", component: Login },
 { path: "/dashboard", component: Dashboard, meta: { title: "Overview", requiresAccess: true } },
 { path: "/:module", component: ModuleView, meta: { title: "Workspace", requiresAccess: true } },
];

const router = createRouter({
 history: createWebHistory(),
 routes,
 scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to) => {
 const hasAccess = hasLocalAccess();
 if (to.name === "login" && hasAccess) return "/dashboard";
 if (to.meta.requiresAccess && !hasAccess) {
   return { name: "login", query: { redirect: to.fullPath } };
 }
 return true;
});

export default router;
