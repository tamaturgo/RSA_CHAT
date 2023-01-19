import nodeRSA from 'node-rsa';

export default class RSA {
  private key: nodeRSA;

  constructor() {
    this.key = new nodeRSA();
  }

  public generateKeys(): void {
    this.key.generateKeyPair(2048, 65537);
  }

  public encrypt(message: string, publicKey: string): string {
    try {
      this.key.importKey(publicKey, 'pkcs8-public-pem');
      return this.key.encrypt(message, 'base64');
    } catch (err) {
      console.log(err);
    }
  }

  public decrypt(encryptedMessage: string): string {
    return this.key.decrypt(encryptedMessage, 'utf8');
  }

  public getPublicKey(): string {
    return this.key.exportKey('pkcs8-public-pem');
  }

  public getPrivateKey(): string {
    return this.key.exportKey('pkcs8-private-pem');
  }
}
