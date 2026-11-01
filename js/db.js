/*
 * ============================================================================
 *  db.js  —  Tiny IndexedDB wrapper for prescription records
 * ============================================================================
 *  Fully offline. All data is stored in the browser on THIS laptop only.
 * ============================================================================
 */

const DB = (() => {
  const DB_NAME = "prescriptionDB";
  const STORE = "records";
  const VERSION = 1;

  let _db = null;

  function open() {
    return new Promise((resolve, reject) => {
      if (_db) return resolve(_db);
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("status", "status", { unique: false });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };
      req.onsuccess = (e) => {
        _db = e.target.result;
        resolve(_db);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  function tx(mode) {
    return open().then((db) => db.transaction(STORE, mode).objectStore(STORE));
  }

  function put(record) {
    return tx("readwrite").then(
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.put(record);
          req.onsuccess = () => resolve(record);
          req.onerror = (e) => reject(e.target.error);
        })
    );
  }

  function get(id) {
    return tx("readonly").then(
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = (e) => reject(e.target.error);
        })
    );
  }

  function getAll() {
    return tx("readonly").then(
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = (e) => reject(e.target.error);
        })
    );
  }

  function remove(id) {
    return tx("readwrite").then(
      (store) =>
        new Promise((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = (e) => reject(e.target.error);
        })
    );
  }

  return { put, get, getAll, remove };
})();
