import { onRequestPost as __api_admin_ceeprinto_js_onRequestPost } from "/home/wania/no-signal-store/functions/api/admin/ceeprinto.js"
import { onRequestDelete as __api_admin_ceeprinto_mappings_js_onRequestDelete } from "/home/wania/no-signal-store/functions/api/admin/ceeprinto-mappings.js"
import { onRequestGet as __api_admin_ceeprinto_mappings_js_onRequestGet } from "/home/wania/no-signal-store/functions/api/admin/ceeprinto-mappings.js"
import { onRequestPost as __api_admin_ceeprinto_mappings_js_onRequestPost } from "/home/wania/no-signal-store/functions/api/admin/ceeprinto-mappings.js"
import { onRequestPost as __api_admin_login_js_onRequestPost } from "/home/wania/no-signal-store/functions/api/admin/login.js"
import { onRequestPost as __api_admin_logout_js_onRequestPost } from "/home/wania/no-signal-store/functions/api/admin/logout.js"
import { onRequestGet as __api_admin_orders_js_onRequestGet } from "/home/wania/no-signal-store/functions/api/admin/orders.js"
import { onRequestDelete as __api_admin_products_js_onRequestDelete } from "/home/wania/no-signal-store/functions/api/admin/products.js"
import { onRequestGet as __api_admin_products_js_onRequestGet } from "/home/wania/no-signal-store/functions/api/admin/products.js"
import { onRequestPost as __api_admin_products_js_onRequestPost } from "/home/wania/no-signal-store/functions/api/admin/products.js"
import { onRequestGet as __api_admin_session_js_onRequestGet } from "/home/wania/no-signal-store/functions/api/admin/session.js"
import { onRequestGet as __api_admin_settings_js_onRequestGet } from "/home/wania/no-signal-store/functions/api/admin/settings.js"
import { onRequestPut as __api_admin_settings_js_onRequestPut } from "/home/wania/no-signal-store/functions/api/admin/settings.js"
import { onRequestPost as __api_ceeprinto_js_onRequestPost } from "/home/wania/no-signal-store/functions/api/ceeprinto.js"
import { onRequestGet as __api_health_js_onRequestGet } from "/home/wania/no-signal-store/functions/api/health.js"
import { onRequestPost as __api_orders_js_onRequestPost } from "/home/wania/no-signal-store/functions/api/orders.js"
import { onRequestGet as __api_products_js_onRequestGet } from "/home/wania/no-signal-store/functions/api/products.js"
import { onRequestGet as __api_settings_js_onRequestGet } from "/home/wania/no-signal-store/functions/api/settings.js"

export const routes = [
    {
      routePath: "/api/admin/ceeprinto",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_ceeprinto_js_onRequestPost],
    },
  {
      routePath: "/api/admin/ceeprinto-mappings",
      mountPath: "/api/admin",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_ceeprinto_mappings_js_onRequestDelete],
    },
  {
      routePath: "/api/admin/ceeprinto-mappings",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_ceeprinto_mappings_js_onRequestGet],
    },
  {
      routePath: "/api/admin/ceeprinto-mappings",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_ceeprinto_mappings_js_onRequestPost],
    },
  {
      routePath: "/api/admin/login",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_login_js_onRequestPost],
    },
  {
      routePath: "/api/admin/logout",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_logout_js_onRequestPost],
    },
  {
      routePath: "/api/admin/orders",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_orders_js_onRequestGet],
    },
  {
      routePath: "/api/admin/products",
      mountPath: "/api/admin",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_products_js_onRequestDelete],
    },
  {
      routePath: "/api/admin/products",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_products_js_onRequestGet],
    },
  {
      routePath: "/api/admin/products",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_products_js_onRequestPost],
    },
  {
      routePath: "/api/admin/session",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_session_js_onRequestGet],
    },
  {
      routePath: "/api/admin/settings",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_settings_js_onRequestGet],
    },
  {
      routePath: "/api/admin/settings",
      mountPath: "/api/admin",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_settings_js_onRequestPut],
    },
  {
      routePath: "/api/ceeprinto",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_ceeprinto_js_onRequestPost],
    },
  {
      routePath: "/api/health",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_health_js_onRequestGet],
    },
  {
      routePath: "/api/orders",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_orders_js_onRequestPost],
    },
  {
      routePath: "/api/products",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_products_js_onRequestGet],
    },
  {
      routePath: "/api/settings",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_settings_js_onRequestGet],
    },
  ]