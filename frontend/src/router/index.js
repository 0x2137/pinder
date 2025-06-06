import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import PreferencesView from '../views/PreferencesView.vue'
import DiscoveryView from '../views/DiscoveryView.vue'
import MatchesView from '../views/MatchesView.vue'
import ViewProfileView from '../views/ViewProfileView.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  {
    path: '/',
    redirect: '/discovery',
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/preferences',
    component: PreferencesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/discovery',
    component: DiscoveryView,
    meta: { requiresAuth: true },
  },
  {
    path: '/matches',
    component: MatchesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:id',
    component: ViewProfileView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
