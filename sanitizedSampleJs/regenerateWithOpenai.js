/* 
General Description:
- This code fetches a banana order's current details from our private app.
- It then uses the OpenAI API to regenerate a banana order title and description.
- The regenerated title and description are updated in the UI, ensuring our banana order details remain fresh and aligned with current market data.

Technical Description:
- Data is fetched from the fetchBananaOrder GraphQL query, which retrieves properties such as bananaName and bananaDescription.
- The script validates that a valid banana order ID and data exist before proceeding.
- It makes two separate API calls to OpenAI's GPT-4o model:
  1. The first call generates a new title based on the current banana name.
  2. The second call generates a three-paragraph description for the banana order.
- Additional standardized statements are appended to the generated description.
- Error handling is implemented to manage any issues during API calls or data processing.
*/

const openaiApiKey = "sample-key"; // Replace with your actual OpenAI API key

// Retrieve the ID, banana name, and banana description
const bananaOrderId = bananaOrderDemo.value;
const currentName = fetchBananaOrder.data?.bananaName?.[0] || "";
const currentDescription = fetchBananaOrder.data?.bananaDescription?.[0] || "";

// Check for a valid ID and fetched data
if (!bananaOrderId || currentName === "" || currentDescription === "") {
    console.error("No valid Banana Order ID selected or data is missing. Please select a valid order.");
    bananaOrderTitleDemo5.setValue("Error: No valid data");
    bananaOrderDescriptionDemo2.setValue("Error: No valid data");
    return;
}

// Show "Regenerating..." while processing
bananaOrderTitleDemo5.setValue("Regenerating...");
bananaOrderDescriptionDemo2.setValue("Regenerating...");

// First API call to generate the title
const titlePrompt = `Please generate a short, relevant title that conveys the banana order’s goal or focus area. The title should start with phrases like "Fresh Offer from...", "Bananas available at...", or "Premium banana order:". 
Current banana name: "${currentName}"`;

const titleResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: titlePrompt }]
    })
});

const titleData = await titleResponse.json();

// Check for errors in the title response
if (!titleResponse.ok) {
    console.error("OpenAI API error (Title):", titleData);
    bananaOrderTitleDemo5.setValue("Error generating title");
    bananaOrderDescriptionDemo2.setValue("Error generating description");
    return;
}

// Extract and clean the generated title
let newTitle = titleData.choices[0].message.content.trim().replace(/^"|"$/g, '');  // Remove leading/trailing double quotes
console.log("Generated Banana Title:", newTitle);

// Set the generated title in the UI
bananaOrderTitleDemo5.setValue(newTitle);

// Second API call to generate the description with the title context
const descriptionPrompt = `Please generate a three-paragraph description for a banana order. Avoid using any labels like "Title" or "Description" in the response. Each paragraph should be plain text without bullet points, hyphens, or list formatting.

Description:
- **Paragraph 1** (8-14 words): Start with "Fresh bananas available" or "Premium bananas on offer" and provide a brief statement about ${currentName.replace(/^(Fresh Offer from |Premium banana order: |Bananas available at )/i, '')}.
- **Paragraph 2** (30-60 words): Start with "The ideal wholeseller" and describe the quality, freshness, and value of the bananas, including any relevant distribution details.
- **Paragraph 3** (25-50 words): Start with "Our market objective" and provide a concise summary of the client's goal inferred from the banana order context.`;

const descriptionResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: descriptionPrompt }]
    })
});

const descriptionData = await descriptionResponse.json();

// Check for errors in the description response
if (!descriptionResponse.ok) {
    console.error("OpenAI API error (Description):", descriptionData);
    bananaOrderTitleDemo5.setValue("Error generating title");
    bananaOrderDescriptionDemo2.setValue("Error generating description");
    return;
}

// Process the generated description content
let newDescription = descriptionData.choices[0].message.content.trim();

// Append additional required statements to the description
newDescription += "\n\nThe initial order processing includes a 30-60-minute quality inspection, with potential for ongoing orders based on customer demand and wholeseller availability.\n\n" +
    "*Banana buyers are welcome to inquire.\n\n" +
    "**Wholesellers able to meet these standards are welcome (meeting all criteria is not required).\n\n" +
    "***This order should not be considered a conflict of interest as the pricing is based on publicly available market data.";

// Update the description field in the UI
bananaOrderDescriptionDemo2.setValue(newDescription);

// Log for debugging purposes
console.log("Generated Banana Description:", newDescription);