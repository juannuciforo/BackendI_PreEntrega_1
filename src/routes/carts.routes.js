import { Router } from "express";
import { FileManager } from "../utils/fileManager.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cartsFile = path.join(__dirname, '../data/carts.json');
const fileManager = new FileManager(cartsFile);

export const cartsRoutes = Router();


// ------------------------------
// GET /carts/:cid
// ------------------------------
cartsRoutes.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    if (isNaN(Number(cid))) return res.status(400).json({ error: "El ID debe ser un número válido" });

    const carts = await fileManager.readFile();
    const cart = carts.find(c => c.id === Number(cid));

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    res.status(200).json(cart);
  } catch (error) {
    const status = error.status || 500;
    const message = status === 404 ? "No se encontró el carrito" : "Error en el servidor";
    res.status(status).json({ error: message });
  }
});

// ------------------------------
// POST /carts
// ------------------------------
cartsRoutes.post("/", async (req, res) => {
  try {
    const carts = await fileManager.readFile();

    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      products: []
    };

    carts.push(newCart);
    await fileManager.writeFile(carts);

    res.status(201).json({
      message: "Carrito añadido exitosamente",
      cart: newCart,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// ------------------------------
// POST /carts/:cid/product/:pid
// ------------------------------
cartsRoutes.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!cid || !pid)
      return res.status(400).json({ error: "Todos los campos son requeridos" });

    const carts = await fileManager.readFile();

    const cartExists = carts.find((cart) => cart.id === Number(cid));

    const productExists = cartExists.products.find((product) => product.id === Number(pid));

    // Si existe el id del producto en el carrito, se suma un 1 al array de cantidad del producto, si no existe, se crea un nuevo producto con cantidad 1 en el array de productos del carrito
    if (cartExists && productExists) {
      productExists.quantity += 1;
      console.log('Cantidad actualizada:', productExists);  // Ver la actualización
    } else {
      const newProduct = {
        id: Number(pid),
        quantity: 1
      };
      cartExists.products.push(newProduct);
      console.log('Cantidad creada:', newProduct.quantity)  // Ver la creación y la cantidad creada
    }

    await fileManager.writeFile(carts);

    res.status(201).json({
      message: "Producto añadido exitosamente",
      product: productExists || newProduct
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});