// logger.ts
import adze from "adze";

// Create a child logger where all logs generated include the "example" namespace and emoji styles.
export const logger = adze.withEmoji.namespace("Embeddit").seal();
