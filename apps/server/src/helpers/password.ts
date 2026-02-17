import { sha256 } from '@sharkord/shared';

const ARGON2_PREFIX = 'argon2$';

const hashPassword = async (password: string): Promise<string> => {
  const hash = await Bun.password.hash(password, {
    algorithm: 'argon2id'
  });

  return `${ARGON2_PREFIX}${hash}`;
};

const isArgon2Hash = (storedHash: string): boolean => {
  return storedHash.startsWith(ARGON2_PREFIX);
};

const verifyPassword = async (
  password: string,
  storedHash: string
): Promise<boolean> => {
  if (isArgon2Hash(storedHash)) {
    const hash = storedHash.slice(ARGON2_PREFIX.length);
    return Bun.password.verify(password, hash);
  }

  // Legacy fallback for previously stored SHA-256 hashes.
  const legacyHash = await sha256(password);
  return legacyHash === storedHash;
};

export { hashPassword, isArgon2Hash, verifyPassword };
