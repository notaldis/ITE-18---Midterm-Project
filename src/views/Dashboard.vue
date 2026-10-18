<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '../stores/data'
import { modules } from '../data/schema'
import { ArrowUpRight, ArrowRight, CircleAlert, Clock3, CheckCircle2, Wrench, Package, Truck, Plus, CalendarDays, Activity, MapPin, ClipboardList, Users } from 'lucide-vue-next'
const store = useDataStore(), router = useRouter()
const money = n => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n)
const stockValue = computed(() => store.records.inventory.reduce((sum, x) => sum + Number(x.QuantityInStock) * Number(x.UnitCost), 0))
const recentOrders = computed(() => [...store.records.workorders].sort((a, b) => b.WorkOrder_ID - a.WorkOrder_ID).slice(0, 4))
const currentDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date())
const hasRecords = computed(() => modules.some(({ key }) => store.records[key].length > 0))
function equipmentName(id) { const e = store.records.equipment.find(x => x.Equipment_ID === Number(id)); return e ? e.SerialNumber : 'Equipment #' + id }
function employeeName(id) { const e = store.records.employees.find(x => x.Employee_ID === Number(id)); return e ? e.FirstName + ' ' + e.LastName : 'Unassigned' }
function priority(id) { return store.records.priorities.find(x => x.Priority_ID === Number(id))?.PriorityLevel || 'Normal' }
</script>
<template>
    <div class="page-heading">
        <div>
            <div class="eyebrow"><span class="eyebrow-line"></span> OPERATIONS CENTER</div>
            <h1>Operations overview<span class="heading-period">.</span></h1>
            <p class="page-subtitle">Equipment, inventory, and maintenance at a glance.</p>
        </div>
        <div class="heading-actions">
            <div class="date-pill">
                <CalendarDays :size="16" /><span>{{ currentDate }}</span>
            </div><button class="btn-primary" @click="router.push('/workorders')">
                <Plus :size="17" /> New work order
            </button>
        </div>
    </div>
    <div class="alert-banner" v-if="store.lowStock.length">
        <div class="alert-icon">
            <CircleAlert :size="19" />
        </div>
        <div class="alert-copy"><strong>Inventory needs attention</strong><span>{{ store.lowStock.length }} items are at
                or below their reorder level. Review stock before the next shift.</span></div><button
            @click="router.push('/inventory')">Review inventory
            <ArrowRight :size="15" />
        </button>
    </div>
    <section v-if="!hasRecords" class="panel workspace-start">
        <div class="workspace-start-icon"><MapPin :size="20" /></div>
        <div class="workspace-start-copy">
            <h2>Set up your workspace</h2>
            <p>Add your organization’s reference records first. Your equipment, suppliers, stock, and maintenance data will appear here as you add them.</p>
            <div class="setup-links">
                <button class="text-action" @click="router.push('/statuses')">Equipment statuses <ArrowRight :size="14" /></button>
                <button class="text-action" @click="router.push('/roles')">Employee roles <ArrowRight :size="14" /></button>
                <button class="text-action" @click="router.push('/priorities')">Work order priorities <ArrowRight :size="14" /></button>
                <button class="text-action" @click="router.push('/brands')">Equipment brands <ArrowRight :size="14" /></button>
            </div>
        </div>
    </section>
    <div class="stats-grid">
        <article class="stat-card">
            <div class="stat-top"><span>Total equipment</span><span class="stat-icon green">
                    <Truck :size="19" />
                </span></div>
            <div class="stat-value">{{ store.totalEquipment.toLocaleString() }}<span class="stat-unit">units</span></div>
            <div class="stat-bottom"><span class="stat-positive">
                    <Activity :size="14" /> {{ store.operationalEquipment }} operational
                </span><span class="stat-note">Fleet overview</span></div>
            <div class="stat-bar"><i
                    :style="{ width: (store.operationalEquipment / Math.max(store.totalEquipment, 1) * 100) + '%' }"></i></div>
        </article>
        <article class="stat-card">
            <div class="stat-top"><span>Open work orders</span><span class="stat-icon amber">
                    <Wrench :size="19" />
                </span></div>
            <div class="stat-value">{{ store.openOrders.length.toString().padStart(2, '0') }}<span
                    class="stat-unit">orders</span></div>
            <div class="stat-bottom"><span class="stat-warning">
                    <Clock3 :size="14" /> {{ store.openOrders.length ? 'Requires follow-up' : 'No open work orders' }}
                </span><span class="stat-note">Maintenance</span></div>
            <div class="stat-bar amber-bar"><i
                    :style="{ width: Math.min(store.openOrders.length / Math.max(store.records.workorders.length, 1) * 100, 100) + '%' }"></i>
            </div>
        </article>
        <article class="stat-card">
            <div class="stat-top"><span>Low-stock items</span><span class="stat-icon red">
                    <Package :size="19" />
                </span></div>
            <div class="stat-value">{{ store.lowStock.length.toString().padStart(2, '0') }}<span
                    class="stat-unit">items</span></div>
            <div class="stat-bottom"><span :class="store.lowStock.length ? 'stat-danger' : 'stat-positive'">
                    <CircleAlert :size="14" /> {{ store.lowStock.length ? 'Restock recommended' : store.records.inventory.length ? 'Stock levels healthy' : 'No inventory recorded' }}
                </span><span class="stat-note">Inventory</span></div>
            <div class="stat-bar red-bar"><i
                    :style="{ width: Math.min(store.lowStock.length / Math.max(store.records.inventory.length, 1) * 100, 100) + '%' }"></i>
            </div>
        </article>
        <article class="stat-card">
            <div class="stat-top"><span>Inventory value</span><span class="stat-icon blue">
                    <Activity :size="19" />
                </span></div>
            <div class="stat-value money-value">{{ money(stockValue) }}</div>
            <div class="stat-bottom"><span class="stat-neutral">
                    <CheckCircle2 :size="14" /> Current stock value
                </span><span class="stat-note">PHP</span></div>
        </article>
    </div>
    <div class="dashboard-grid">
        <section class="panel orders-panel">
            <div class="panel-header">
                <div>
                    <h2>Maintenance work orders</h2>
                    <p>Track active repairs and scheduled service.</p>
                </div><button class="text-action" @click="router.push('/workorders')">View all
                    <ArrowUpRight :size="15" />
                </button>
            </div>
            <div class="table-wrap">
                <table class="data-table dashboard-table">
                    <thead>
                        <tr>
                            <th>WORK ORDER</th>
                            <th>EQUIPMENT</th>
                            <th>ASSIGNED TO</th>
                            <th>PRIORITY</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="w in recentOrders" :key="w.WorkOrder_ID">
                            <td><strong class="order-id">#WO-{{ w.WorkOrder_ID }}</strong><span
                                    class="cell-sub">{{ w.CreatedAt }}</span></td>
                            <td><strong>{{ equipmentName(w.Equipment_ID) }}</strong><span
                                    class="cell-sub">{{ w.IssueDescription }}</span></td>
                            <td>{{ employeeName(w.Assigned_Employee_ID) }}</td>
                            <td><span class="priority-tag"
                                    :class="'priority-' + priority(w.Priority_ID).toLowerCase()">{{ priority(w.Priority_ID) }}</span>
                            </td>
                            <td><span class="status-tag"
                                    :class="'status-' + w.Status.toLowerCase().replace(' ', '-')"><i></i>{{ w.Status }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="!recentOrders.length" class="empty-state">No work orders yet.</div>
            <div class="panel-footer"><span>Showing {{ recentOrders.length }} recent records</span><button
                    class="text-action" @click="router.push('/workorders')">Open maintenance
                    <ArrowRight :size="14" />
                </button></div>
        </section>
        <section class="panel stock-panel">
            <div class="panel-header">
                <div>
                    <h2>Stock watch</h2>
                    <p>Items approaching reorder level.</p>
                </div><button class="icon-action" @click="router.push('/inventory')">
                    <ArrowUpRight :size="17" />
                </button>
            </div>
            <div class="stock-list">
                <div v-for="item in store.records.inventory.slice().sort((a, b) => a.QuantityInStock - a.ReorderLevel - (b.QuantityInStock - b.ReorderLevel)).slice(0, 4)"
                    :key="item.Item_ID" class="stock-row">
                    <div class="stock-item-icon">
                        <Package :size="18" />
                    </div>
                    <div class="stock-item-info">
                        <strong>{{ item.ItemName }}</strong><span>{{ item.Stock_Keeping_Unit }}</span>
                        <div class="stock-progress"><i
                                :class="Number(item.QuantityInStock) <= Number(item.ReorderLevel) ? 'progress-low' : ''"
                                :style="{ width: Math.min(item.QuantityInStock / Math.max(item.ReorderLevel * 2, 1) * 100, 100) + '%' }"></i>
                        </div>
                    </div>
                    <div class="stock-quantity"><strong
                            :class="Number(item.QuantityInStock) <= Number(item.ReorderLevel) ? 'quantity-low' : ''">{{ item.QuantityInStock }}</strong><span>in
                            stock</span></div>
                </div>
            </div><button class="stock-cta" @click="router.push('/inventory')">Manage inventory
                <ArrowRight :size="15" />
            </button>
        </section>
    </div>
    <section class="module-section">
        <div class="section-heading">
            <div>
                <h2>Explore your workspace</h2>
                <p>Quick access to the tools that keep operations moving.</p>
            </div><span class="section-count">{{ modules.length }} MODULES</span>
        </div>
        <div class="module-grid"><button v-for="(m, i) in modules" :key="m.key" class="module-card"
                @click="router.push('/' + m.key)">
                <div class="module-icon" :class="'module-color-' + (i % 5)">
                    <component
                        :is="{ Truck, Activity, Package, ClipboardList, Users, MapPin, Wrench }[m.key === 'equipment' ? 'Truck' : m.key === 'statuses' ? 'Activity' : m.key === 'inventory' ? 'Package' : m.key === 'workorders' ? 'ClipboardList' : m.key === 'employees' ? 'Users' : m.key === 'locations' ? 'MapPin' : 'Wrench']"
                        :size="19" />
                </div>
                <div class="module-card-text"><strong>{{ m.label }}</strong><span>{{ m.description }}</span></div>
                <ArrowUpRight class="module-arrow" :size="16" />
            </button></div>
    </section>
</template>
