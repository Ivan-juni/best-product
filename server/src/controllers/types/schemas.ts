import * as yup from 'yup'

// comments
export const commentSchema = yup.object({
  commentText: yup.string().required(),
})

// categories
export const addCategorySchema = yup.object({
  categoryName: yup.string().required('Category name is required'),
  parent: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .required('Parent is required'),
})

export const updCategorySchema = yup.object({
  categoryName: yup.string().nullable(true),
  parent: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .nullable(true),
})

// users
export const editProfileSchema = yup.object({
  email: yup.string().email(),
  phone: yup.number().nullable(true),
  photo: yup.string().nullable(true),
  password: yup
    .string()
    .min(4, 'Password should be longer than 3 symbols')
    .max(30, 'Password should be shorter than 30 symbols')
    .matches(/^[a-zA-Z0-9-]+$/, 'Only English letters and numbers'),
  firstName: yup.string().max(255, 'Firstname should be shorter than 255 symbols'),
  lastName: yup.string().max(255, 'Lastname should be shorter than 255 symbols'),
})

// products
export const addProductSchema = yup.object({
  name: yup.string(),
  image: yup.string().required('Image is required').nullable(false),
  price: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .required('Price is required'),
  categoryId: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .required('Category id is required'),
  purpose: yup.string().required('Purpose is required'),
  description: yup
    .string()
    .min(10, 'Description should be larger than 10 symbols')
    .max(255, 'Description should be shorter than 255 symbols')
    .required('Description is required'),
  microphone: yup.string().default('false'),
  design: yup.string().nullable(true),
  connectionType: yup.string().nullable(true),
  batteryLiveTime: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .nullable(true),
  display: yup.string().nullable(true),
})

export const updateProductSchema = yup.object({
  name: yup.string().nullable(true),
  image: yup.string().nullable(true),
  price: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .nullable(true),
  categoryId: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .nullable(true),
  purpose: yup.string().nullable(true),
  description: yup
    .string()
    .min(10, 'Description should be larger than 10 symbols')
    .max(255, 'Description should be shorter than 255 symbols')
    .nullable(true),
  microphone: yup.string().nullable(true),
  design: yup.string().nullable(true),
  connectionType: yup.string().nullable(true),
  batteryLiveTime: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .nullable(true),
  display: yup.string().nullable(true),
})
