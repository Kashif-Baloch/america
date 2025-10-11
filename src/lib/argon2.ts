import argon2 from "argon2";

export async function hashPassword(password: string) {
    // Uses sensible defaults: Argon2id with secure parameters
    return await argon2.hash(password, {
        type: argon2.argon2id, // ✅ safest version
        memoryCost: 2 ** 16,   // 64 MB
        timeCost: 3,           // iterations
        parallelism: 1,        // threads
    });
}

export async function verifyPassword({
    password,
    hash,
}: {
    password: string;
    hash: string;
}) {
    return await argon2.verify(hash, password);
}
