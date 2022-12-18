import { isUUID } from "class-validator";
import { Request, Response } from "express";
import { Category } from "../entities/Category";
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import { customerRepository } from "../repositories/customerRepository";
import { Customer } from '../entities/Customer';

export class CustomerController {
  async create(req: Request, res: Response) {
    const {
      name = "",
      rut = "",
      phone = "",
      email = "",
      web = "",
      address = "",
    } = req.body;

    if ([name, rut, phone].includes("")) {
      throw new BadRequestError("Hay Campo vacio");
    }


    const customerRut = await customerRepository.findOneBy({ rut });
    if (customerRut) throw new BadRequestError("Rut cliente ya existe");

    const customerPhone = await customerRepository.findOneBy({ phone });
    if (customerPhone) throw new BadRequestError("Telefono cliente ya existe");

    const customerEmail = await customerRepository.findOneBy({ email });
    if (customerEmail) throw new BadRequestError("Email cliente ya existe");

     


    const newCustomer = customerRepository.create({ name, rut,phone,email,web,address });
    newCustomer.user = req.user;
    try {
      await customerRepository.save(newCustomer);
      return res.status(201).json(newCustomer);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  //********************************************************************** */

  async findAll(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;

    try {
      const customers = await customerRepository.find({
        where: {
          isActive: true,
          user: { id: req.user.id },
        },
        take: Number(limit),
        skip: Number(offset),
      });

      return res.json(customers);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  //********************************************************************** */

  async findOne(req: Request, res: Response) {
    const { term } = req.params;
    let customer: Customer | null;

    if (isUUID(term)) {
      customer = await customerRepository.findOne({
        where: { id: term, user: { id: req.user.id } },
      });
    } else {
      customer = await customerRepository.findOne({
        where: { name: term.toLowerCase(), user: { id: req.user.id } },
      });
    }

    if (!customer) throw new BadRequestError("Cliente no existe");

    if (customer.user.id !== req.user.id)
      throw new UnauthorizedError("acceso no permitido");

    if (customer.isActive === false)
      throw new BadRequestError("cliente no esta activo");

    return res.json(customer);
  }

  //********************************************************************** */

  async update(req: Request, res: Response) {
    const { 
        name,
        rut,
        phone,
        email,
        web,
        address,
        isActive
     } = req.body;
    const { id } = req.params;

    if (!isUUID(id)) throw new BadRequestError("Cliente no valido");

    const customer = await customerRepository.findOneBy({ id });
    if (!customer) throw new BadRequestError("Cliente no existe");

    if (customer.user.id !== req.user.id)
      throw new UnauthorizedError("acceso no permitido");

    customer.name = name || customer.name;
    customer.rut = rut || customer.rut;
    customer.phone = phone || customer.phone;
    customer.email = email || customer.web;
    customer.web = web || customer.name;
    customer.address = address || customer.address;
    customer.isActive = isActive;

    try {
      await customerRepository.save(customer);

      const customerUpdate = await customerRepository.findOneBy({ id });
      return res.json({ customerUpdate, message: "Editado con exito" });
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) throw new BadRequestError("Cliente no valida");

    const customer = await customerRepository.findOneBy({ id });
    if (!customer) throw new BadRequestError("Cliente no existe");

    if (customer.user.id !== req.user.id)
      throw new UnauthorizedError("acceso no permitido");

    try {
      await customerRepository.delete(id);
      return res.json({ message: "Eliminado con exito" });
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }
}
