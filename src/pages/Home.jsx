import { getProducts } from "../data/products";
import { getProducts } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  return (
    <div className="page">
      <div className="home-hero">
        <h1 className="home-title">Welcome to ShopHub</h1>
        <p className="home-subtitle">
          Discover amazing products at great prices.
        </p>
      </div>
      <div className="container">
        <h2 className="page-title">Our Products</h2>
        <div className="product-grid">
          {getProducts().map((product) => (
         <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
