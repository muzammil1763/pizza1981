# Profile & Image Upload Features

## ✅ Implemented Features

### 1. User Profile Page (`/profile`)
- **Edit personal information**: Name, Phone, Address
- **Auto-fill on checkout**: User info automatically fills checkout form
- **View order history**: Quick link to past orders
- **Logout functionality**
- **Admin dashboard access** (for admin users)

### 2. Admin Profile Page (`/admin/profile`)
- **Dedicated admin profile page**
- **Edit admin information**: Name, Phone, Address
- **Admin badge indicator**
- **Integrated with admin layout**

### 3. Cloudinary Image Upload
- **Upload API endpoint**: `/api/upload`
- **Folder structure**: `pizza/items/` for menu items, `pizza/deals/` for deals
- **Automatic image optimization** via Cloudinary
- **Secure upload** with API keys from `.env`

### 4. Enhanced Menu Management
- **Image upload for menu items**
- **Live image preview** before saving
- **Upload progress indicator**
- **Grid layout** with item images
- **Category-based organization**

### 5. Profile API Endpoints
- **GET `/api/user/profile`**: Fetch user profile
- **PUT `/api/user/profile`**: Update user profile
- **Secure**: Requires user ID authentication

## 🔐 Environment Variables Used

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dd8arokjv"
CLOUDINARY_API_KEY="523898947122461"
CLOUDINARY_API_SECRET="JZ4OX3NVfFK_TO9OLjMppWOQXaI"
```

## 📁 Cloudinary Folder Structure

```
pizza/
├── items/          # Menu item images
└── deals/          # Deal images
```

## 🎯 User Flow

### For Regular Users:
1. Login → Profile page shows
2. Edit name, phone, address
3. Save changes
4. Go to checkout → Info auto-fills
5. Place order with saved info

### For Admin Users:
1. Login as admin
2. Access admin dashboard
3. Go to Menu Management
4. Add new item with image upload
5. Image uploads to Cloudinary `pizza/items/` folder
6. Item saved with Cloudinary URL

## 🚀 How to Use

### Update User Profile:
```typescript
// User navigates to /profile
// Edits information
// Clicks "Save Changes"
// Profile updates in database
// Context updates automatically
```

### Upload Menu Item Image:
```typescript
// Admin goes to /admin/menu
// Clicks "Add Item"
// Fills item details
// Clicks "Upload Image"
// Selects image file
// Image uploads to Cloudinary
// URL saved with menu item
```

### Auto-fill Checkout:
```typescript
// User logs in
// User info stored in context
// User goes to /checkout
// Name, phone, address auto-filled
// User can edit if needed
// Place order
```

## 📝 API Endpoints

### Profile Management
- `GET /api/user/profile?userId={id}` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Image Upload
- `POST /api/upload` - Upload image to Cloudinary
  - Body: FormData with `file` and `folder`
  - Returns: `{ url, publicId }`

### Menu Management
- `POST /api/admin/menu` - Create menu item (now accepts `image` field)

## 🎨 UI Features

### Profile Pages
- Clean, modern design
- Icon-based labels
- Success/error messages
- Disabled email field (cannot change)
- Required field validation
- Responsive layout

### Image Upload
- Drag-and-drop support
- Upload progress indicator
- Image preview
- Error handling
- File type validation

## 🔒 Security

- User ID required for profile updates
- Admin-only access for menu management
- Cloudinary API keys stored in `.env`
- Server-side image upload (secure)
- File type validation

## 📱 Responsive Design

- Mobile-friendly profile pages
- Touch-friendly upload buttons
- Responsive grid layouts
- Optimized for all screen sizes

## 🎉 Benefits

1. **Better UX**: Users don't re-enter info on every order
2. **Professional**: Real image uploads vs placeholder images
3. **Scalable**: Cloudinary handles image optimization
4. **Organized**: Folder structure keeps images organized
5. **Fast**: CDN delivery for images
6. **Secure**: Server-side uploads with API keys

## 🔄 Next Steps (Optional Enhancements)

- [ ] Add image upload for deals
- [ ] Add profile picture upload for users
- [ ] Add image cropping/editing
- [ ] Add bulk image upload
- [ ] Add image gallery for selection
- [ ] Add password change functionality
- [ ] Add email verification
