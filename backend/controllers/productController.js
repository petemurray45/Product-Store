import { error } from "console";
import { sql } from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
    `;
    console.log("Fetched all products", products);
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.log("Error getting all products", err);
  }
};
export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  try {
    const newProduct = await sql`
        INSERT INTO products (name, price, image)
        VALUES (${name}, ${price}, ${image})
        RETURNING *
    `;
    console.log("New product added", newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    console.log("Error creating product", err);
    res
      .status(500)
      .json({ success: false, message: "Error creating product." });
  }
};
export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sql`
    SELECT * FROM products WHERE id = ${id}`;
    res.status(200).json({ success: true, data: product[0] });
  } catch (err) {
    console.log("Error getting product", err);
    res.status(500).json({ success: false, message: "Error getting product." });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const updateProduct = await sql`
    UPDATE products
    SET name=${name}, price=${price}, image=${image}
    WHERE id=${id}
    RETURNING *
    `;
    if (updateProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({ success: true, data: updateProduct[0] });
  } catch (err) {
    console.log("Error updating product");
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteProduct = await sql`
    DELETE FROM products 
    WHERE id=${id}
    RETURNING *`;

    if (deleteProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({ success: true, data: deleteProduct[0] });
  } catch (err) {
    console.log("Error in deleteProduct function", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
