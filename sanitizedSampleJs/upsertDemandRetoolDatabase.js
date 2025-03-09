/* 
General description: 
- The code fetches new banana orders from our system.
- Checks each order to see if it already exists in our database.
- Adds any new orders to the database or updates information for existing ones.
- This ensures our records are always up-to-date without manual data entry.

Technical description:
- Data is fetched from the listBananaOrdersAll GraphQL query.
- The response is parsed to extract essential banana order properties (such as id, bananaName, bananaDescription, and cashRegister).
- For each record, the insertRecord.trigger function is called to create or update the entry in the Retool database.
- Per-record error handling ensures that issues with one record do not halt the overall process.
*/

// Log initial script run
console.log("BananaOrderDemo script started");

// Access data from listBananaOrdersAll with the confirmed structure
const data = listBananaOrdersAll.data?.bananaOrders?.edges.map(edge => edge.node) || [];

// Log the number of records being processed
console.log(`Number of records fetched from 'listBananaOrdersAll': ${data.length}`);

// Verify if data is empty
if (data.length === 0) {
    console.warn("No records to process in 'listBananaOrdersAll'.");
    return;
}

for (const record of data) {
    try {
        // Check if record data is accessible
        if (!record) {
            console.warn("Record is undefined or empty:", record);
            continue; // Skip to the next record if data is missing
        }

        // Parse each property explicitly
        const parsedId = Number(record.id);  // Assuming `id` is a number
        const parsedName = record.bananaName || "";
        const parsedDescription = record.bananaDescription || "";
        const parsedCashRegisterId = record.cashRegister?.id || null;

        // Log each parsed property to verify before inserting
        console.log("Parsed Data:", {
            id: parsedId,
            bananaName: parsedName,
            bananaDescription: parsedDescription,
            cashRegisterId: parsedCashRegisterId,
        });

        // Check if each property is valid before insertion
        if (!parsedId) {
            console.error("Parsed ID is invalid:", parsedId);
            continue; // Skip this record if ID is invalid
        }

        // Trigger insert or update with each value explicitly passed in `additionalScope`
        const insertResult = await insertRecord.trigger({
            additionalScope: {
                parsedId: parsedId,
                parsedName: parsedName,
                parsedDescription: parsedDescription,
                parsedCashRegisterId: parsedCashRegisterId
            }
        });

        // Log the result of the insert or update action
        console.log(`Processed record with id ${parsedId}`, insertResult);

    } catch (error) {
        // Catch and log any errors per record
        console.error(`Error processing record with id: ${record.id}`, error);
    }
}

// Final log to confirm script completion
console.log("BananaOrderDemo processing complete.");