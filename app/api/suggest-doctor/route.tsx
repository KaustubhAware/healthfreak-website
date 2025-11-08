import { NextRequest, NextResponse } from "next/server";

// Fallback function for when API key is not available
function getFallbackSuggestions(notes: string) {
  const symptoms = notes.toLowerCase();
  const suggestions = [];

  // Simple keyword matching
  if (symptoms.includes('skin') || symptoms.includes('rash') || symptoms.includes('acne')) {
    suggestions.push({ specialist: "Dermatologist", reason: "Handles skin-related issues" });
  }
  
  if (symptoms.includes('heart') || symptoms.includes('chest') || symptoms.includes('blood pressure')) {
    suggestions.push({ specialist: "Cardiologist", reason: "Specializes in heart and cardiovascular health" });
  }
  
  if (symptoms.includes('child') || symptoms.includes('baby') || symptoms.includes('pediatric')) {
    suggestions.push({ specialist: "Pediatrician", reason: "Expert in children's health" });
  }
  
  if (symptoms.includes('mental') || symptoms.includes('anxiety') || symptoms.includes('depression') || symptoms.includes('stress')) {
    suggestions.push({ specialist: "Psychologist", reason: "Supports mental health and emotional well-being" });
  }
  
  if (symptoms.includes('ear') || symptoms.includes('nose') || symptoms.includes('throat') || symptoms.includes('sinus')) {
    suggestions.push({ specialist: "ENT Specialist", reason: "Handles ear, nose, and throat problems" });
  }
  
  if (symptoms.includes('bone') || symptoms.includes('joint') || symptoms.includes('muscle') || symptoms.includes('pain')) {
    suggestions.push({ specialist: "Orthopedic", reason: "Helps with bone, joint, and muscle issues" });
  }
  
  if (symptoms.includes('diet') || symptoms.includes('weight') || symptoms.includes('nutrition') || symptoms.includes('eating')) {
    suggestions.push({ specialist: "Nutritionist", reason: "Provides advice on healthy eating and nutrition" });
  }
  
  if (symptoms.includes('tooth') || symptoms.includes('dental') || symptoms.includes('gum') || symptoms.includes('mouth')) {
    suggestions.push({ specialist: "Dentist", reason: "Handles oral hygiene and dental problems" });
  }
  
  if (symptoms.includes('women') || symptoms.includes('reproductive') || symptoms.includes('hormonal') || symptoms.includes('gynec')) {
    suggestions.push({ specialist: "Gynecologist", reason: "Cares for women's reproductive health" });
  }

  // Always include General Physician as fallback
  if (suggestions.length === 0) {
    suggestions.push({ specialist: "General Physician", reason: "Can help with general health concerns" });
  }

  // Return top 3 suggestions
  return suggestions.slice(0, 3);
}

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();
    
    console.log("Received notes:", notes);
    
    // For now, always use fallback logic
    const fallbackSuggestions = getFallbackSuggestions(notes);
    console.log("Generated suggestions:", fallbackSuggestions);
    
    return NextResponse.json({ content: fallbackSuggestions });
  } catch (err) {
    console.error("Error in suggest-doctor:", err);
    return NextResponse.json(
      { 
        content: [], 
        error: "Failed to generate doctor suggestions",
        details: err instanceof Error ? err.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}