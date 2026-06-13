// Type declarations for egg-sequelize plugin
import 'egg';

declare module 'egg' {
  interface Application {
    Sequelize: any;
    model: any;
  }
}
