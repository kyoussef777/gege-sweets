# GeGe Sweets - Egyptian Desserts Website

A beautiful, Egyptian-themed website for GeGe Sweets with an easy-to-use admin CMS panel.

## 🌟 Features

- **Elegant Egyptian Design** - Gold accents, Egyptian patterns, and traditional styling
- **Responsive** - Works perfectly on all devices
- **Dynamic Menu** - Categorized menu with per-dozen pricing
- **Admin CMS** - Easy content management system
- **Variant Support** - Items with multiple sizes (Mini, Small, Medium, Large)
- **Simple Authentication** - Password-protected admin panel

## 🚀 Quick Start

The server is already running at **http://localhost:3000**

### Pages

- **Homepage**: http://localhost:3000
- **Menu**: http://localhost:3000/menu
- **Admin**: http://localhost:3000/admin

### Admin Access

- **URL**: http://localhost:3000/admin/login
- **Credentials**: Set via `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables in `.env` file

## 📋 Menu Structure

Your menu is pre-loaded with:

### DESSERT CUPS
- Cold Kunafa with Cream Cup
- Cold Kunafa with Cream & Nuts Cup
- Coffee Tiramisu Cup
- Pistachio Tiramisu Cup
- Biscoff Tiramisu Cup
- Rice Pudding Cup
- Oreo Cheesecake Cup
- Biscoff Cheesecake Cup
- Dubai Chocolate Cheesecake Cup
- 3-Layer Baklava Cup
- Mango Pudding Cup
- Flan Cup

### CHOCOLATE TREATS
- Chocolate Covered Pretzels
- Chocolate Covered Strawberries

### CHOCOLATE BARS & PIECES
- Dubai Chocolate Bars (Mini, Small, Medium, Large)
- Chocolate with Nuts (Mini, Small, Medium)
- Chocolate with Biscoff Filling (Mini, Small, Medium)
- Chocolate with Coconut Filling (Mini, Small, Medium)

### EGYPTIAN COOKIES
- Mixed Cookie Plate
- Decorated Cookies
- Kahk
- Biscuits
- Coffee Cookies
- Ghorayba
- Butter Cookies (Betefour)

## 🛠️ Admin Panel Guide

### Adding a New Item

1. Click "+ Add New Item"
2. Enter item name and select category
3. Add description (optional)
4. Either:
   - Enter a single price (per dozen), OR
   - Check "has variants" and add sizes with prices
5. Click "Create Item"

### Editing Items

1. Click "Edit" next to any item
2. Update the information
3. Click "Update Item"

### Deleting Items

1. Click "Delete" next to any item
2. Confirm deletion

### Filtering

Use the category dropdown to view items by category

## 🎨 Customization

### Change Admin Credentials

Edit your `.env` file:
```env
ADMIN_EMAIL="your-email@yourdomain.com"
ADMIN_PASSWORD="YourSecurePassword123!"
```

Then reseed the database:
```bash
npm run db:seed
```

### Change Colors

The Egyptian color palette is defined in [app/globals.css:3-8](app/globals.css#L3-L8):
```css
@theme inline {
  --color-egyptian-gold: #D4AF37;
  --color-egyptian-sand: #F4E8C1;
  --color-egyptian-terracotta: #C65D3B;
  --color-egyptian-deepblue: #003366;
  --color-egyptian-cream: #FFF8DC;
}
```

## 💻 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
gege-sweets/
├── app/
│   ├── admin/              # Admin CMS page
│   ├── api/                # API routes for data management
│   │   ├── menu/           # Menu CRUD operations
│   │   └── categories/     # Category CRUD operations
│   ├── menu/               # Public menu page
│   ├── globals.css         # Egyptian-themed styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   └── admin/
│       └── MenuItemForm.tsx # Form component for adding/editing items
├── lib/
│   └── data/
│       └── menu-data.ts    # Data storage and management functions
└── public/                 # Static assets
```

## 📝 Notes

- All prices are displayed as "per dozen"
- Data is stored in-memory (resets on server restart)
- For production, consider adding a database (MongoDB, PostgreSQL, etc.)

## 🔧 Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first CSS
- **React 19** - Latest React features

## 📄 License

ISC

---

**GeGe Sweets** - Made with ❤️ and traditional Egyptian recipes
