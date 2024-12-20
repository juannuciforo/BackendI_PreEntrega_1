import express from "express";
import { productsRoutes } from "./routes/products.routes.js";
import { cartsRoutes } from "./routes/carts.routes.js";

const app = express();
const PORT = 8080; // Quería poner el 5000 como se vio en la clase pero la consigna decía explicitamente el server 8080

// Express configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);


// App Listen
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });