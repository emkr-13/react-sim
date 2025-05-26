import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import apiService from "../../services/api";
import { Store } from "../../types";

interface StoreModalProps {
  store: Store | null;
  isOpen: boolean;
  onClose: (refetchData?: boolean) => void;
}

// Define form validation schema
const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  manager: z.string().min(1, "Manager name is required"),
  contactInfo: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
});

type StoreFormValues = z.infer<typeof storeSchema>;

const StoreModal: React.FC<StoreModalProps> = ({ store, isOpen, onClose }) => {
  const isEditing = !!store;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: isEditing
      ? {
          name: store.name,
          location: store.location,
          description: store.description,
          manager: store.manager,
          contactInfo: store.contactInfo,
          phone: store.phone,
          email: store.email,
          address: store.address,
        }
      : {
          name: "",
          location: "",
          description: "",
          manager: "",
          contactInfo: "",
          phone: "",
          email: "",
          address: "",
        },
  });

  const onSubmit = async (data: StoreFormValues) => {
    try {
      if (isEditing) {
        await apiService.updateStore({
          id: store.id,
          ...data,
        });
      } else {
        await apiService.createStore(data);
      }
      reset();
      onClose(true); // Close modal and trigger refetch
    } catch (error) {
      console.error("Failed to save store:", error);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Store" : "Add New Store"}
      isOpen={isOpen}
      onClose={() => onClose()}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              id="name"
              label="Store Name"
              placeholder="Enter store name"
              error={errors.name?.message}
              {...register("name")}
              fullWidth
            />
          </div>
          <div>
            <Input
              id="location"
              label="Location"
              placeholder="Enter location"
              error={errors.location?.message}
              {...register("location")}
              fullWidth
            />
          </div>
        </div>

        <div>
          <Input
            id="description"
            label="Description"
            placeholder="Enter store description"
            error={errors.description?.message}
            {...register("description")}
            fullWidth
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              id="manager"
              label="Manager"
              placeholder="Enter manager name"
              error={errors.manager?.message}
              {...register("manager")}
              fullWidth
            />
          </div>
          <div>
            <Input
              id="contactInfo"
              label="Contact Information"
              placeholder="Enter additional contact info"
              error={errors.contactInfo?.message}
              {...register("contactInfo")}
              fullWidth
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              id="phone"
              label="Phone Number"
              placeholder="Enter phone number"
              error={errors.phone?.message}
              {...register("phone")}
              fullWidth
            />
          </div>
          <div>
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="Enter email address"
              error={errors.email?.message}
              {...register("email")}
              fullWidth
            />
          </div>
        </div>

        <div>
          <Input
            id="address"
            label="Address"
            placeholder="Enter complete address"
            error={errors.address?.message}
            {...register("address")}
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
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {isEditing ? "Update Store" : "Create Store"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StoreModal; 