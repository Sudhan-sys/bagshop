# How to Import Demo Products

To add these 6 premium demo bags to your shop, follow these simple steps:

1.  **Open Supabase SQL Editor**
    - Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/_/sql).
    - Click on **SQL Editor** in the left sidebar.
    - Click **+ New Query**.

2.  **Copy & Paste SQL**
    - Open the file `seed-data.sql` in your VS Code.
    - Copy the entire content of the file.
    - Paste it into the Supabase query editor.

3.  **Run the Query**
    - Click the **Run** button (bottom right of the editor).
    - You should see "Success. No key returned."

4.  **Verify**
    - Go back to your website (Refresh the page).
    - Visit the **Shop** page.
    - You should now see the new bags listed with images! 🎒

## Troubleshooting

- If you see errors about "relation products does not exist", make sure you have run the schema setup first (`ecommerce-schema.sql`).
- If your product images don't load, check your internet connection (the images are hosted on Unsplash).
