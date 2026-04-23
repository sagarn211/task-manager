import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).default('user'),
});

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
  category: z.enum(['Work', 'Personal', 'Shopping', 'Health', 'Other']).default('Work'),
});


export const validateData = (schema, data) => {
  const result = schema.safeParse(data);
  return result;
};

export const getValidationErrors = (zodError) => {
  const errors = {};
  if (zodError.errors) {
    zodError.errors.forEach((error) => {
      const field = error.path[0];
      errors[field] = error.message;
    });
  }
  return errors;
};
