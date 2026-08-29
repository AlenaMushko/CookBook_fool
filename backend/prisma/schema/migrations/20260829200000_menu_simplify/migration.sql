-- Drop personal-menu extras (menus are always private to the user)
ALTER TABLE "menus" DROP COLUMN IF EXISTS "eventDate";
ALTER TABLE "menus" DROP COLUMN IF EXISTS "isPublic";

-- Drop per-item extras not needed for v1
ALTER TABLE "menu-items" DROP COLUMN IF EXISTS "servings";
ALTER TABLE "menu-items" DROP COLUMN IF EXISTS "note";
