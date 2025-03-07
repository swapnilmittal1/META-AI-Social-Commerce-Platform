import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export default class Product extends Model {
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.FLOAT)
  price!: number;

  @Column(DataType.STRING)
  imageUrl?: string;

  // Optionally store a reference to a FB catalog item ID if synced
  @Column(DataType.STRING)
  fbItemId?: string;
}
