import {
  IsBoolean,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Sale } from "./Sale";
import { User } from "./User";

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @IsString()
  @MinLength(10, { message: "minimo 10 digitoas" })
  @Column("text", {
    unique: true,
  })
  rut: string;

  @IsString()
  @MinLength(1, { message: "minimo una letra" })
  @Column("text")
  name: string;

  @IsString()
  @MinLength(9, { message: "minimo 9 digitos" })
  @Column("text", {
    unique: true,
  })
  phone: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  @Column("text", {
    unique: true,
  })
  email: string;

  @IsString()
  @IsOptional()
  @Column("text")
  web: string;

  @IsOptional()
  @IsBoolean()
  @Column("bool", {
    default: true,
  })
  isActive: boolean;

  @IsOptional()
  @IsString()
  @Column("text")
  address: string;

  @ManyToOne(() => User, (user) => user.customer, { eager: true })
  user:Partial<User>;


  @OneToMany(() => Sale, (sale) => sale.customer)
  sale: Sale;

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
