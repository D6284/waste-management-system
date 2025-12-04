import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePropertyDescription = async (
  features: string,
  type: string,
  bed: number,
  bath: number,
  location: string
): Promise<string> => {
  if (!apiKey) return "API Key missing. Please set environment variable.";
  
  try {
    const prompt = `Write a compelling, professional rental listing description for a ${type} located in ${location}. 
    It has ${bed} bedrooms and ${bath} bathrooms. 
    Key features include: ${features}. 
    Keep it under 150 words and use persuasive language suitable for a property listing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again.";
  }
};

export const analyzeMaintenanceRequest = async (
  title: string,
  description: string
): Promise<{ priority: string; analysis: string }> => {
  if (!apiKey) return { priority: 'MEDIUM', analysis: "API Key missing." };

  try {
    const prompt = `Analyze the following maintenance request from a tenant:
    Title: ${title}
    Description: ${description}

    Determine the priority level (LOW, MEDIUM, HIGH, or EMERGENCY) and provide a 1-sentence reasoning.
    Return the response in JSON format with keys "priority" and "analysis".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const json = JSON.parse(text);
    return {
      priority: json.priority || 'MEDIUM',
      analysis: json.analysis || 'Analysis unavailable.'
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { priority: 'MEDIUM', analysis: "AI analysis failed." };
  }
};
