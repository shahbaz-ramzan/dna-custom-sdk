import * as CryptoJS from 'crypto-js';
import { K } from '../../app/constants/constants';

export default class Encryption {
  static encryptData(data: string) {
    return CryptoJS.AES.encrypt(data, K.APP.ENCRYPTION_KEY)?.toString();
  }

  static decryptData(encryptedMessage: string) {
    return CryptoJS.AES.decrypt(
      encryptedMessage,
      K.APP.ENCRYPTION_KEY
    )?.toString(CryptoJS.enc.Utf8);
  }
}
