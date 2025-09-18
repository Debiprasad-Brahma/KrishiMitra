// utils/aiAPI.js
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

// Language instructions for different languages
const LANG_INSTRUCTIONS = {
  english: "You are a helpful farming assistant. Answer in English suitable for farmers. Provide practical, actionable advice.",
  malayalam: "നിങ്ങൾ ഒരു സഹായകരമായ കൃഷി സഹായിയാണ്. കർഷകർക്ക് അനുയോജ്യമായ മലയാളത്തിൽ ഉത്തരം നൽകുക. പ്രായോഗികവും പ്രവർത്തനക്ഷമവുമായ ഉപദേശം നൽകുക.",
  hindi: "आप एक सहायक कृषि सहायक हैं। किसानों के लिए उपयुक्त हिंदी में उत्तर दें। व्यावहारिक, कार्यान्वित करने योग्य सलाह दें।",
  tamil: "நீங்கள் ஒரு உதவிகரமான விவசாய உதவியாளர். விவசாயிகளுக்கு ஏற்ற தமிழில் பதில் அளிக்கவும். நடைமுறை, செயல்படுத்தக்கூடிய ஆலோசனையை வழங்கவும்.",
  odia: "ଆପଣ ଜଣେ ସହାୟକ କୃଷି ସହାୟକ। କୃଷକମାନଙ୍କ ପାଇଁ ଉପଯୁକ୍ତ ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ। ବ୍ୟବହାରିକ, କାର୍ଯ୍ୟକ୍ଷମ ପରାମର୍ଶ ପ୍ରଦାନ କରନ୍ତୁ।"
};

// Function to encode image to base64
const encodeImageToBase64 = (imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = getMimeType(imagePath);
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error('Error encoding image:', error);
    return null;
  }
};

// Function to get MIME type from file extension
const getMimeType = (imagePath) => {
  const extension = imagePath.split('.').pop().toLowerCase();
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif'
  };
  return mimeTypes[extension] || 'image/jpeg';
};

// Enhanced AI function with image support
export const askAI = async (prompt, language = "english", imagePaths = []) => {
  const instruction = LANG_INSTRUCTIONS[language] || LANG_INSTRUCTIONS["english"];
  
  try {
    const messages = [
      { role: "system", content: instruction }
    ];

    // Create user message
    const userMessage = { role: "user", content: [] };

    // Add text content
    if (prompt && prompt.trim()) {
      userMessage.content.push({
        type: "text",
        text: prompt
      });
    }

    // Add image content if images are provided
    if (imagePaths && imagePaths.length > 0) {
      for (const imagePath of imagePaths) {
        const base64Image = encodeImageToBase64(imagePath);
        if (base64Image) {
          userMessage.content.push({
            type: "image_url",
            image_url: {
              url: base64Image
            }
          });
        }
      }
    }

    // If no content was added, add default text
    if (userMessage.content.length === 0) {
      userMessage.content.push({
        type: "text",
        text: "Please provide farming advice."
      });
    }

    messages.push(userMessage);

    const response = await fetch(OPENROUTER_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using GPT-4O mini which supports vision
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error("No response from AI");
    }
  } catch (err) {
    console.error("AI API Error:", err);
    
    // Fallback responses based on language
    const fallbackResponses = {
      english: "I apologize, but I'm having trouble processing your request right now. Please try again later or contact your local agriculture officer for assistance.",
      malayalam: "ക്ഷമിക്കുക, നിലവിൽ നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ് ചെയ്യുന്നതിൽ എനിക്ക് പ്രശ്നമുണ്ട്. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ സഹായത്തിനായി നിങ്ങളുടെ പ്രാദേശിക കൃഷി ഓഫീസറെ ബന്ധപ്പെടുക.",
      hindi: "क्षमा करें, मुझे अभी आपके अनुरोध को संसाधित करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें या सहायता के लिए अपने स्थानीय कृषि अधिकारी से संपर्क करें।",
      tamil: "மன்னிக்கவும், தற்போது உங்கள் கோரிக்கையைச் செயலாக்குவதில் எனக்குச் சிக்கல் உள்ளது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும் அல்லது உதவிக்காக உங்கள் உள்ளூர் விவசாய அதிகாரியைத் தொடர்பு கொள்ளவும்.",
      odia: "କ୍ଷମା କରନ୍ତୁ, ବର୍ତ୍ତମାନ ଆପଣଙ୍କ ଅନୁରୋଧ ପ୍ରକ୍ରିୟାକରଣରେ ମୋର ସମସ୍ୟା ହେଉଛି। ଦୟାକରି ପରେ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ କିମ୍ବା ସହାୟତା ପାଇଁ ଆପଣଙ୍କର ସ୍ଥାନୀୟ କୃଷି ଅଧିକାରୀଙ୍କ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ।"
    };
    
    return fallbackResponses[language] || fallbackResponses["english"];
  }
};

