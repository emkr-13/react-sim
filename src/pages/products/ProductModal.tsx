import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import apiService from "../../services/api";
import { Product } from "../../types";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: (refetchData?: boolean) => void;
}

// Define form validation schema
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  price_sell: z.string().min(1, "Selling price is required"),
  price_cost: z.string().min(1, "Cost price is required"),
  satuan: z.string().min(1, "Unit is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const isEditing = !!product;

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery(
    ["categories"],
    () => apiService.getCategories({ limit: 100 }),
    {
      keepPreviousData: true,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: isEditing
      ? {
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          price_sell: product.price_sell,
          price_cost: product.price_cost,
          satuan: product.satuan,
        }
      : {
          name: "",
          description: "",
          categoryId: "",
          price_sell: "",
          price_cost: "",
          satuan: "",
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (isEditing) {
        await apiService.updateProduct({
          id: product.id,
          ...data,
          price: parseFloat(data.price_sell),
        });
      } else {
        await apiService.createProduct({
          ...data,
          price: parseFloat(data.price_sell),
        });
      }
      reset();
      onClose(true); // Close modal and trigger refetch
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Product" : "Add New Product"}
      isOpen={isOpen}
      onClose={() => onClose()}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            id="name"
            label="Product Name"
            placeholder="Enter product name"
            error={errors.name?.message}
            {...register("name")}
            fullWidth
          />
        </div>

        <div>
          <Input
            id="description"
            label="Description"
            placeholder="Enter product description"
            error={errors.description?.message}
            {...register("description")}
            fullWidth
          />
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category
          </label>
          <Select
            id="categoryId"
            error={errors.categoryId?.message}
            {...register("categoryId")}
            fullWidth
          >
            <option value="">Select a category</option>
            {categoriesData?.data.data.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              id="price_sell"
              label="Selling Price"
              type="number"
              placeholder="Enter selling price"
              error={errors.price_sell?.message}
              {...register("price_sell")}
              fullWidth
            />
          </div>
          <div>
            <Input
              id="price_cost"
              label="Cost Price"
              type="number"
              placeholder="Enter cost price"
              error={errors.price_cost?.message}
              {...register("price_cost")}
              fullWidth
            />
          </div>
        </div>

        <div>
          <Input
            id="satuan"
            label="Unit"
            placeholder="Enter unit (e.g., kg, pcs, box)"
            error={errors.satuan?.message}
            {...register("satuan")}
            fullWidth
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onClose()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
