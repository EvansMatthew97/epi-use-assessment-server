import { Entity, Column, PrimaryColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

/**
 * Represents a user - enables credential-based login.
 */
@Entity()
export class User {
  @PrimaryColumn({
    unique: true,
  })
  username: string;

  @Column()
  private password: string;

  /**
   * Hashes and sets the password
   * @param password The new password (plaintext)
   */
  async setPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }

  /**
   * Verifies the user's hashed password against the
   * password provided.
   * @param plainTextPassword Password in plain text
   */
  async validatePassword(plainTextPassword: string): Promise<boolean> {
    return await bcrypt.compareSync(plainTextPassword, this.password);
  }
}
