import { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Create Product",
};

const CreateProduct = () => {
  return (
    <>
      <h2 className="h2-bold">
        Create Product
        <div className="my-8">
          <ProductForm type="Create" />
        </div>
      </h2>
    </>
  );
};

export default CreateProduct;
