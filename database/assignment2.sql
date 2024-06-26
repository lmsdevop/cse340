-- Tony Stark CRUD
-- Query 1
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- Query 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Query 3
DELETE FROM public.account
WHERE account_id = 1;
-- Query 4: Change GM Hummer description
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- Query 5: INNER JOIN statement
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM inventory i
    INNER JOIN classification c ON c.classification_id = i.classification_id
WHERE c.classification_name = 'Sport';
-- Query 6: Change Path in all inventory records
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 's/', 's/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 's/', 's/vehicles/');