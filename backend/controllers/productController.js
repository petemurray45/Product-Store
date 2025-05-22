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
export const getProduct = async (req, res) => {};
export const updateProduct = async (req, res) => {};
export const deleteProduct = async (req, res) => {};
