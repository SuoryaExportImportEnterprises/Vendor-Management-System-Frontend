// Service for managing form field options in localStorage

export interface FormFieldOption {
  id: string;
  fieldName: string;
  optionValue: string;
  isDeleted: boolean;
  sortIndex: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'formFieldOptions';

// Initialize default product categories
const DEFAULT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Health & Beauty',
  'Automotive',
  'Office Supplies'
];

const initializeDefaultOptions = (): FormFieldOption[] => {
  return DEFAULT_CATEGORIES.map((category, index) => ({
    id: `default-${index}`,
    fieldName: 'productCategory',
    optionValue: category,
    isDeleted: false,
    sortIndex: index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

export const getFormFieldOptions = (fieldName: string): FormFieldOption[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let options: FormFieldOption[] = [];

  if (!stored) {
    // Initialize with defaults
    options = initializeDefaultOptions();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  } else {
    options = JSON.parse(stored);
  }

  // Return only non-deleted options for the specified field, sorted by sortIndex
  return options
    .filter(opt => opt.fieldName === fieldName && !opt.isDeleted)
    .sort((a, b) => a.sortIndex - b.sortIndex);
};

export const addFormFieldOption = (fieldName: string, optionValue: string): FormFieldOption => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const options: FormFieldOption[] = stored ? JSON.parse(stored) : initializeDefaultOptions();

  // Check for duplicate (case-insensitive)
  const duplicate = options.find(
    opt => opt.fieldName === fieldName && 
    opt.optionValue.toLowerCase() === optionValue.toLowerCase() && 
    !opt.isDeleted
  );

  if (duplicate) {
    throw new Error('This option already exists');
  }

  // Get next sort index
  const maxSortIndex = Math.max(
    ...options.filter(opt => opt.fieldName === fieldName).map(opt => opt.sortIndex),
    -1
  );

  const newOption: FormFieldOption = {
    id: `${fieldName}-${Date.now()}`,
    fieldName,
    optionValue,
    isDeleted: false,
    sortIndex: maxSortIndex + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  options.push(newOption);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(options));

  return newOption;
};

export const updateFormFieldOption = (id: string, optionValue: string): FormFieldOption => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) throw new Error('No options found');

  const options: FormFieldOption[] = JSON.parse(stored);
  const optionIndex = options.findIndex(opt => opt.id === id);

  if (optionIndex === -1) throw new Error('Option not found');

  // Check for duplicate (case-insensitive) excluding current option
  const duplicate = options.find(
    opt => opt.id !== id && 
    opt.fieldName === options[optionIndex].fieldName && 
    opt.optionValue.toLowerCase() === optionValue.toLowerCase() && 
    !opt.isDeleted
  );

  if (duplicate) {
    throw new Error('This option already exists');
  }

  options[optionIndex].optionValue = optionValue;
  options[optionIndex].updatedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(options));

  return options[optionIndex];
};

export const deleteFormFieldOption = (id: string): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) throw new Error('No options found');

  const options: FormFieldOption[] = JSON.parse(stored);
  const optionIndex = options.findIndex(opt => opt.id === id);

  if (optionIndex === -1) throw new Error('Option not found');

  // Soft delete
  options[optionIndex].isDeleted = true;
  options[optionIndex].updatedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
};
