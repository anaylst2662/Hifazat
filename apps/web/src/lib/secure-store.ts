// Encrypted storage that stays ONLY in this browser, on this device.
//
// How it works, in plain words:
//  - The browser creates a secret key (AES-GCM, 256-bit) that can never be
//    read out or copied, only used by this site in this browser.
//  - Data is encrypted with that key before it is saved (in IndexedDB).
//  - Nothing is ever sent to Hifazat or anyone else.
//
// Honest limit: anyone who can open Hifazat in this same browser can see the
// data, just like you can. The PIN lock (discreet mode) will add protection
// against that later.

const DB_NAME = "hifazat-private";
const STORE = "items";
const KEY_ID = "device-key";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = action(tx.objectStore(STORE));
        tx.oncomplete = () => {
          db.close();
          resolve(request.result);
        };
        tx.onerror = () => reject(tx.error);
      }),
  );
}

async function deviceKey(): Promise<CryptoKey> {
  const existing = await run<CryptoKey | undefined>("readonly", (s) => s.get(KEY_ID));
  if (existing) return existing;
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  await run("readwrite", (s) => s.put(key, KEY_ID));
  return key;
}

type Sealed = { iv: Uint8Array; data: ArrayBuffer };

export async function saveEncrypted(name: string, value: unknown): Promise<void> {
  const key = await deviceKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = new TextEncoder().encode(JSON.stringify(value));
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain);
  await run("readwrite", (s) => s.put({ iv, data } satisfies Sealed, name));
}

export async function loadEncrypted<T>(name: string): Promise<T | null> {
  const sealed = await run<Sealed | undefined>("readonly", (s) => s.get(name));
  if (!sealed) return null;
  const key = await deviceKey();
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: sealed.iv as BufferSource }, key, sealed.data);
  return JSON.parse(new TextDecoder().decode(plain)) as T;
}

/** Deletes everything Hifazat saved privately in this browser, including the key. */
export function deleteAllPrivateData(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

/** False in browsers/modes where private storage is not available. */
export function secureStoreSupported(): boolean {
  return typeof indexedDB !== "undefined" && typeof crypto !== "undefined" && Boolean(crypto.subtle);
}
