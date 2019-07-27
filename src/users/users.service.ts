import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

const ADMIN_USERNAME = 'admin';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    this.setUpAdmin();
  }

  /**
   * Finds a user by username
   * @param username
   */
  async findUser(username: string): Promise<User> {
    return await this.usersRepository.findOne(username);
  }

  /**
   * Ensures the application always has a defualt user.
   * Functionality to add more users could be added in future
   * where there is a single super-admin account which creates
   * other administrators/users. If there is no initial user,
   * then the system is useless.
   */
  private async setUpAdmin(): Promise<void> {
    const admin = await this.usersRepository.findOne({
      where: {
        username: ADMIN_USERNAME,
      },
    });

    // the admin already exists, return
    if (admin) {
      return;
    }

    // create the default admin user
    const adminUser = new User();
    adminUser.username = ADMIN_USERNAME;
    await adminUser.setPassword(process.env.ADMIN_DEFAULT_PASS);

    await this.usersRepository.save(adminUser);
  }
}
