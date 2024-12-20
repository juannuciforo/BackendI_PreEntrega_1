import { Router } from "express";
import { FileManager } from "../utils/fileManager.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFile = path.join(__dirname, '../data/products.json');
const fileManager = new FileManager(productsFile);

export const productsRoutes = Router();


// ------------------------------
// GET /products
// ------------------------------
productsRoutes.get("/", async (req, res) => {
  try {
    const products = await fileManager.readFile();
    if (!products.length) {
      return res.status(404).json({ error: "No hay productos cargados" });
    }

    // Si no se ingresa un límite se envían todos los productos
    let limit = req.query.limit;
    if (!limit || isNaN(limit) || limit <= 0) return res.status(200).json(products)

    // Si se ingresa un límite se envían la cantidad de productos indicada
    res.status(200).json(products.slice(0, limit));
  } catch (error) {
    const status = error.status || 500;
    const message = status === 404 ? "No se encontraron productos" : "Error en el servidor";
    res.status(status).json({ error: message });
  }
});

// ------------------------------
// GET /products/:pid
// ------------------------------
productsRoutes.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    if (isNaN(Number(pid))) return res.status(400).json({ error: "El ID debe ser un número válido" });

    const products = await fileManager.readFile();
    const product = products.find(p => p.id === Number(pid));

    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    res.status(200).json(product);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 404 ? "No se encontró el producto" : "Error en el servidor";
    res.status(status).json({ error: message });
  }
});

// ------------------------------
// POST /products
// ------------------------------
productsRoutes.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category)
      return res.status(400).json({ error: "Todos los campos son requeridos" });

    const products = await fileManager.readFile();
    const productExists = products.find((product) => product.code === code);

    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []  // Si no viene thumbnails, se usa 1 array vacío
    };

    if (productExists) return res.status(400).json({ error: "Ya existe un producto con ese código" });

    products.push(newProduct);
    await fileManager.writeFile(products);

    res.status(201).json({
      message: "Producto añadido exitosamente",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// ------------------------------
// PUT /products/:pid
// ------------------------------
productsRoutes.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (isNaN(Number(pid))) return res.status(400).json({ error: "El ID debe ser un número válido" });

    const products = await fileManager.readFile();

    const product = products.find((product) => product.id === Number(pid));

    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    // Se actualiza el producto con los nuevos datos
    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.code = code ?? product.code;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;
    product.thumbnails = thumbnails ?? product.thumbnails;
    product.status = req.body.status ?? product.status;

    // Se sobreescribe el archivo con el producto actualizado
    await fileManager.writeFile(products);

    res.status(200).json({
      message: "Producto actualizado exitosamente",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// ------------------------------
// DELETE /products/:pid
// ------------------------------
productsRoutes.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    if (isNaN(Number(pid))) return res.status(400).json({ error: "El ID debe ser un número válido" });

    const products = await fileManager.readFile();

    const product = products.find((product) => product.id === Number(pid));

    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    // Se elimina el producto seleccionado
    products.splice(products.indexOf(product), 1);


    // Se actualiza el archivo con el producto eliminado
    await fileManager.writeFile(products);

    res.status(200).json({
      message: "Producto eliminado exitosamente",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});