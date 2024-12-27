// Generate a secure encryption key using PBKDF2
export const generateEncryptionKey = async (
  passphrase: string,
  salt: string
) => {
  const encoder = new TextEncoder();

  // Derive a base key from the passphrase
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  // Use PBKDF2 to derive a more secure key
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      // Higher iterations means more security. (Might be slower)
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

// Generate a random salt for added security
export const generateRandomSalt = () => {
  // This is a 128-bit salt
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  // Base64 encode the salt
  return btoa(String.fromCharCode(...Array.from(array)));
};
