import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  server_port: number;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  server_port: 3030,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
