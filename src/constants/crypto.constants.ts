import crypto from "node:crypto"

export const algorithm = 'aes-256-cbc';
export const key = crypto.randomBytes(32);
export const iv = crypto.randomBytes(16);
