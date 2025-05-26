import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import apiService from "../../services/api";
import { Akun } from "../../types";

interface AkunModalProps {
  akun: Akun | null;
  isOpen: boolean;
  onClose: (refetchData?: boolean) => void;
}

// Define form validation schema
const akunSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["supplier", "customer"]),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
});

type AkunFormValues = z.infer<typeof akunSchema>;

const AkunModal: React.FC<AkunModalProps> = ({ akun, isOpen, onClose }) => {
  const isEditing = !!akun;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AkunFormValues>({
    resolver: zodResolver(akunSchema),
    defaultValues: isEditing
      ? {
          name: akun.name,
          type: akun.type,
          phone: akun.phone,
          email: akun.email,
          address: akun.address,
        }
      : {
          name: "",
          type: "customer",
          phone: "",
          email: "",
          address: "",
        },
  });

  const onSubmit = async (data: AkunFormValues) => {
    try {
      if (isEditing) {
        await apiService.updateAkun({
          id: akun.id,
          ...data,
        });
      } else {
        await apiService.createAkun(data);
      }
      reset();
      onClose(true); // Close modal and trigger refetch
    } catch (error) {
      console.error("Failed to save akun:", error);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Record" : "Add New Record"}
      isOpen={isOpen}
      onClose={() => onClose()}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            id="name"
            label="Name"
            placeholder="Enter name"
            error={errors.name?.message}
            {...register("name")}
            fullWidth
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Type
          </label>
          <Select
            id="type"
            error={errors.type?.message}
            {...register("type")}
            fullWidth
          >
            <option value="customer">Customer</option>
            <option value="supplier">Supplier</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              id="phone"
              label="Phone"
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
            placeholder="Enter address"
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
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AkunModal;
