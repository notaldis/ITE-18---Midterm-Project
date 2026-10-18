import { defineStore } from "pinia";
import { modules } from "../data/schema";

const STORAGE_KEY = "mineops-workspace-records";

const emptyRecords = () =>
  Object.fromEntries(modules.map(({ key }) => [key, []]));

function readRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { records: emptyRecords(), error: "" };

    const parsed = JSON.parse(saved);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      modules.some(({ key }) => !Array.isArray(parsed[key]))
    ) {
      throw new Error("Saved workspace data has an invalid format.");
    }

    return {
      records: Object.fromEntries(
        modules.map(({ key }) => [key, parsed[key]]),
      ),
      error: "",
    };
  } catch (error) {
    return {
      records: emptyRecords(),
      error:
        error instanceof Error
          ? error.message
          : "Unable to read saved workspace data.",
    };
  }
}

function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Unable to save records on this device: ${error.message}`
        : "Unable to save records on this device.",
    );
  }
}

function primaryFields(key) {
  return key === "workorderparts"
    ? ["WorkOrder_ID", "Item_ID"]
    : [modules.find((module) => module.key === key).fields[0][0]];
}

const foreignKeyTargets = {
  Brand_ID: "brands",
  Status_ID: "statuses",
  Location_ID: "locations",
  Supervisor_ID: "employees",
  Role_ID: "roles",
  Supplier_ID: "suppliers",
  Warehouse_ID: "locations",
  Equipment_ID: "equipment",
  Assigned_Employee_ID: "employees",
  Priority_ID: "priorities",
  Item_ID: "inventory",
  WorkOrder_ID: "workorders",
};

function nextId(key, records) {
  const primaryField = primaryFields(key)[0];
  return (
    records[key].reduce(
      (highest, row) => Math.max(highest, Number(row[primaryField]) || 0),
      0,
    ) + 1
  );
}

export const useDataStore = defineStore("data", {
  state: () => {
    const saved = readRecords();
    return {
      records: saved.records,
      storageError: saved.error,
      toast: "",
    };
  },
  getters: {
    canManage: () => true,
    totalEquipment: (state) => state.records.equipment.length,
    operationalEquipment: (state) =>
      state.records.equipment.filter(
        (equipment) =>
          state.records.statuses.find(
            (status) =>
              status.Status_ID === Number(equipment.Status_ID),
          )?.StatusName === "Operational",
      ).length,
    lowStock: (state) =>
      state.records.inventory.filter(
        (item) =>
          Number(item.QuantityInStock) <= Number(item.ReorderLevel),
      ),
    openOrders: (state) =>
      state.records.workorders.filter(
        (workOrder) => workOrder.Status !== "Resolved",
      ),
  },
  actions: {
    add(key, row) {
      const record = { ...row };
      if (key !== "workorderparts") {
        record[primaryFields(key)[0]] = nextId(key, this.records);
      }
      const records = {
        ...this.records,
        [key]: [record, ...this.records[key]],
      };
      saveRecords(records);
      this.records = records;
      this.storageError = "";
      this.toast = "Record created successfully";
    },
    update(key, previousRow, row) {
      const records = {
        ...this.records,
        [key]: this.records[key].map((record) =>
          record === previousRow ? { ...row } : record,
        ),
      };
      saveRecords(records);
      this.records = records;
      this.storageError = "";
      this.toast = "Record updated successfully";
    },
    remove(key, row) {
      const [primaryField] = primaryFields(key);
      const referencedBy = modules.find(({ key: otherKey }) =>
        otherKey !== key &&
        this.records[otherKey].some((candidate) =>
          Object.entries(foreignKeyTargets).some(
            ([field, target]) =>
              target === key &&
              Number(candidate[field]) === Number(row[primaryField]),
          ),
        ),
      );
      if (referencedBy) {
        throw new Error(
          `This record is still referenced by ${referencedBy.label.toLowerCase()} records. Update or remove those records first.`,
        );
      }

      const records = {
        ...this.records,
        [key]: this.records[key].filter((record) => record !== row),
      };
      saveRecords(records);
      this.records = records;
      this.storageError = "";
      this.toast = "Record deleted";
    },
    clearToast() {
      this.toast = "";
    },
  },
});
