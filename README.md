# Primera Pre-entrega Backend

Servidor basado en Node.JS y express que implementa una API REST para manejar productos y carritos de compra.

## Instalación

```bash
npm install
```

## Uso

```bash
npm run dev
```

El servidor estará corriendo en http://localhost:8080

## Endpoints

### Products
- GET /api/products
- GET /api/products/:pid
- POST /api/products
- PUT /api/products/:pid
- DELETE /api/products/:pid

### Carts
- POST /api/carts
- GET /api/carts/:cid
- POST /api/carts/:cid/product/:pid