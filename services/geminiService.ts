import { GoogleGenAI, Type } from "@google/genai";
import { CrosshairConfig } from "../types";

// Helper to remove the data URL prefix for the API
const stripBase64Header = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const PROMPT = `
Analyze this Counter-Strike 2 gameplay screenshot and extract the crosshair settings. 
Look closely at the center of the screen. Estimate the numerical values for the crosshair configuration.
Return a JSON object matching the schema.
For colors, estimate the RGB values (0-255).
For boolean values like outline and dot, return true or false.
For 'cl_crosshairstyle', usually 4 is static, 5 is dynamic (spreads when shooting/moving). If you can't tell, default to 4.
For 'cl_crosshair_t', return true if it is a T-shaped crosshair (no top line), otherwise false.
`;

export const analyzeCrosshairImage = async (base64Image: string): Promise<CrosshairConfig> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const cleanBase64 = stripBase64Header(base64Image);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG or JPEG, API is flexible usually
              data: cleanBase64
            }
          },
          {
            text: PROMPT
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cl_crosshairsize: { type: Type.NUMBER, description: "Length of the crosshair lines. Usually 0.5 to 10." },
            cl_crosshairthickness: { type: Type.NUMBER, description: "Width of the crosshair lines. Usually 0.1 to 6." },
            cl_crosshairgap: { type: Type.NUMBER, description: "Gap between the lines. Can be negative (e.g. -3) or positive." },
            cl_crosshair_drawoutline: { type: Type.BOOLEAN, description: "True if there is a black outline around the crosshair." },
            cl_crosshair_outlinethickness: { type: Type.NUMBER, description: "Thickness of the outline, usually 0 or 1." },
            cl_crosshairdot: { type: Type.BOOLEAN, description: "True if there is a dot in the very center." },
            cl_crosshaircolor_r: { type: Type.INTEGER, description: "Red color component 0-255." },
            cl_crosshaircolor_g: { type: Type.INTEGER, description: "Green color component 0-255." },
            cl_crosshaircolor_b: { type: Type.INTEGER, description: "Blue color component 0-255." },
            cl_crosshairalpha: { type: Type.INTEGER, description: "Opacity 0-255. 255 is fully opaque." },
            cl_crosshairstyle: { type: Type.INTEGER, description: "Style 4 (static) or 5 (dynamic)." },
            cl_crosshair_t: { type: Type.BOOLEAN, description: "True if it is a T-crosshair." }
          },
          required: [
            "cl_crosshairsize", "cl_crosshairthickness", "cl_crosshairgap", 
            "cl_crosshair_drawoutline", "cl_crosshairdot", 
            "cl_crosshaircolor_r", "cl_crosshaircolor_g", "cl_crosshaircolor_b",
            "cl_crosshairalpha", "cl_crosshairstyle"
          ]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as CrosshairConfig;
      return data;
    } else {
      throw new Error("No data returned from Gemini.");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
