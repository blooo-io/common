// Copyright 2017-2022 @polkadot/util authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '../bn/bn';
import type { HexString, NumberOptions, ToBigInt, ToBn } from '../types';

import { u8aToHex } from '../u8a';
import { nToU8a } from './toU8a';

/** @internal */
const ZERO_STR = '0x00';

/**
 * @name nToHex
 * @summary Creates a hex value from a bigint object.
 */
export function nToHex <ExtToBn extends ToBn | ToBigInt> (value?: ExtToBn | BN | bigint | number | null, { bitLength, isLe = false, isNegative = false }: NumberOptions = {}): HexString {
  return !value
    ? ZERO_STR
    : u8aToHex(nToU8a(value, { bitLength, isLe, isNegative }));
}
