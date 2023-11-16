import { hash } from "bcrypt";

export class HashProvider {
  static async getHash(password: string, saltOrRounds: number = 10): Promise<string> {
    return hash(password, saltOrRounds);
  }
}