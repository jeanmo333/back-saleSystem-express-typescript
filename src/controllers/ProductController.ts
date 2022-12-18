import { isUUID } from "class-validator";
import { Request, Response } from "express";
import { Product } from "../entities/Product";
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import { productRepository } from "../repositories/productRepository";

export class ProductController {
  async create(req: Request, res: Response) {
    const {
      name = "",
      description = "",
      purchase_price = 0,
      sale_price = 0,
      stock = 0,
      category = "",
      supplier = "",
    } = req.body;

    if ([name, category, supplier].includes("")) {
      throw new BadRequestError("Hay Campo vacio");
    }

    const productName = await productRepository.findOneBy({ name });
    if (productName) {
      throw new BadRequestError("Producto ya existe");
    }


    const newProduct = productRepository.create({
      name,
      description,
      purchase_price,
      sale_price,
      stock,
      category,
      supplier,
    });
    newProduct.user = req.user;
    try {
      await productRepository.save(newProduct);
      return res.status(201).json(newProduct);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  //********************************************************************** */

  async findAll(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;

    try {
      const products = await productRepository.find({
        where: {
          isActive: true,
          user: { id: req.user.id },
        },
        relations: {
          category: true,
          supplier: true,
        },
        take: Number(limit),
        skip: Number(offset),
      });

      return res.json(products);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  //********************************************************************** */

  async findOne(req: Request, res: Response) {
    const { term } = req.params;
    let product: Product | null;

    if (isUUID(term)) {
      product = await productRepository.findOne({
        where: { id: term, user: { id: req.user.id } },
      });
    } else {
      product = await productRepository.findOne({
        where: { name: term.toLowerCase(), user: { id: req.user.id } },
      });
    }

    if (!product) throw new BadRequestError("Producto no existe");

    if (product.user.id !== req.user.id)
      throw new UnauthorizedError("acceso no permitido");

    if (product.isActive === false)
      throw new BadRequestError("producto no esta activo");

    return res.json(product);
  }

  //********************************************************************** */

  async update(req: Request, res: Response) {
    const {
      name,
      description,
      purchase_price,
      sale_price,
      stock,
      category,
      supplier,
      isActive,
    } = req.body;
    const { id } = req.params;

    if (!isUUID(id)) throw new BadRequestError("Producto no valido");

    const product = await productRepository.findOneBy({ id });
    if (!product) throw new BadRequestError("Producto no existe");

    if (product.user.id !== req.user.id)
      throw new UnauthorizedError("acceso no permitido");

    product.name = name || product.name;
    product.description = description || product.description;
    product.purchase_price = purchase_price || product.purchase_price;
    product.sale_price = sale_price || product.sale_price;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.supplier = supplier || product.supplier;
    product.isActive = isActive;

    try {
      await productRepository.update(id, product);

      const productUpdate = await productRepository.findOneBy({ id });
      return res.json({ productUpdate, message: "Editado con exito" });
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) throw new BadRequestError("Cliente no valida");

    const product = await productRepository.findOneBy({ id });
    if (!product) throw new BadRequestError("Producto no existe");

    if (product.user.id !== req.user.id)
      throw new UnauthorizedError("acceso no permitido");

    try {
      await productRepository.delete(id);
      return res.json({ message: "Eliminado con exito" });
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }
}