// Function specifically for image analysis
export const analyzeImage = async (imagePaths, question = "", language = "english") => {
  const instruction = LANG_INSTRUCTIONS[language] || LANG_INSTRUCTIONS["english"];
  
  const defaultQuestions = {
    english: "Please analyze this farming-related image and provide detailed advice about what you see. Include information about crop health, pest identification, disease diagnosis, soil conditions, or any other relevant farming insights.",
    malayalam: "ഈ കൃഷിയുമായി ബന്ധപ്പെട്ട ചിത്രം വിശകലനം ചെയ്ത് നിങ്ങൾ കാണുന്നതിനെക്കുറിച്ച് വിശദമായ ഉപദേശം നൽകുക. വിള ആരോഗ്യം, കീട തിരിച്ചറിയൽ, രോഗനിർണയം, മണ്ണിന്റെ അവസ്ഥ, അല്ലെങ്കിൽ മറ്റേതെങ്കിലും പ്രസക്തമായ കൃഷി ഉൾക്കാഴ്ചകൾ എന്നിവ ഉൾപ്പെടുത്തുക.",
    hindi: "कृपया इस कृषि-संबंधी छवि का विश्लेषण करें और आप जो देखते हैं उसके बारे में विस्तृत सलाह प्रदान करें। फसल स्वास्थ्य, कीट पहचान, रोग निदान, मिट्टी की स्थिति, या कोई अन्य प्रासंगिक कृषि जानकारी शामिल करें।",
    tamil: "இந்த விவசாயம் தொடர்பான படத்தை பகுப்பாய்வு செய்து, நீங்கள் பார்ப்பதைப் பற்றி விரிவான ஆலோசனை வழங்கவும். பயிர் ஆரோக்யம், பூச்சி அடையாளம், நோய் கண்டறிதல், மண் நிலைமைகள் அல்லது வேறு ஏதேனும் தொடர்புடைய விவசாய நுண்ணறிவுகளை சேர்க்கவும்.",
    odia: "ଦୟାକରି ଏହି କୃଷି ସମ୍ବନ୍ଧୀୟ ଛବିକୁ ବିଶ୍ଳେଷଣ କରନ୍ତୁ ଏବଂ ଆପଣ ଯାହା ଦେଖୁଛନ୍ତି ସେ ବିଷୟରେ ବିସ୍ତୃତ ପରାମର୍ଶ ପ୍ରଦାନ କରନ୍ତୁ। ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ, କୀଟ ଚିହ୍ନଟ, ରୋଗ ନିର୍ଣ୍ଣୟ, ମାଟି ଅବସ୍ଥା, କିମ୍ବା ଅନ୍ୟ କୌଣସି ସମ୍ବନ୍ଧୀତ କୃଷି ଜ୍ଞାନ ଅନ୍ତର୍ଭୁକ୍ତ କରନ୍ତୁ।"
  };
  
  const finalQuestion = question.trim() || defaultQuestions[language] || defaultQuestions["english"];
  
  return askAI(finalQuestion, language, imagePaths);
};

// Function to validate image files on server
export const validateImageFiles = (files) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const maxFiles = 5;
  
  if (!files || files.length === 0) {
    throw new Error('No image files provided');
  }
  
  if (files.length > maxFiles) {
    throw new Error(`Maximum ${maxFiles} images allowed`);
  }
  
  for (const file of files) {
    if (!validTypes.includes(file.mimetype)) {
      throw new Error(`Invalid file type: ${file.originalname}. Only JPEG, PNG, and WebP are allowed.`);
    }
    
    if (file.size > maxSize) {
      throw new Error(`File too large: ${file.originalname}. Maximum size is 5MB.`);
    }
  }
  
  return true;
};

// Function to clean up uploaded files
export const cleanupFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  });
};

// Function to generate farming-specific prompts based on image content
export const generateContextualPrompt = (userQuestion, language = "english") => {
  const contextualPrompts = {
    english: {
      pest: "I can see some insects or pests in this image. Can you help identify them and suggest treatment?",
      disease: "This plant looks unhealthy. Can you diagnose the disease and recommend solutions?",
      crop: "Please identify this crop and provide growing tips and care instructions.",
      soil: "Can you analyze the soil condition in this image and suggest improvements?",
      general: "Please analyze this farming image and provide comprehensive advice."
    },
    malayalam: {
      pest: "ഈ ചിത്രത്തിൽ ചില പ്രാണികളോ കീടങ്ങളോ കാണാൻ കഴിയും. അവയെ തിരിച്ചറിയാനും ചികിത്സ നിർദ്ദേശിക്കാനും സഹായിക്കാമോ?",
      disease: "ഈ ചെടി അനാരോഗ്യകരമായി കാണപ്പെടുന്നു. രോഗം നിർണ്ണയിച്ച് പരിഹാരങ്ങൾ ശുപാർശ ചെയ്യാമോ?",
      crop: "ദയവായി ഈ വിള തിരിച്ചറിയുകയും വളർത്തൽ ടിപ്പുകളും പരിചരണ നിർദ്ദേശങ്ങളും നൽകുകയും ചെയ്യുക.",
      soil: "ഈ ചിത്രത്തിലെ മണ്ണിന്റെ അവസ്ഥ വിശകലനം ചെയ്ത് മെച്ചപ്പെടുത്തലുകൾ നിർദ്ദേശിക്കാമോ?",
      general: "ദയവായി ഈ കൃഷി ചിത്രം വിശകലനം ചെയ്ത് സമഗ്രമായ ഉപദേശം നൽകുക."
    }
  };
  
  return contextualPrompts[language] || contextualPrompts["english"];
};