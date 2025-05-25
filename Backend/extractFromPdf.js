import { DocumentProcessorServiceClient } from "@google-cloud/documentai";

const projectId = "hackathon-epa"; // Your string Project ID
const location = "eu"; // Your processor's region
const processorId = "6127742554e4dae8"; // Your processor ID

// CRITICAL FIX 1: Specify the regional endpoint for the client
const client = new DocumentProcessorServiceClient({
  apiEndpoint: `${location}-documentai.googleapis.com`, // e.g., 'eu-documentai.googleapis.com'
});

// This function is fine if you intend to extract text based on a TextAnchor object
function extractTextFromTextAnchor(docText, textAnchor) {
  if (!textAnchor?.textSegments || textAnchor.textSegments.length === 0) {
    return "";
  }
  // Assuming you only care about the first segment for a given anchor
  const segment = textAnchor.textSegments[0];
  // Ensure startIndex and endIndex are treated as numbers
  const startIndex = Number(segment.startIndex || 0);
  const endIndex = Number(segment.endIndex);
  return docText.substring(startIndex, endIndex);
}

export async function extractMedicalInfoFromPdfBuffer(buffer) {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  const bufferenc = buffer.toString("base64");
  // console.log("Base64 PDF content length:", bufferenc.length); // Good for a quick sanity check

  const request = {
    name,
    rawDocument: {
      content: bufferenc,
      mimeType: "application/pdf",
    },
  };

  try {
    const [result] = await client.processDocument(request);
    const { document } = result;

    if (!document || !document.text) {
      console.error("Document processing failed or returned no text.");
      return { error: "Document processing failed or returned no text." };
    }
    const { text } = document; // Full text of the document

    const info = {
      firstName: "",
      lastName: "",
      dob: "",
      medical_information: {
        diagnoses: [],
        allergies: [],
        medications: [],
      },
    };

    for (const entity of document.entities || []) {
      const type = entity.type?.split("/").pop(); // Gets the last part of the type string

      // CRITICAL FIX 2: Get the value correctly
      // entity.mentionText IS the extracted value for the entity.
      // entity.textAnchor tells you WHERE that mentionText was found in the document.text
      const value = entity.mentionText;

      // If you absolutely needed to re-extract from textAnchor (less common if mentionText is available):
      // const valueFromAnchor = extractTextFromTextAnchor(text, entity.textAnchor);

      if (!type || !value) {
        // If type or the direct value is missing, skip
        // console.warn(`Skipping entity with no type or value: ${JSON.stringify(entity)}`);
        continue;
      }

      switch (type) {
        case "FirstName": // Ensure these types match EXACTLY what your processor schema defines
          info.firstName = value;
          break;
        case "LastName":
          info.lastName = value;
          break;
        case "DateOfBirth":
          info.dob = value;
          break;
        case "Diagnoses": // If your schema uses 'Diagnosis' (singular), adjust here
          info.medical_information.diagnoses.push(value);
          break;
        case "Allergies": // If your schema uses 'Allergy' (singular), adjust here
          info.medical_information.allergies.push(value);
          break;
        case "Medications": // If your schema uses 'Medication' (singular), adjust here
          info.medical_information.medications.push(value);
          break;
        // Add more cases as needed for other entity types from your processor
        default:
          // console.log(`Unhandled entity type: ${type} with value: ${value}`);
          break;
      }
    }

    return info;
  } catch (error) {
    console.error(
      "❌ PDF Extraction Error in extractMedicalInfoFromPdfBuffer:",
      error
    );
    if (
      error.statusDetails &&
      error.statusDetails[0] &&
      error.statusDetails[0].fieldViolations
    ) {
      console.error(
        "Field Violations Details:",
        JSON.stringify(error.statusDetails[0].fieldViolations, null, 2)
      );
    }
    // Depending on how you want to handle errors, you might re-throw or return an error object
    throw error; // Or return { error: "Failed to process document", details: error.message, originalError: error };
  }
}
