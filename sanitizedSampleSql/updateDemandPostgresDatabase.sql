-- General Description:
-- - This query updates an existing banana order record in our Postgres database.
-- - It sends updated information such as the banana order title (banana_name),
--   description (banana_description), and an optional cash register ID (cash_register_id)
--   to ensure our local database reflects the latest data from our system.
--
-- Technical Description:
-- - The query uses parameterized inputs for security and maintainability.
-- - It targets the "banana_orders" table and updates the record identified by a given bananaOrderId.
-- - The updated fields include banana_name, banana_description, and cash_register_id.
-- - The query returns the updated record's id, banana_name, banana_description, and cash_register_id for verification.

UPDATE banana_orders
SET 
    banana_name = {{ newBananaName }},          -- New banana order title
    banana_description = {{ newBananaDescription }},  -- New banana order description
    cash_register_id = {{ newCashRegisterId }}  -- (Optional) Updated cash register ID
WHERE id = {{ bananaOrderId }}  -- Banana order ID to identify the record
RETURNING id, banana_name, banana_description, cash_register_id;