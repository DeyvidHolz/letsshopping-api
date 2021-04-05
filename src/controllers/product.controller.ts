import { getConnection } from 'typeorm';
import { Request, Response } from 'express';

import { Product } from '../entity/Product';
import { Category } from '../entity/Category';

import validator from 'validator';

class ProductController {

  private static getRespository() {
    return getConnection().getRepository(Product);
  }
  
  public static create = async (req: Request, res: Response) => {

    const productRepository = ProductController.getRespository();

    const product = new Product();
    product.code = req.body.code;
    product.name = req.body.name;
    product.shortDescription = req.body.shortDescription;
    product.description = req.body.description;
    product.mainImage = req.body.mainImage;
    product.isActive = req.body.isActive;
    product.stock = req.body.stock;

    if (req.body.categories) {
      const categoryRepository = getConnection().getRepository(Category);
      const categories = await categoryRepository.findByIds(req.body.categories);
      product.categories = categories;
    }

    const validationErrors = [];

    if (product.code.length !== 6) {
      validationErrors.push({ field: 'code', message: 'The product code must have 6 characters.'});
    }

    if (!product.code.match(/[A-Za-z0-9]+/g)) {
      validationErrors.push({ field: 'code', message: 'Invalid product code.'});
    }

    if (!product.name.match(/[A-Za-z0-9]+/g)) {
      validationErrors.push({ field: 'name', message: 'Invalid product name.'});
    }

    if (validationErrors.length) {
      return res.status(422).json({ error: true, message: 'Invalid data.', errors: validationErrors }); 
    }

    try {
      await productRepository.save(product);
      return res.status(201).json({ message: 'Product created', product });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(422).json({ error: true, message: 'This code is already in use.' }); 
      }
      return res.status(500).json({ error: true, message: err });  
    }
    
  }

  public static get = async (req: Request, res: Response) => {
    // req.query.code ? search by code : search by id
  }

  public static getAll = async (req: Request, res: Response) => {
    const products = await getConnection().getRepository(Product)
      .find({ relations: [ 'categories' ] });
    return res.status(200).json(products);
  }

  public static update = async (req: Request, res: Response) => {

  }

  public static delete = async (req: Request, res: Response) => {

  }

}

export default ProductController;
