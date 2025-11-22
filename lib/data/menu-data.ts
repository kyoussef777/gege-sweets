export interface MenuItem {
  id: string;
  name: string;
  price?: number;
  categoryId: string;
  variants?: { name: string; price: number }[];
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  order: number;
}

let categories: Category[] = [
  { id: '1', name: 'DESSERT CUPS', order: 1 },
  { id: '2', name: 'CHOCOLATE TREATS', order: 2 },
  { id: '3', name: 'CHOCOLATE BARS & PIECES', order: 3 },
  { id: '4', name: 'EGYPTIAN COOKIES', order: 4 },
];

let menuItems: MenuItem[] = [
  // DESSERT CUPS
  { id: '1', name: 'Cold Kunafa with Cream Cup', price: 0, categoryId: '1' },
  { id: '2', name: 'Cold Kunafa with Cream & Nuts Cup', price: 0, categoryId: '1' },
  { id: '3', name: 'Coffee Tiramisu Cup', price: 0, categoryId: '1' },
  { id: '4', name: 'Pistachio Tiramisu Cup', price: 0, categoryId: '1' },
  { id: '5', name: 'Biscoff Tiramisu Cup', price: 0, categoryId: '1' },
  { id: '6', name: 'Rice Pudding Cup', price: 0, categoryId: '1' },
  { id: '7', name: 'Oreo Cheesecake Cup', price: 0, categoryId: '1' },
  { id: '8', name: 'Biscoff Cheesecake Cup', price: 0, categoryId: '1' },
  { id: '9', name: 'Dubai Chocolate Cheesecake Cup', price: 0, categoryId: '1' },
  { id: '10', name: '3-Layer Baklava Cup', price: 0, categoryId: '1' },
  { id: '11', name: 'Mango Pudding Cup', price: 0, categoryId: '1' },
  { id: '12', name: 'Flan Cup', price: 0, categoryId: '1' },

  // CHOCOLATE TREATS
  { id: '13', name: 'Chocolate Covered Pretzels', price: 0, categoryId: '2' },
  { id: '14', name: 'Chocolate Covered Strawberries', price: 0, categoryId: '2' },

  // CHOCOLATE BARS & PIECES
  {
    id: '15',
    name: 'Dubai Chocolate Bars',
    categoryId: '3',
    variants: [
      { name: 'Mini', price: 0 },
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Large', price: 0 }
    ]
  },
  {
    id: '16',
    name: 'Chocolate with Nuts',
    categoryId: '3',
    variants: [
      { name: 'Mini', price: 0 },
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 0 }
    ]
  },
  {
    id: '17',
    name: 'Chocolate with Biscoff Filling',
    categoryId: '3',
    variants: [
      { name: 'Mini', price: 0 },
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 0 }
    ]
  },
  {
    id: '18',
    name: 'Chocolate with Coconut Filling',
    categoryId: '3',
    variants: [
      { name: 'Mini', price: 0 },
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 0 }
    ]
  },

  // EGYPTIAN COOKIES
  { id: '19', name: 'Mixed Cookie Plate', price: 0, categoryId: '4' },
  { id: '20', name: 'Decorated Cookies', price: 0, categoryId: '4' },
  { id: '21', name: 'Kahk', price: 0, categoryId: '4' },
  { id: '22', name: 'Biscuits', price: 0, categoryId: '4' },
  { id: '23', name: 'Coffee Cookies', price: 0, categoryId: '4' },
  { id: '24', name: 'Ghorayba', price: 0, categoryId: '4' },
  { id: '25', name: 'Butter Cookies (Betefour)', price: 0, categoryId: '4' },
];

// Data access functions
export function getCategories(): Category[] {
  return categories.sort((a, b) => a.order - b.order);
}

export function getMenuItems(): MenuItem[] {
  return menuItems;
}

export function getMenuItemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter(item => item.categoryId === categoryId);
}

export function getMenuItem(id: string): MenuItem | undefined {
  return menuItems.find(item => item.id === id);
}

export function getCategory(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

// Admin functions
export function updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
  const index = menuItems.findIndex(item => item.id === id);
  if (index === -1) return null;

  menuItems[index] = { ...menuItems[index], ...updates };
  return menuItems[index];
}

export function createMenuItem(item: Omit<MenuItem, 'id'>): MenuItem {
  const newItem = {
    ...item,
    id: String(Date.now()),
  };
  menuItems.push(newItem);
  return newItem;
}

export function deleteMenuItem(id: string): boolean {
  const index = menuItems.findIndex(item => item.id === id);
  if (index === -1) return false;

  menuItems.splice(index, 1);
  return true;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const index = categories.findIndex(cat => cat.id === id);
  if (index === -1) return null;

  categories[index] = { ...categories[index], ...updates };
  return categories[index];
}

export function createCategory(category: Omit<Category, 'id'>): Category {
  const newCategory = {
    ...category,
    id: String(Date.now()),
  };
  categories.push(newCategory);
  return newCategory;
}

export function deleteCategory(id: string): boolean {
  const index = categories.findIndex(cat => cat.id === id);
  if (index === -1) return false;

  categories.splice(index, 1);
  return true;
}
