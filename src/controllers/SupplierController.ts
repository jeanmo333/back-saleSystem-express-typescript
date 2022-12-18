import { isUUID } from "class-validator";
import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import { supplierRepository } from '../repositories/supplierRepository';
import { Supplier } from "../entities/Supplier";

export class SupplierController {
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


    const supplierRut = await supplierRepository.findOneBy({ rut });
    if (supplierRut) throw new BadRequestError("Rut proveedor ya existe");

    const supplierPhone = await supplierRepository.findOneBy({ phone });
    if (supplierPhone) throw new BadRequestError("Telefono proveedor ya existe");

    const supplierEmail = await supplierRepository.findOneBy({ email });
    if (supplierEmail) throw new BadRequestError("Email proveedor ya existe");

    
    const newSupplier = supplierRepository.create({ name, rut,phone,email,web,address });
    newSupplier.user = req.user;
    try {
      await supplierRepository.save(newSupplier);
      return res.status(201).json(newSupplier);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  //********************************************************************** */

  async findAll(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;

    try {
      const suppliers = await supplierRepository.find({
        where: {
          isActive: true,
          user: { id: req.user.id },
        },
        take: Number(limit),
        skip: Number(offset),
      });

      return res.json(suppliers);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  //********************************************************************** */

  async findOne(req: Request, res: Response) {
    const { term } = req.params;
    let supplier: Supplier | null;

    if (isUUID(term)) {
      supplier = await supplierRepository.findOne({
        where: { id: term, user: { id: req.user.id } },
      });
    } else {
        supplier = await supplierRepository.findOne({
        where: { name: term.toLowerCase(), user: { id: req.user.id } },
      });
    }

    if (!supplier) throw new BadRequestError("Proveedor no existe");

    if (supplier.user.id !== req.user.id)
      throw new UnauthorizedError("acceso no permitido");

    if (supplier.isActive === false)
      throw new BadRequestError("Proveedor no esta activo");

    return res.json(supplier);
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

    if (!isUUID(id)) throw new BadRequestError("Proveedor no valido");

    const supplier = await supplierRepository.findOneBy({ id });
    if (!supplier) throw new BadRequestError("Cliente no existe");

    if (supplier.user.id !== req.user.id)
      throw new UnauthorizedError("acceso no permitido");

    supplier.name     = name    || supplier.name;
    supplier.rut      = rut     || supplier.rut;
    supplier.phone    = phone   || supplier.phone;
    supplier.email    = email   || supplier.web;
    supplier.web      = web     || supplier.name;
    supplier.address  = address || supplier.address;
    supplier.isActive = isActive;

    try {
      await supplierRepository.update(id, supplier);

      const supplierUpdate = await supplierRepository.findOneBy({ id });
      return res.json({ supplierUpdate, message: "Editado con exito" });
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) throw new BadRequestError("proveedor no valido");

    const supplier = await supplierRepository.findOneBy({ id });
    if (!supplier) throw new BadRequestError("proveedor no existe");

    if (supplier.user.id !== req.user.id)
      throw new UnauthorizedError("acceso no permitido");

    try {
      await supplierRepository.delete(id);
      return res.json({ message: "Eliminado con exito" });
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }
}
