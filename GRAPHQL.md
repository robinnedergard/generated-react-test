# GraphQL Setup

This application uses GraphQL to serve product data.

## Running the GraphQL Server

To start the GraphQL server, run:

```bash
npm run dev:server
```

The server will start on `http://localhost:4000/graphql`

## Running the Application

In a separate terminal, start the React development server:

```bash
npm run dev
```

The application will connect to the GraphQL server at `http://localhost:4000/graphql` by default.

## Environment Variables

You can configure the GraphQL server URL by setting the `VITE_GRAPHQL_URL` environment variable:

```bash
VITE_GRAPHQL_URL=http://localhost:4000/graphql npm run dev
```

## GraphQL Schema

The GraphQL schema defines the following types:

- `Product`: Represents a product with id, name, category, price, image, description, badge, featured status, and colors
- `Query`: 
  - `products`: Returns all products
  - `product(id: ID!)`: Returns a single product by ID

## Example Query

```graphql
query GetProducts {
  products {
    id
    name
    category
    price
    image
    description
    badge
    featured
    colors
  }
}
```

