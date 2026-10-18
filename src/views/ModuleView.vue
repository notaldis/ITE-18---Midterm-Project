<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Plus, Download, Pencil, Trash2, X, ChevronLeft, ChevronRight, SlidersHorizontal, PackageOpen, AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import { modules, options } from '../data/schema'
import { useDataStore } from '../stores/data'
const route = useRoute(), store = useDataStore(), query = ref(''), statusFilter = ref('All'), modalOpen = ref(false), editingIndex = ref(-1), form = reactive({}), formError = ref(''), deleteError = ref(''), deleteTarget = ref(null), isSaving = ref(false), isDeleting = ref(false), page = ref(1), pageSize = 8
const moduleDef = computed(() => modules.find(m => m.key === route.params.module) || modules[0])
const rows = computed(() => store.records[moduleDef.value.key] || [])
const primaryKey = computed(() => moduleDef.value.fields[0][0])
const visibleFields = computed(() => moduleDef.value.fields.map(f => f[0]))
const filtered = computed(() => rows.value.filter(row => { const matches = visibleFields.value.some(field => String(row[field] ?? '').toLowerCase().includes(query.value.toLowerCase())); const status = String(row.StatusName || row.Status || ''); return matches && (statusFilter.value === 'All' || status === statusFilter.value) }))
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const paged = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))
watch(() => route.params.module, () => { query.value = ''; statusFilter.value = 'All'; page.value = 1; modalOpen.value = false })
watch([query, statusFilter], () => page.value = 1)
function openAdd() { editingIndex.value = -1; formError.value = ''; Object.keys(form).forEach(k => delete form[k]); moduleDef.value.fields.forEach(([name, type]) => { form[name] = type === 'number' ? '' : name === 'Status' ? 'Open' : '' }); modalOpen.value = true }
function openEdit(row) { editingIndex.value = rows.value.indexOf(row); formError.value = ''; Object.keys(form).forEach(k => delete form[k]); Object.assign(form, JSON.parse(JSON.stringify(row))); modalOpen.value = true }
async function save() {
    formError.value = ''
    for (const [name, type] of moduleDef.value.fields) {
        const generatedId = name === primaryKey.value && type === 'number' && moduleDef.value.key !== 'workorderparts'
        if (generatedId) continue
        if (type.startsWith('select:')) {
            if (!String(form[name] ?? '').trim()) { formError.value = `${name.replaceAll('_', ' ')} is required.`; return }
            continue
        }
        if (type !== 'number' && !String(form[name] ?? '').trim() && name !== 'ResolvedAt') { formError.value = `${name.replaceAll('_', ' ')} is required.`; return }
        if (type === 'email' && form[name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[name])) { formError.value = 'Enter a valid email address.'; return }
        if (type === 'number' && form[name] !== '' && Number(form[name]) < 0) { formError.value = `${name.replaceAll('_', ' ')} cannot be negative.`; return }
    }
    const row = { ...form }
    moduleDef.value.fields.forEach(([name, type]) => { if (type === 'number' && row[name] !== '') row[name] = Number(row[name]) })
    if (row.ResolvedAt === '') row.ResolvedAt = null
    if (editingIndex.value < 0 && moduleDef.value.key !== 'workorderparts') delete row[primaryKey.value]
    isSaving.value = true
    try {
        if (editingIndex.value < 0) await store.add(moduleDef.value.key, row)
        else await store.update(moduleDef.value.key, rows.value[editingIndex.value], row)
        modalOpen.value = false
    } catch (error) {
        console.error('Unable to save workspace record.', error)
        formError.value = error instanceof Error ? error.message : 'Unable to save this record.'
    } finally {
        isSaving.value = false
    }
}
function confirmDelete(row) { deleteError.value = ''; deleteTarget.value = row }
async function remove() {
    if (!deleteTarget.value || isDeleting.value) return
    isDeleting.value = true
    try {
        await store.remove(moduleDef.value.key, deleteTarget.value)
        deleteTarget.value = null
    } catch (error) {
        console.error('Unable to delete workspace record.', error)
        deleteError.value = error instanceof Error ? error.message : 'Unable to delete this record.'
    } finally {
        isDeleting.value = false
    }
}
function choices(type) { const ref = type.split(':')[1]; if (options[ref]) return options[ref].map(v => ({ value: v, label: v })); const arr = store.records[ref] || []; const idKey = modules.find(m => m.key === ref)?.fields[0][0]; return arr.map(r => { const label = r.BrandName || r.StatusName || r.LocationName || r.FirstName && `${r.FirstName} ${r.LastName}` || r.SupplierName || r.ItemName || r.SerialNumber || r.WorkOrder_ID || r.RoleType || r.PriorityLevel || r[idKey]; return { value: r[idKey], label: `${label} (#${r[idKey]})` } }) }
function display(field, value) { const map = { Brand_ID: 'brands', Status_ID: 'statuses', Location_ID: 'locations', Role_ID: 'roles', Supplier_ID: 'suppliers', Warehouse_ID: 'locations', Equipment_ID: 'equipment', Assigned_Employee_ID: 'employees', Priority_ID: 'priorities', Item_ID: 'inventory', Supervisor_ID: 'employees' }; const key = map[field]; if (!key || value == null || value === '') return value ?? '—'; const idKey = modules.find(m => m.key === key)?.fields[0][0]; const row = (store.records[key] || []).find(r => String(r[idKey]) === String(value)); if (!row) return value; return row.BrandName || row.StatusName || row.LocationName || row.FirstName && `${row.FirstName} ${row.LastName}` || row.SupplierName || row.ItemName || row.SerialNumber || row.WorkOrder_ID || row.RoleType || row.PriorityLevel || value }
function cellClass(field, value) { if (field === 'Status' || field === 'StatusName') return 'status-tag status-' + String(value).toLowerCase().replaceAll(' ', '-'); if (field === 'PriorityLevel') return 'priority-tag priority-' + String(value).toLowerCase(); if (field === 'QuantityInStock' && Number(value) <= Number(rows.value.find(r => r.QuantityInStock === value)?.ReorderLevel)) return 'cell-low'; return '' }
function exportCsv() { const fields = visibleFields.value; const escape = v => '"' + String(v ?? '').replaceAll('"', '""') + '"'; const csv = [fields.map(escape).join(','), ...filtered.value.map(r => fields.map(f => escape(r[f])).join(','))].join('\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); const a = document.createElement('a'); a.href = url; a.download = `mineops-${moduleDef.value.key}.csv`; a.click(); URL.revokeObjectURL(url) }
</script>
<template>
    <div class="page-heading module-heading">
        <div>
            <div class="eyebrow"><span class="eyebrow-line"></span> DATA MANAGEMENT</div>
            <h1>{{ moduleDef.label }}<span class="heading-period">.</span></h1>
            <p class="page-subtitle">{{ moduleDef.description }}</p>
        </div>
        <div class="heading-actions"><button class="btn-secondary" @click="exportCsv">
                <Download :size="16" /> Export CSV
            </button><button v-if="store.canManage" class="btn-primary" @click="openAdd">
                <Plus :size="17" /> Add {{ moduleDef.singular }}
            </button></div>
    </div>
    <div class="module-summary-row">
        <div class="module-summary"><span class="summary-icon">
                <PackageOpen :size="18" />
            </span>
            <div><span>Total records</span><strong>{{ rows.length }}</strong></div>
        </div>
        <div class="module-summary"><span class="summary-icon summary-green">
                <CheckCircle2 :size="18" />
            </span>
            <div><span>Matching records</span><strong>{{ filtered.length }}</strong></div>
        </div>
        <div class="module-summary"><span class="summary-icon summary-blue">
                <SlidersHorizontal :size="18" />
            </span>
            <div><span>Current view</span><strong>{{ moduleDef.label }}</strong></div>
        </div>
    </div>
    <section class="panel records-panel">
        <div class="records-toolbar">
            <div class="records-title">
                <h2>{{ moduleDef.label }} records</h2><span class="record-count">{{ filtered.length }}</span>
            </div>
            <div class="toolbar-controls"><label class="table-search">
                    <Search :size="16" /><input v-model="query" placeholder="Search records..."
                        aria-label="Search records" /><button v-if="query" class="clear-search" @click="query = ''"
                        aria-label="Clear search">
                        <X :size="14" />
                    </button>
                </label><select v-if="['statuses', 'workorders'].includes(moduleDef.key)" v-model="statusFilter"
                    class="filter-select" aria-label="Filter by status">
                    <option>All</option>
                    <option v-if="moduleDef.key === 'statuses'">Operational</option>
                    <option v-if="moduleDef.key === 'statuses'">Under Maintenance</option>
                    <option v-if="moduleDef.key === 'statuses'">Decommissioned</option>
                    <option v-if="moduleDef.key === 'workorders'">Open</option>
                    <option v-if="moduleDef.key === 'workorders'">In Progress</option>
                    <option v-if="moduleDef.key === 'workorders'">Resolved</option>
                    <option v-if="moduleDef.key === 'workorders'">On Hold</option>
                </select></div>
        </div>
        <div class="table-wrap">
            <table class="data-table records-table">
                <thead>
                    <tr>
                        <th v-for="field in visibleFields" :key="field">{{ field.replaceAll('_', ' ').replace(/([a-z])([A-Z])/g,'$1 $2').toUpperCase()}}</th>
                        <th v-if="store.canManage" class="actions-head">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in paged" :key="index">
                        <td v-for="field in visibleFields" :key="field"><span
                                v-if="field === 'Status' || field === 'StatusName' || field === 'PriorityLevel'"
                                class="status-tag"
                                :class="field === 'PriorityLevel' ? 'priority-tag priority-' + String(row[field]).toLowerCase() : 'status-' + String(row[field]).toLowerCase().replaceAll(' ', '-')"><i
                                    v-if="field !== 'PriorityLevel'"></i>{{ display(field, row[field]) }}</span><span
                                v-else-if="field === 'QuantityInStock'"
                                :class="Number(row[field]) <= Number(row.ReorderLevel) ? 'cell-low' : ''">{{ row[field] }}
                                <small v-if="Number(row[field]) <= Number(row.ReorderLevel)"
                                    class="low-stock-label">LOW</small></span><span
                                v-else-if="field === 'UnitCost'">₱{{ Number(row[field] || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span><span
                                v-else
                                :class="field === primaryKey ? 'primary-cell' : ''">{{ display(field, row[field]) || '—' }}</span>
                        </td>
                        <td v-if="store.canManage" class="row-actions"><button class="row-action edit-action" @click="openEdit(row)"
                                :aria-label="'Edit record ' + row[primaryKey]" title="Edit">
                                <Pencil :size="15" />
                            </button><button class="row-action delete-action" @click="confirmDelete(row)"
                                :aria-label="'Delete record ' + row[primaryKey]" title="Delete">
                                <Trash2 :size="15" />
                            </button></td>
                    </tr>
                </tbody>
            </table>
            <div v-if="!paged.length" class="empty-state">
                <div class="empty-icon">
                    <Search :size="22" />
                </div><strong>{{ query || statusFilter !== 'All' ? 'No records found' : 'No records yet' }}</strong><span>{{ query || statusFilter !== 'All' ? 'Try another search or clear the filters.' : 'Records will appear here once they are added to this workspace.' }}</span><button
                    class="btn-secondary" @click="query = ''; statusFilter = 'All'">Clear filters</button>
            </div>
        </div>
        <div class="records-footer"><span>Showing
                <strong>{{ filtered.length ? ((page - 1) * pageSize + 1) : 0 }}–{{ Math.min(page * pageSize, filtered.length) }}</strong>
                of <strong>{{ filtered.length }}</strong> records</span>
            <div class="pagination"><button class="page-btn" :disabled="page <= 1" @click="page--"
                    aria-label="Previous page">
                    <ChevronLeft :size="16" />
                </button><button v-for="p in pages" :key="p" class="page-btn" :class="{ current: page === p }"
                    @click="page = p">{{ p }}</button><button class="page-btn" :disabled="page >= pages" @click="page++"
                    aria-label="Next page">
                    <ChevronRight :size="16" />
                </button></div>
        </div>
    </section>
    <div v-if="modalOpen" class="modal-backdrop" @click.self="modalOpen = false">
        <section class="modal-card" role="dialog" aria-modal="true"
            :aria-label="(editingIndex < 0 ? 'Add ' : 'Edit ') + moduleDef.singular">
            <div class="modal-header">
                <div><span class="modal-eyebrow">{{ editingIndex < 0 ? 'NEW RECORD' : 'EDIT RECORD' }}</span>
                            <h2>{{ editingIndex < 0 ? 'Add' : 'Edit' }} {{ moduleDef.singular }}</h2>
                                    <p>Complete the fields below to {{ editingIndex < 0 ? 'create' : 'update' }} this
                                            record.</p>
                </div><button class="icon-btn" @click="modalOpen = false" aria-label="Close dialog">
                    <X :size="19" />
                </button>
            </div>
            <form @submit.prevent="save">
                <div class="form-grid">
                    <div v-for="([name, type]) in moduleDef.fields" :key="name" class="form-field"
                        :class="{ 'field-full': type === 'textarea' }"><label :for="'field-' + name">{{ name.replaceAll('_', '').replace(/([a-z])([A-Z])/g,'$1 $2')}} <span v-if="name !== primaryKey || editingIndex >= 0 || moduleDef.key === 'workorderparts'"
                                class="required-mark">*</span></label><select v-if="type.startsWith('select:')"
                            :id="'field-' + name" v-model="form[name]" :required="name !== primaryKey || moduleDef.key === 'workorderparts'"
                            :disabled="name === primaryKey && moduleDef.key !== 'workorderparts' || editingIndex >= 0 && (name === primaryKey || moduleDef.key === 'workorderparts' && ['WorkOrder_ID', 'Item_ID'].includes(name))">
                            <option value="">Select {{ name.replaceAll('_', ' ').toLowerCase() }}</option>
                            <option v-for="opt in choices(type)" :key="opt.value" :value="opt.value">{{ opt.label }}
                            </option>
                        </select><textarea v-else-if="type === 'textarea'" :id="'field-' + name" v-model="form[name]"
                            rows="3" required></textarea><input v-else :id="'field-' + name" v-model="form[name]"
                            :type="type === 'number' ? 'number' : type" :min="type === 'number' ? '0' : undefined"
                            :required="name !== primaryKey && name !== 'ResolvedAt'"
                            :disabled="name === primaryKey && moduleDef.key !== 'workorderparts' || editingIndex >= 0 && (name === primaryKey || moduleDef.key === 'workorderparts' && ['WorkOrder_ID', 'Item_ID'].includes(name))"
                            :placeholder="name === primaryKey && moduleDef.key !== 'workorderparts' ? 'Assigned automatically' : type === 'number' ? 'Enter number' : `Enter ${name.replaceAll('_', ' ').toLowerCase()}`" />
                    </div>
                </div>
                <div v-if="formError" class="form-error">
                    <AlertCircle :size="16" />{{ formError }}
                </div>
                <div class="modal-actions"><button type="button" class="btn-secondary" :disabled="isSaving"
                        @click="modalOpen = false">Cancel</button><button type="submit" class="btn-primary" :disabled="isSaving">
                        <CheckCircle2 :size="16" /> {{ isSaving ? 'Saving...' : editingIndex < 0 ? 'Create record' : 'Save changes' }}</button>
                </div>
            </form>
        </section>
    </div>
    <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
        <section class="confirm-card" role="alertdialog" aria-modal="true">
            <div class="confirm-icon">
                <Trash2 :size="21" />
            </div>
            <h2>Delete this record?</h2>
            <p>This action cannot be undone.</p>
            <div v-if="deleteError" class="form-error"><AlertCircle :size="16" />{{ deleteError }}</div>
            <div class="modal-actions"><button class="btn-secondary" :disabled="isDeleting" @click="deleteTarget = null">Cancel</button><button
                    class="btn-danger" :disabled="isDeleting" @click="remove">
                    <Trash2 :size="15" /> {{ isDeleting ? 'Deleting...' : 'Delete record' }}
                </button></div>
        </section>
    </div>
</template>
