import "../styles/global.css";
import DisplayCard from "../components/ui/displayCard";
import ProductForm from "./ProductForm";

export default function AdminPage() {
  return <div className="bg-blue-mirage max-w-full h-screen flex flex-col items-start">
    <h1 className="text-3xl mx-auto my-2">Administrar</h1>
    <DisplayCard />
    <ProductForm />
  </div>
}