# Fix: Cart Button (WARENKORB) Not Opening Cart in Mobile App

## Problem
User reported that clicking the "WARENKORB" button in the bottom navigation bar of the mobile app did not open the cart sidebar.

## Root Cause
The `js/mobile-cart-fix.js` script was designed to intercept cart button clicks in the mobile app and ensure they open the cart sidebar instead of navigating to a new page. However, this script was:

1. **Only loaded in `index.html`** - not in `menu.html` where users browse the menu
2. The cart button (`#fixedOrderBtn`) exists on both pages, but the fix was only active on the home page

## Solution

### 1. Enhanced `js/mobile-cart-fix.js` (Commit: 6ed2768)
- Added more comprehensive selectors to catch ALL cart-related elements:
  - `#fixedOrderBtn` (the main WARENKORB button)
  - `#cartToggle` (header cart button)
  - `[aria-label*="Warenkorb"]` (any element with Warenkorb in aria-label)
  - Links with `href` containing "cart" or "warenkorb"
  - Elements with `onclick` containing "cart"
- Added multiple retry attempts (1s, 2s, 3s) to catch dynamically added elements
- Added `stopImmediatePropagation()` to prevent other handlers from interfering
- Added fallback to manually open cart sidebar with inline styles if functions not found

### 2. Added Script to `menu.html` (Commit: 5bc7ff2)
- Added `<script src="js/mobile-cart-fix.js"></script>` to `menu.html` after `js/cart.js`
- This ensures the cart button fix is active on the menu page where users actually browse and add items

### 3. Synced to Production
- Copied changes to `www/menu.html` and `www/js/mobile-cart-fix.js`
- Ready for deployment

## Testing
To test the fix:
1. Build a new iOS app with the updated code
2. Open the app and navigate to the menu page
3. Click the "WARENKORB" button in the bottom navigation
4. The cart sidebar should slide in from the right
5. Cart should show items and allow checkout

## Files Changed
- `js/mobile-cart-fix.js` - Enhanced cart button handler
- `menu.html` - Added mobile-cart-fix.js script
- `www/js/mobile-cart-fix.js` - Synced to production
- `www/menu.html` - Synced to production

## Next Steps
1. Build new iOS app to test the fix
2. If still not working, may need to inspect actual HTML structure in the built app to verify button exists and has correct selectors
