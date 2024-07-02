import { BinaryLike, createHash } from "crypto";

export function hash(dado: BinaryLike) {
  return createHash('sha256').update(dado).digest('hex')
}