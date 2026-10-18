<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Truck, Activity, BadgeCheck, MapPin, Users, ShieldCheck, Package, ClipboardList, Flag, Wrench, Menu, Search, Pickaxe, X, AlertCircle, LogOut } from 'lucide-vue-next'
import { modules } from './data/schema'
import { useDataStore } from './stores/data'
import { getLocalUser, leaveWorkspace } from './auth'
const route = useRoute(), router = useRouter(), store = useDataStore(), mobileOpen = ref(false), globalSearch = ref('')
const icons = { LayoutDashboard, Truck, Activity, BadgeCheck, MapPin, Users, ShieldCheck, Package, ClipboardList, Flag, Wrench }
const activeModule = computed(() => modules.find(m => m.key === route.params.module))
const title = computed(() => route.path === '/dashboard' ? 'Overview' : activeModule.value?.label || 'Overview')
const userEmail = ref(getLocalUser())
const userInitials = computed(() => userEmail.value.split('@')[0].slice(0, 2).toUpperCase() || 'MW')
watch(() => store.toast, v => { if (v) setTimeout(() => store.clearToast(), 2600) })
watch(() => route.path, path => {
  if (path !== '/login') userEmail.value = getLocalUser()
})
function navigate(path) { router.push(path); mobileOpen.value = false }
function logout() {
  leaveWorkspace()
  userEmail.value = ''
  router.replace('/login')
}
</script>
<template>
  <RouterView v-if="route.path === '/login'" />
  <div v-else class="app-shell">
    <aside class="sidebar" :class="{ 'sidebar-open': mobileOpen }">
      <div class="brand">
        <div class="brand-mark">
          <Pickaxe :size="22" />
        </div>
        <div>
          <div class="brand-name">MINE<span>OPS</span></div>
          <div class="brand-caption">ASSET MANAGEMENT</div>
        </div><button class="icon-btn close-mobile" @click="mobileOpen = false">
          <X :size="18" />
        </button>
      </div>
      <div class="site-switch">
        <div class="site-avatar">MW</div>
        <div class="site-copy"><strong>My workspace</strong><span>Saved on this device</span></div>
      </div>
      <div class="nav-label">WORKSPACE</div>
      <nav class="nav-list"><button class="nav-item" :class="{ active: route.path === '/dashboard' }"
          @click="navigate('/dashboard')">
          <LayoutDashboard :size="18" /><span>Overview</span>
        </button>
        <div class="nav-label nav-label-spaced">ASSET MANAGEMENT</div>
        <button v-for="m in modules" :key="m.key" class="nav-item" :class="{ active: route.params.module === m.key }"
          @click="navigate('/' + m.key)">
          <component :is="icons[m.icon]" :size="18" /><span>{{ m.label }}</span><span
            v-if="m.key === 'inventory' && store.lowStock.length" class="nav-count">{{ store.lowStock.length }}</span>
        </button>
      </nav>
      <div class="sidebar-bottom">
        <div class="help-card">
          <div class="help-icon">
            <Activity :size="17" />
          </div><strong>Operations status</strong>
          <p>Keep equipment, stock, and maintenance records organized.</p><span class="online-dot">● &nbsp;Workspace ready</span>
        </div>
        <div class="profile">
          <div class="profile-avatar">{{ userInitials }}</div>
          <div class="profile-copy"><strong>{{ userEmail || 'MineOps' }}</strong><span>Local workspace</span></div>
        </div>
      </div>
    </aside>
    <div v-if="mobileOpen" class="scrim" @click="mobileOpen = false"></div>
    <main class="main-area">
      <header class="topbar">
        <div class="topbar-left"><button class="icon-btn menu-btn" @click="mobileOpen = true">
            <Menu :size="21" />
          </button>
          <div class="breadcrumbs"><span>MineOps</span><span class="crumb-slash">/</span><strong>{{ title }}</strong>
          </div>
        </div>
        <div class="topbar-actions">
          <div class="global-search">
            <Search :size="17" /><input v-model="globalSearch" placeholder="Search modules..."
              @keydown.enter="globalSearch.trim() && navigate('/' + (modules.find(m => m.label.toLowerCase().includes(globalSearch.toLowerCase()) || m.key.includes(globalSearch.toLowerCase()))?.key || 'dashboard'))" /><kbd>↵</kbd>
          </div>
          <div class="topbar-divider"></div>
          <div class="user-chip">
            <div class="profile-avatar small">{{ userInitials }}</div>
            <div class="user-chip-copy"><strong>{{ userEmail || 'My workspace' }}</strong><span>Local workspace</span></div>
          </div>
          <button class="icon-btn logout-btn" title="Leave workspace" aria-label="Leave workspace" @click="logout">
            <LogOut :size="17" />
          </button>
        </div>
      </header>
      <div class="page-content">
        <div v-if="store.storageError" class="data-note" role="alert">
          <AlertCircle :size="16" /><span><strong>Saved records could not be loaded:</strong> {{ store.storageError }}</span>
        </div>
        <RouterView />
      </div>
      <footer class="footer"><span>© 2026 MineOps · Mining Equipment &amp; Inventory Tracker</span><span>Saved on this device</span></footer>
    </main>
    <Transition name="toast">
      <div v-if="store.toast" class="toast-message"><span class="toast-check">✓</span>{{ store.toast }}</div>
    </Transition>
  </div>
</template>
