import { IsInt, IsPositive } from 'class-validator';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Product } from './Product';
import { Sale } from './Sale';

  
  @Entity()
  export class Detail {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  

    @IsInt()
    @IsPositive()
    @Column('int', {
      default: 0,
    })
    quantity: number;
  

    @ManyToOne(() => Product, (product) => product.detail, {
      onDelete: 'CASCADE',
    })
    product?: Product;

    
  
    @ManyToMany(() => Sale, (sale) => sale.details)
    sale: Sale
  
  /*
    @ManyToOne(() => Sale, (sale) => sale.details, {
      cascade: true,
    })
    sale?: Sale;
    */
  
  }
  