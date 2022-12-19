
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { Detail } from './Detail';

import { User } from './User';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;


  @IsInt()
  @IsPositive()
  @IsOptional()
  @Column('int', {
    default: 0,
  })
  discount: number;



  @ManyToOne(() => Customer, (customer) => customer.sale, {
    onDelete: 'CASCADE',
  })
  customer: Customer;



  @ManyToMany(() => Detail, ( detail) =>  detail.sale, {
    cascade: true,
  })
  @JoinTable()
  details: Detail[];




  @ManyToOne(() => User, (user) => user.sale, { eager: true })
  user: Partial<User>;

  /*
  @OneToMany(() => Detail, (detail) => detail.sale, {  onDelete: 'CASCADE' })
  details?: Detail[];
*/
}
