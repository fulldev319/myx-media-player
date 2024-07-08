import {ecsign, keccak, privateToAddress, toRpcSig} from 'ethereumjs-util';

/**
 * generate signature and hash
 * @param func
 * @param address
 * @param payload
 * @returns signature and hash
 */
export const signTransaction = async (
  address: string,
  privateKey: string,
  tx: any,
) => {
  try {
    let _prvKey: Buffer;
    if (privateKey) {
      _prvKey = Buffer.from(privateKey);
    } else {
      _prvKey = Buffer.from(privateKey);
    }

    let hash = keccak(Buffer.from(JSON.stringify(tx)));
    const {v, r, s} = ecsign(hash, _prvKey);
    const signature = toRpcSig(v, r, s);
    return {
      address,
      hash,
      signature,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
