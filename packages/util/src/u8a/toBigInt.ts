// Copyright 2017-2021 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ToBnOptions } from '../types';

import { objectSpread } from '../object/spread';

const U8_MULT = 256n;
const U16_MUL = U8_MULT * U8_MULT;

function xor (input: Uint8Array): Uint8Array {
  const result = new Uint8Array(input.length);
  const dvI = new DataView(input.buffer, input.byteOffset);
  const dvO = new DataView(result.buffer);
  const mod = input.length % 2;
  const length = input.length - mod;

  for (let i = 0; i < length; i += 2) {
    dvO.setUint16(i, dvI.getUint16(i) ^ 0xffff);
  }

  if (mod) {
    dvO.setUint8(length, dvI.getUint8(length) ^ 0xff);
  }

  return result;
}

function toBigInt (input: Uint8Array): bigint {
  const dvI = new DataView(input.buffer, input.byteOffset);
  const mod = input.length % 2;
  const length = input.length - mod;
  let result = BigInt(0);

  for (let i = 0; i < length; i += 2) {
    result = (result * U16_MUL) + BigInt(dvI.getUint16(i));
  }

  if (mod) {
    result = (result * U8_MULT) + BigInt(dvI.getUint8(length));
  }

  return result;
}

/**
 * @name u8aToBigInt
 * @summary Creates a BigInt from a Uint8Array object.
 */
export function u8aToBigInt (value: Uint8Array, options: ToBnOptions = {}): bigint {
  if (!value || !value.length) {
    return BigInt(0);
  }

  const { isLe, isNegative }: ToBnOptions = objectSpread({ isLe: true, isNegative: false }, options);
  const u8a = isLe
    ? value.reverse()
    : value;

  return isNegative
    ? ((toBigInt(xor(u8a)) * -1n) - 1n)
    : toBigInt(u8a);
}