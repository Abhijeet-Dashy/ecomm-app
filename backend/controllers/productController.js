import { sql } from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const product = await sql`select * from products`;
    console.log(product);
    res.status(200).json({ message: "fetch successful", data: product });
  } catch (error) {
    console.log("the error is :", error);
    res.status(500).json({ message: "server error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`select * from products where id=${id}`;
    if (product.length === 0) {
      return res.status(404).json({ message: "product not found" });
    }
    console.log(product);
    res.status(200).json({ message: "fetch successful", data: product });
  } catch (error) {
    console.log("the error is :", error);
    res.status(500).json({ message: "server error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, image, price } = req.body;
  if (!name || !image || !price) {
    return res.status(400).json({ message: "please provide all the fields" });
  }
  try {
    const createdProduct =
      await sql`insert into products (name, image, price) values (${name}, ${image}, ${price}) returning *`;
    console.log(createdProduct);
    res
      .status(201)
      .json({ message: "product created successfully", data: createdProduct });
  } catch (error) {
    console.log("the error is :", error);
    res.status(500).json({ message: "server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price } = req.body;
  if (!name || !image || !price) {
    return res.status(400).json({ message: "please provide all the fields" });
  }
  try {
    const newProduct =
      await sql`update products set name = ${name}, image = ${image}, price = ${price} where id = ${id} returning *`;
    if (newProduct.length === 0) {
      return res.status(404).json({ message: "product not found" });
    }
    console.log(newProduct);
    res
      .status(200)
      .json({ message: "product updated successfully", data: newProduct });
  } catch (error) {
    console.log("the error is :", error);
    res.status(500).json({ message: "server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct =
      await sql`delete from products where id = ${id} returning *`;

    res
      .status(200)
      .json({ message: "product deleted successfully", data: deletedProduct });
    if (deletedProduct.length === 0) {
      return res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    console.log("the error is :", error);
    res.status(500).json({ message: "server error" });
  }
};
