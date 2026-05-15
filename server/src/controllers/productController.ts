import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';

export const getProducts = async (req: Request, res: Response) => {
  const pageSize = 50;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: String(req.query.keyword),
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: String(req.query.category) } : {};

  const count = await Product.countDocuments({ ...keyword, ...category } as any);
  const products = await Product.find({ ...keyword, ...category } as any)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const createProduct = async (req: any, res: Response) => {
  const { title, price, description, thumbnail, brand, category, stock, discount, tags, features, badge } = req.body;

  if (!title || !price || !description || !thumbnail || !brand || !category) {
    res.status(400).json({ message: 'Please provide all required fields' });
    return;
  }

  const product = new Product({
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now(),
    price,
    description,
    category,
    brand,
    stock: stock || 0,
    thumbnail,
    discount: discount || 0,
    tags: tags || [],
    features: features || [],
    badge: badge || '',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { title, price, description, thumbnail, brand, category, stock, discount, tags, features, badge } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.title = title || product.title;
    product.price = price || product.price;
    product.description = description || product.description;
    product.thumbnail = thumbnail || product.thumbnail;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.discount = discount || product.discount;
    product.tags = tags || product.tags;
    product.features = features || product.features;
    product.badge = badge || product.badge;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.find({});
  res.json(categories);
};
