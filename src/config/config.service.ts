import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

export interface Config {
  [key: string]: string;
}

/**
 * Configuration service
 * Handles all system configuration through .env files
 */
@Injectable()
export class ConfigService {
  private readonly config: Config;

  /**
   * Initialise the service by parsing a .env file.
   * @param configPath Path to a valid .env file. Should be an absolute path.
   */
  constructor(configPath: string) {
    const config = dotenv.parse(fs.readFileSync(configPath));
    this.config = this.validateConfig(config);
  }

  /**
   * Checks whether the provided .env file is valid or not.
   * Defaults are applied when values are not given.
   * @param config The configuration object loaded from reading the env file
   */
  private validateConfig(config: Config): Config {
    const envSchema: Joi.ObjectSchema = Joi.object({});

    const { error, value: validatedConfig } = Joi.validate(config, envSchema);
    if (error) {
      throw new Error(`.env configuration error: ${error.message}`);
    }
    return validatedConfig;
  }
}
