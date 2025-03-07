import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export default class Order extends Model {
  @Column(DataType.INTEGER)
  userId!: number;

  @Column(DataType.JSONB)
  items!: any[]; // array of { productId, quantity, price }

  @Column(DataType.FLOAT)
  totalAmount!: number;

  @Column(DataType.STRING)
  status!: string; // e.g. 'PENDING', 'PAID', 'SHIPPED'
}
