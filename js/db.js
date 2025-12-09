// ===============================
// DB - IndexedDB Wrapper
// ===============================

window.DB = {
    db: null,
    dbName: "dreamerDB",
    version: 1,

    stores: [
        "userProfile",
        "workouts",
        "routines",
        "exercises",
        "folders",
        "measurements"
    ],

    // -------------------------------
    // INIT
    // -------------------------------
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject("Erro ao abrir o banco");

            request.onupgradeneeded = (e) => {
                const db = e.target.result;

                this.stores.forEach(store => {
                    if (!db.objectStoreNames.contains(store)) {
                        db.createObjectStore(store, { keyPath: "id" });
                    }
                });
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve();
            };
        });
    },

    // -------------------------------
    // GET ALL
    // -------------------------------
    async getAll(storeName) {
        return new Promise((resolve) => {
            const tx = this.db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const req = store.getAll();

            req.onsuccess = () => resolve(req.result || []);
            req.onerror = () => resolve([]);
        });
    },

    // -------------------------------
    // GET FIRST OR CREATE DEFAULT
    // -------------------------------
    async getFirst(storeName, defaultData) {
        return new Promise((resolve) => {
            const tx = this.db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);

            const req = store.get(defaultData.id);

            req.onsuccess = () => {
                if (req.result) {
                    resolve(req.result);
                } else {
                    store.put(defaultData);
                    resolve(defaultData);
                }
            };

            req.onerror = () => resolve(defaultData);
        });
    },

    // -------------------------------
    // SAVE (CREATE / UPDATE)
    // -------------------------------
    async save(storeName, data) {
        return new Promise((resolve) => {
            if (!data.id) {
                data.id = crypto.randomUUID();
            }

            const tx = this.db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);

            store.put(data);

            tx.oncomplete = () => resolve(data);
        });
    },

    // -------------------------------
    // DELETE
    // -------------------------------
    async delete(storeName, id) {
        return new Promise((resolve) => {
            const tx = this.db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);

            store.delete(id);

            tx.oncomplete = () => resolve(true);
        });
    }
};
