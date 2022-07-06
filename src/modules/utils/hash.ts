





// Fuck you








import crypto from "crypto";

function hashPassword(password: string) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");

    return {hash, salt};
}

function verifyPassword(password: string, salt: string, hash: string) {
    const hashVerify = crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");

    return hash === hashVerify;
}

export { hashPassword, verifyPassword };