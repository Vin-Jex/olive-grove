import { openDB } from "idb";
import { TUser } from "./types";
import { generateEncryptionKey, generateRandomSalt } from "./keyManagement";

const dbName = process.env.NEXT_PUBLIC_DB_NAME;
const storeName = process.env.NEXT_PUBLIC_STORE_NAME;

// Encrypt data
const encryptData = async (key: CryptoKey, data: TUser) => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));
  // Random IV for AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedData
  );
  return { iv, encryptedData };
};

// Decrypt data
const decryptData = async (
  key: CryptoKey,
  encryptedData: ArrayBuffer,
  iv: Uint8Array
) => {
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedData
  );
  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decryptedBuffer));
};

// Initialize the database and store user data
export const initDB = async (user: TUser, passphrase: string) => {
  // Generate a random salt
  const salt = generateRandomSalt();
  // Derive the encryption key
  const key = await generateEncryptionKey(passphrase, salt);

  const db = await openDB(dbName, process.env.NEXT_PUBLIC_DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < process.env.NEXT_PUBLIC_DB_VERSION) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      }
    },
  });

  const { iv, encryptedData } = await encryptData(key, user);

  // Store encrypted data along with the salt
  await db.put(storeName, {
    id: user?._id,
    iv: Array.from(iv),
    encryptedData: Array.from(new Uint8Array(encryptedData)),
    salt,
  });

  // Return key for immediate use
  return { key };
};

// Retrieve and decrypt user data
export const getUserFromDB = async (id: string, passphrase: string) => {
  const db = await openDB(dbName, process.env.NEXT_PUBLIC_DB_VERSION);
  const record = await db.get(storeName, id);

  // Optional check if record is null or undefined
  if (!record) {
    console.error("User not found.");
    return null;
  }

  const { iv, encryptedData, salt } = record;

  // Derive the key using the same passphrase and stored salt
  const key = await generateEncryptionKey(passphrase, salt);

  return await decryptData(
    key,
    new Uint8Array(encryptedData).buffer,
    new Uint8Array(iv)
  );
};

// Update user data in the database
export const updateUserInDB = async (
  userId: string,
  updatedUser: TUser,
  passphrase: string
) => {
  const db = await openDB(dbName, process.env.NEXT_PUBLIC_DB_VERSION);

  // Retrieve the existing user data
  const record = await db.get(storeName, userId);

  // Optional check if the record exists
  if (!record) {
    console.error("User not found in the database");
    return null;
  }

  const { iv, encryptedData, salt } = record;

  // Derive the key using the same passphrase and stored salt
  const key = await generateEncryptionKey(passphrase, salt);

  // Decrypt the existing user data
  const currentUser = await decryptData(
    key,
    new Uint8Array(encryptedData).buffer,
    new Uint8Array(iv)
  );

  // Update the user data with the new data
  const updatedData = { ...currentUser, ...updatedUser };

  // Re-encrypt the updated user data
  const { iv: newIv, encryptedData: newEncryptedData } = await encryptData(
    key,
    updatedData
  );

  // Update the record with the new encrypted data
  await db.put(storeName, {
    id: userId,
    iv: Array.from(newIv),
    encryptedData: Array.from(new Uint8Array(newEncryptedData)),
    salt,
  });

  return "User details updated successfully.";
};

// Delete user data from the database
export const deleteUserFromDB = async (userId: string) => {
  const db = await openDB(dbName, process.env.NEXT_PUBLIC_DB_VERSION);

  // Check if the record exists
  const record = await db.get(storeName, userId);

  // Optional check if record is null or undefined
  if (!record) {
    console.error("User not found in DB.");
    return null;
  }

  // Continue if record is found
  await db.delete(storeName, userId);

  return "Deletion was successful.";
};
