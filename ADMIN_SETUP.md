# Admin Setup Instructions

## Step 1: Create Admin User in Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Users"
3. Click "Add user" 
4. Enter an email and password for your admin account
5. Make sure "Email confirmed" is checked
6. Click "Create user"

## Step 2: Access Admin Page

1. Go to `/admin` on your website
2. Sign in with the credentials you just created
3. You'll now have access to the admin panel

## Step 3: Add Your First Items

Once logged in to the admin panel:
1. Click "Add Item" button
2. Fill in the item details
3. Save the item
4. It will immediately appear on the main site

## Alternative: Quick Database Setup

If you want to populate the database quickly with sample data, you can run this SQL in your Supabase SQL editor:

```sql
INSERT INTO items (id, name, value, demand, rate_of_change, prestige, status, obtained_from, category, emoji) VALUES
('item_1', 'Titan Serum', 1000, 8, 'Rising', 5, 'Limited', 'Special Events', 'Consumables', '💉'),
('item_2', 'ODM Gear', 500, 6, 'Stable', 3, 'Obtainable', 'Shop', 'Equipment', '⚙️'),
('item_3', 'Survey Corps Cape', 750, 7, 'Rising', 4, 'Obtainable', 'Missions', 'Clothing', '🧥'),
('item_4', 'Thunder Spear', 1200, 9, 'Overpriced', 6, 'Limited', 'Rare Drops', 'Weapons', '⚡'),
('item_5', 'Founding Titan Power', 5000, 10, 'Stable', 10, 'Unobtainable', 'Legacy Item', 'Powers', '👑');
```

This will give you some sample items to work with immediately.