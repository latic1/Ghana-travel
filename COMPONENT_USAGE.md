# Component Usage Guide

## Overview
This guide explains how to use the new reusable Header, Footer, and PageLayout components across all pages in the Ghana Tourism app.

## Components

### 1. Header Component (`components/Header.tsx`)
- **Purpose**: Provides consistent navigation across all pages
- **Features**:
  - Logo and site title with link to homepage
  - Navigation menu with links to main sections
  - User authentication status display
  - User profile dropdown menu when logged in
  - Sign in/Sign up buttons when not logged in

- **User Profile Dropdown** (when logged in):
  - Profile picture/avatar with fallback
  - User name and email display
  - Quick links to Profile, Bookings, Reviews, Admin Panel
  - Logout functionality

### 2. Footer Component (`components/Footer.tsx`)
- **Purpose**: Provides consistent footer across all pages
- **Features**:
  - Company branding and description
  - Quick links to main sections
  - Services information
  - Contact information
  - Copyright notice

### 3. PageLayout Component (`components/PageLayout.tsx`)
- **Purpose**: Wraps page content with Header and Footer
- **Props**:
  - `children`: The page content to render
  - `showFooter`: Boolean to control footer visibility (default: true)

## Usage Examples

### Basic Page with Header and Footer
```tsx
import PageLayout from "@/components/PageLayout"

export default function MyPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1>My Page Content</h1>
        <p>This page will automatically have the header and footer.</p>
      </div>
    </PageLayout>
  )
}
```

### Page without Footer
```tsx
import PageLayout from "@/components/PageLayout"

export default function MyPage() {
  return (
    <PageLayout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <h1>My Page Content</h1>
        <p>This page will have the header but no footer.</p>
      </div>
    </PageLayout>
  )
}
```

### Manual Header/Footer Usage (if needed)
```tsx
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function MyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-8">
          <h1>My Page Content</h1>
          <p>Custom layout with manual header/footer placement.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
```

## Implementation Status

### ✅ Completed
- Header component with user profile dropdown
- Footer component
- PageLayout wrapper component
- Homepage updated to use PageLayout
- Hotels page updated to use PageLayout

### 🔄 Next Steps
Update the following pages to use PageLayout:
- `/destinations` - Destinations listing page
- `/destinations/[id]` - Individual destination page
- `/hotels/[id]` - Individual hotel page
- `/maps` - Interactive map page
- `/bookings` - User bookings page
- `/reviews` - User reviews page
- `/profile` - User profile page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- Admin pages (if footer is not needed)

## Benefits

1. **Consistency**: All pages will have the same header and footer
2. **Maintainability**: Changes to header/footer only need to be made in one place
3. **User Experience**: Consistent navigation and branding across the site
4. **Code Reusability**: No need to duplicate header/footer code in each page
5. **Authentication Integration**: User status and profile management centralized

## Notes

- The Header component automatically handles authentication state using NextAuth
- The user profile dropdown includes logout functionality
- All navigation links use Next.js Link components for proper routing
- The components are responsive and work on mobile and desktop
- The PageLayout component ensures proper semantic HTML structure with `<main>` tag
