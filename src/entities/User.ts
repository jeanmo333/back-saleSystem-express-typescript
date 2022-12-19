import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import generarId from "../helpers/generarId";
import { Category } from "./Category";
import { Customer } from "./Customer";
import { Product } from "./Product";
import { Sale } from "./Sale";
import { Supplier } from "./Supplier";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsString()
  @IsEmail()
  @Column("text", {
    unique: true,
  })
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "password Uppercase, lowercase, number",
  })
  @Column("text")
  password: string;

  @IsString()
  @MinLength(1)
  @Column("text")
  name: string;

  @IsOptional()
  @IsBoolean()
  @Column("bool", {
    default: false,
  })
  isActive: boolean;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @Column("text", {
    array: true,
    default: ["autor"],
  })
  roles: string[];

  @IsString()
  @Column("text", {
    default: generarId(),
  })
  token: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @Column("text")
  phone: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @Column("text")
  address: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @Column("text")
  web: string;

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @OneToMany(() => Category, (category) => category.user)
  category: Category;

  @OneToMany(() => Customer, (customer) => customer.user)
  customer: Customer;

 
    @OneToMany(() => Sale, (sale) => sale.user)
    sale: Sale;

  @OneToMany(() => Supplier, (suplier) => suplier.user)
  supplier: Supplier;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }

  @BeforeInsert()
  checkNameInsert() {
    this.name = this.name.toLowerCase();
  }

  @BeforeUpdate()
  checkNameUpdate() {
    this.name = this.name.toLowerCase();
  }
}
