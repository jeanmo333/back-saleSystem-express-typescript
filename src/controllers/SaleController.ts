import { isUUID } from "class-validator";
import { Request, Response } from "express";
import { DeepPartial } from "typeorm";
import { Detail } from "../entities/Detail";
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import { In } from "typeorm"
import { detailRepository } from "../repositories/detailRepository";
import { saleRepository } from "../repositories/saleRepository";
import { productRepository } from "../repositories/productRepository";

export class SaleController {
  async create(req: Request, res: Response) {
    const { details = [], ...rest } = req.body ;

    // const productsIds = details.map( (product: { id: any; }) => product.id );
    // const productSales= await productRepository.findBy({
    //     productsIds: In(["About #2", "About #3"]),
    // })

    if ([rest.customer].includes("") && details.length === 0) {
      throw new BadRequestError("Hay Campo vacio");
    }
    if (!isUUID(rest.customer)) throw new BadRequestError("Cliente no valido");


    const newSale = saleRepository.create({
      ...rest,
      details: details.map((detail: DeepPartial<Detail>[]) =>
        detailRepository.create(detail)
      ),
      user: req.user
    });
   
    try {
      await saleRepository.save(newSale);
      return res.status(201).json(newSale);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  //********************************************************************** */

  async findAll(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;

    try {
      const sales = await saleRepository.find({
        where: {
          // isActive: true,
          user: { id: req.user.id },
        },
        relations: {
          customer: true,
        },
        take: Number(limit),
        skip: Number(offset),
      });

      return res.json(sales);
    } catch (error) {
      console.log(error);
      throw new BadRequestError("revisar log servidor");
    }
  }

  //********************************************************************** */

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    
    
    if (!isUUID(id)) throw new BadRequestError("venta no valida");

 
      const sale = await saleRepository.findOne({
        where: { id, user: { id: req.user.id } },
      });

      if (!sale) throw new BadRequestError("Venta no existe");

      if (sale.user.id !== req.user.id)
        throw new UnauthorizedError("acceso no permitido");

      return res.json(sale);
  
     
    
  }
  //********************************************************************** */

//   async update(req: Request, res: Response) {
//     const {
//       name,
//       description,
//       purchase_price,
//       sale_price,
//       stock,
//       category,
//       supplier,
//       isActive,
//     } = req.body;
//     const { id } = req.params;

//     if (!isUUID(id)) throw new BadRequestError("Producto no valido");

//     const product = await productRepository.findOneBy({ id });
//     if (!product) throw new BadRequestError("Producto no existe");

//     if (product.user.id !== req.user.id)
//       throw new UnauthorizedError("acceso no permitido");

//     product.name = name || product.name;
//     product.description = description || product.description;
//     product.purchase_price = purchase_price || product.purchase_price;
//     product.sale_price = sale_price || product.sale_price;
//     product.stock = stock || product.stock;
//     product.category = category || product.category;
//     product.supplier = supplier || product.supplier;
//     product.isActive = isActive;

//     try {
//       await productRepository.save(product);

//       const productUpdate = await productRepository.findOneBy({ id });
//       return res.json({ productUpdate, message: "Editado con exito" });
//     } catch (error) {
//       console.log(error);
//       throw new BadRequestError("revisar log servidor");
//     }
//   }

//   async remove(req: Request, res: Response) {
//     const { id } = req.params;

//     if (!isUUID(id)) throw new BadRequestError("Cliente no valida");

//     const product = await productRepository.findOneBy({ id });
//     if (!product) throw new BadRequestError("Producto no existe");

//     if (product.user.id !== req.user.id)
//       throw new UnauthorizedError("acceso no permitido");

//     try {
//       await productRepository.delete(id);
//       return res.json({ message: "Eliminado con exito" });
//     } catch (error) {
//       console.log(error);
//       throw new BadRequestError("revisar log servidor");
//     }
//   }
}
