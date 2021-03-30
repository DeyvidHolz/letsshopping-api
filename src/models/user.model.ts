// https://medium.com/nsoft/building-and-running-nodejs-typescript-postgresql-application-with-docker-3878240a2f73

import { sequelize } from '../dbConnection'
import { Model, Optional, DataTypes } from 'sequelize'
import IUser from '../interfaces/user.interface'

interface UserCreationAttributes extends Optional<IUser, 'id'> {}

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: number;
  public username!: string;
  public password!: string;

  public firstName: string;
  public lastName: string;
  public email: string;
  public birthDate: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    birthDate: {
      type: new DataTypes.DATEONLY(),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    sequelize,
  }
)

User.sync()
  .then(() => console.log('Users table created successfully.'))
  .catch((err) => console.log('Error on trying to create Users table', err));

export default User;