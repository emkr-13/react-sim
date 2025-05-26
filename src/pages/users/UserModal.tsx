import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import apiService from "../../services/api";
import { User } from "../../types";

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: (refetchData?: boolean) => void;
}

// Define form validation schema for update
const updateUserSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
});

// Define form validation schema for create
const createUserSchema = z
  .object({
    fullname: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
type CreateUserFormValues = z.infer<typeof createUserSchema>;

const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose }) => {
  const isEditing = !!user;

  // For editing existing users
  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: updateErrors, isSubmitting: isUpdating },
    reset: resetUpdate,
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: isEditing
      ? {
          fullname: user.fullname,
        }
      : {
          fullname: "",
        },
  });

  // For creating new users
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: createErrors, isSubmitting: isCreating },
    reset: resetCreate,
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onUpdateSubmit = async (data: UpdateUserFormValues) => {
    try {
      await apiService.updateUserProfile(data);
      resetUpdate();
      onClose(true); // Close modal and trigger refetch
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const onCreateSubmit = async (data: CreateUserFormValues) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = data;
      await apiService.createUser(userData);
      resetCreate();
      onClose(true); // Close modal and trigger refetch
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit User" : "Add New User"}
      isOpen={isOpen}
      onClose={() => onClose()}
      size="md"
    >
      {isEditing ? (
        // Edit user form
        <form
          onSubmit={handleSubmitUpdate(onUpdateSubmit)}
          className="space-y-4"
        >
          <div>
            <Input
              id="fullname"
              label="Full Name"
              placeholder="Enter full name"
              error={updateErrors.fullname?.message}
              {...registerUpdate("fullname")}
              fullWidth
            />
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You can only update your name. Email changes are not supported.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onClose()}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isUpdating}>
              Update Profile
            </Button>
          </div>
        </form>
      ) : (
        // Create user form
        <form
          onSubmit={handleSubmitCreate(onCreateSubmit)}
          className="space-y-4"
        >
          <div>
            <Input
              id="fullname"
              label="Full Name"
              placeholder="Enter full name"
              error={createErrors.fullname?.message}
              {...registerCreate("fullname")}
              fullWidth
            />
          </div>

          <div>
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              error={createErrors.email?.message}
              {...registerCreate("email")}
              fullWidth
            />
          </div>

          <div>
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              error={createErrors.password?.message}
              {...registerCreate("password")}
              fullWidth
            />
          </div>

          <div>
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              error={createErrors.confirmPassword?.message}
              {...registerCreate("confirmPassword")}
              fullWidth
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onClose()}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Create User
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default UserModal;
