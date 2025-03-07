import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export default class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  passwordHash!: string;

  // Facebook Page Token & IDs
  @Column(DataType.STRING)
  fbPageId?: string;

  @Column(DataType.STRING)
  fbPageAccessToken?: string;

  // Possibly store the user’s Facebook user ID if needed
  @Column(DataType.STRING)
  fbUserId?: string;
}
