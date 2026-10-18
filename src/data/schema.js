export const modules = [
  {
    key: "equipment",
    label: "Equipment",
    singular: "Equipment",
    icon: "Truck",
    description:
      "Track heavy machinery, serial numbers, status, and site assignments.",
    fields: [
      ["Equipment_ID", "number"],
      ["Brand_ID", "select:brands"],
      ["SerialNumber", "text"],
      ["Category", "select:equipmentCategories"],
      ["Status_ID", "select:statuses"],
      ["PurchaseDate", "date"],
      ["Location_ID", "select:locations"],
    ],
  },
  {
    key: "statuses",
    label: "Equipment Status",
    singular: "Equipment Status",
    icon: "Activity",
    description: "Manage equipment availability and lifecycle status labels.",
    fields: [
      ["Status_ID", "number"],
      ["StatusName", "text"],
    ],
  },
  {
    key: "brands",
    label: "Equipment Brand",
    singular: "Equipment Brand",
    icon: "BadgeCheck",
    description: "Maintain equipment manufacturers and model names.",
    fields: [
      ["Brand_ID", "number"],
      ["BrandName", "text"],
      ["Model", "text"],
    ],
  },
  {
    key: "locations",
    label: "Site Location",
    singular: "Site Location",
    icon: "MapPin",
    description: "Organize mining sites, warehouses, and work areas.",
    fields: [
      ["Location_ID", "number"],
      ["LocationName", "text"],
      ["Type", "select:locationTypes"],
      ["Supervisor_ID", "select:employees"],
    ],
  },
  {
    key: "employees",
    label: "Employee",
    singular: "Employee",
    icon: "Users",
    description: "Manage employee records, roles, and contact details.",
    fields: [
      ["Employee_ID", "number"],
      ["FirstName", "text"],
      ["LastName", "text"],
      ["Role_ID", "select:roles"],
      ["ContactNumber", "tel"],
      ["Email", "email"],
    ],
  },
  {
    key: "roles",
    label: "Role",
    singular: "Role",
    icon: "ShieldCheck",
    description: "Define role types assigned to employees.",
    fields: [
      ["Role_ID", "number"],
      ["RoleType", "text"],
    ],
  },
  {
    key: "inventory",
    label: "Inventory Item",
    singular: "Inventory Item",
    icon: "Package",
    description:
      "Monitor spare parts, consumables, stock levels, and reorder points.",
    fields: [
      ["Item_ID", "number"],
      ["ItemName", "text"],
      ["Stock_Keeping_Unit", "text"],
      ["Category", "text"],
      ["QuantityInStock", "number"],
      ["ReorderLevel", "number"],
      ["UnitCost", "number"],
      ["Supplier_ID", "select:suppliers"],
      ["Warehouse_ID", "select:locations"],
    ],
  },
  {
    key: "suppliers",
    label: "Supplier",
    singular: "Supplier",
    icon: "Truck",
    description:
      "Keep supplier contact information and addresses in one place.",
    fields: [
      ["Supplier_ID", "number"],
      ["SupplierName", "text"],
      ["Phone", "tel"],
      ["Email", "email"],
      ["Address", "text"],
    ],
  },
  {
    key: "workorders",
    label: "Maintenance Work Order",
    singular: "Maintenance Work Order",
    icon: "ClipboardList",
    description:
      "Assign maintenance issues, priorities, and resolution status.",
    fields: [
      ["WorkOrder_ID", "number"],
      ["Equipment_ID", "select:equipment"],
      ["Assigned_Employee_ID", "select:employees"],
      ["IssueDescription", "textarea"],
      ["Priority_ID", "select:priorities"],
      ["Status", "select:workOrderStatuses"],
      ["CreatedAt", "date"],
      ["ResolvedAt", "date"],
    ],
  },
  {
    key: "priorities",
    label: "Priority",
    singular: "Priority",
    icon: "Flag",
    description: "Set priority levels for maintenance work orders.",
    fields: [
      ["Priority_ID", "number"],
      ["PriorityLevel", "text"],
    ],
  },
  {
    key: "workorderparts",
    label: "Work Order Parts",
    singular: "Work Order Parts",
    icon: "Wrench",
    description:
      "Record inventory parts and quantities used for maintenance jobs.",
    fields: [
      ["WorkOrder_ID", "select:workorders"],
      ["Item_ID", "select:inventory"],
      ["QuantityUsed", "number"],
    ],
  },
];

export const options = {
  equipmentCategories: [
    "Excavation",
    "Haulage",
    "Drilling",
    "Earthmoving",
    "Support",
  ],
  locationTypes: ["Mining Site", "Warehouse", "Work Area"],
  workOrderStatuses: ["Open", "In Progress", "Resolved", "On Hold"],
};
