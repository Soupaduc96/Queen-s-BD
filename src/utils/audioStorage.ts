/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const DB_NAME = 'RomanticAppAudioDB';
const STORE_NAME = 'audio_store';
const AUDIO_KEY = 'main-romantic-soundtrack.mp3';

function initAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAudioBlob(blob: Blob): Promise<void> {
  const db = await initAudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(blob, AUDIO_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAudioBlob(): Promise<Blob | null> {
  try {
    const db = await initAudioDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(AUDIO_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Failed to retrieve audio blob from IndexedDB:", err);
    return null;
  }
}

export async function deleteAudioBlob(): Promise<void> {
  const db = await initAudioDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(AUDIO_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
