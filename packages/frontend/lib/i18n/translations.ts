export type Language = 'en' | 'hi'

export interface Translations {
  // Landing Page & Common
  appName: string
  signInWithGoogle: string
  heroHeadline: string
  heroSubheadline: string
  heroDescription: string
  instantAnalysis: string
  expertSolutions: string
  howItWorksTitle: string
  howItWorksDescription: string
  step1Title: string
  step1Description: string
  step2Title: string
  step2Description: string
  step3Title: string
  step3Description: string
  featuresTitle: string
  featuresDescription: string
  feature1Title: string
  feature1Description: string
  feature2Title: string
  feature2Description: string
  feature3Title: string
  feature3Description: string
  feature4Title: string
  feature4Description: string
  ctaTitle: string
  ctaDescription: string
  ctaButton: string
  ctaDisclaimer: string
  authNotAvailable: string
  signInFailed: string
  signingIn: string
  continueAsGuest: string
  language: string
  english: string
  hindi: string
  
  // Dashboard
  welcomeMessage: string
  welcomeDescription: string
  welcomeInstructions: string; // <-- ADDED THIS LINE
  diseaseDiagnosis: string
  yieldPrediction: string
  recentDiagnoses: string
  clearAll: string
  areYouSureTitle: string
  areYouSureDescription: string
  cancel: string
  confirmDelete: string
  noHistoryTitle: string
  noHistoryDescription: string
  
  // Disease Diagnosis Flow
  uploadImage: string
  analyzeImage: string
  analyzing: string
  diagnosisResults: string
  confidence: string
  startNewDiagnosis: string
  
  // Uploader Component
  multiUploadTitle: string
  multiUploadSubtitle: string
  selectedFiles: string
  
  // Yield Predictor
  predictionResult: string
  tonsPerHectare: string
  startNewPrediction: string
  featureLabelTemperature: string
  featureInfoTemperature: string;
  featureLabelRainfall: string
  featureInfoRainfall: string;
  featureLabelHarvestDays: string
  featureInfoHarvestDays: string;
  featureLabelAgriInput: string
  featureInfoAgriInput: string;
  featureLabelTempStress: string
  featureInfoTempStress: string;
  featureLabelRainIntensity: string
  featureInfoRainIntensity: string;
  featureLabelGDD: string
  featureInfoGDD: string;
  featureLabelTempRainInteraction: string
  featureInfoTempRainInteraction: string;
  notSureButton: string
  predictYieldButton: string
  calculating: string
  aiEstimatorTitle: string
  aiEstimatorDescription: string
  fieldImagesLabel: string
  locationLabel: string
  locationPlaceholder: string
  getAIEstimatesButton: string
  estimating: string
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Krishi Mitra',
    signInWithGoogle: 'Sign In with Google',
    heroHeadline: 'Instant Plant Disease',
    heroSubheadline: 'Diagnosis in Your Pocket',
    heroDescription: 'Stop guessing. Use AI to get clear, actionable solutions to protect your crops and increase your yield.',
    instantAnalysis: 'Instant Analysis',
    expertSolutions: 'Expert Solutions',
    howItWorksTitle: 'How It Works',
    howItWorksDescription: 'Get your diagnosis in three simple steps.',
    step1Title: '1. Snap a Photo',
    step1Description: 'Take a clear picture of the affected plant leaf.',
    step2Title: '2. Get Instant AI Analysis',
    step2Description: 'Our AI analyzes the image for diseases, pests, and deficiencies.',
    step3Title: '3. Receive a Treatment Plan',
    step3Description: 'Get simple, actionable steps to nurse your plant back to health.',
    featuresTitle: 'Why Choose Krishi Mitra',
    featuresDescription: 'Advanced technology meets practical farming solutions to help you grow healthier crops',
    feature1Title: 'Advanced AI Diagnosis',
    feature1Description: 'Powered by cutting-edge AI to ensure high accuracy in identifying plant diseases, pests, and nutrient deficiencies.',
    feature2Title: 'Multi-Language Support',
    feature2Description: 'Get advice in English, Hindi, and more. We speak your language to help your plants thrive.',
    feature3Title: 'Practical Solutions',
    feature3Description: 'We focus on organic and locally accessible treatments that are safe for you, your crops, and the environment.',
    feature4Title: 'Track Your History',
    feature4Description: 'Save every diagnosis to monitor your plant\'s health over time and build a comprehensive crop health record.',
    ctaTitle: 'Ready to Protect Your Crops?',
    ctaDescription: 'Join thousands of farmers who trust Krishi Mitra for accurate plant health diagnosis. Start your free analysis today and give your plants the care they deserve.',
    ctaButton: 'Start Free Diagnosis Now',
    ctaDisclaimer: 'No credit card required • Instant results • Trusted by farmers worldwide',
    authNotAvailable: 'Authentication not available. Please check configuration.',
    signInFailed: 'Sign in failed. Please try again.',
    signingIn: 'Signing in...',
    continueAsGuest: 'Continue as Guest',
    language: 'Language',
    english: 'English',
    hindi: 'हिंदी',
    welcomeMessage: 'Welcome',
    welcomeDescription: 'Ready to help your plants grow healthy',
    welcomeInstructions: 'Select a tool below to get started.', // <-- ADDED THIS LINE
    diseaseDiagnosis: 'Disease Diagnosis',
    yieldPrediction: 'Yield Prediction',
    recentDiagnoses: 'Recent Diagnoses',
    clearAll: 'Clear All',
    areYouSureTitle: 'Are you absolutely sure?',
    areYouSureDescription: 'This action cannot be undone. This will permanently delete all your diagnosis records.',
    cancel: 'Cancel',
    confirmDelete: 'Yes, delete everything',
    noHistoryTitle: 'No History Found',
    noHistoryDescription: 'Diagnose a plant to see your history here.',
    uploadImage: 'Upload Image(s)',
    analyzeImage: 'Analyze Plant',
    analyzing: 'Analyzing...',
    diagnosisResults: 'Diagnosis Results',
    confidence: 'Confidence',
    startNewDiagnosis: 'Start New Diagnosis',
    multiUploadTitle: 'Drop images here or click to select',
    multiUploadSubtitle: 'Select up to {maxFiles} images at once',
    selectedFiles: 'Selected Files',
    predictionResult: 'Prediction Result',
    tonsPerHectare: 'tons per hectare',
    startNewPrediction: 'Start New Prediction',
    featureLabelTemperature: 'Temperature (°C)',
    featureInfoTemperature: "Average temperature during the growing season. This can be found on local weather websites or estimated.",
    featureLabelRainfall: 'Annual Rainfall (mm)',
    featureInfoRainfall: "Total rainfall over the year. Check your region's meteorological data for this value.",
    featureLabelHarvestDays: 'Days to Harvest',
    featureInfoHarvestDays: "The number of days from planting until the crop is expected to be mature for harvest.",
    featureLabelAgriInput: 'Agri Input Score',
    featureInfoAgriInput: "A score from 0 (low) to 1 (high) representing the quality of inputs like fertilizer and irrigation. 0.5 is average.",
    featureLabelTempStress: 'Temp Stress Index',
    featureInfoTempStress: "A score from 0 (high stress) to 1 (no stress) indicating if the plant is experiencing extreme heat or cold.",
    featureLabelRainIntensity: 'Rainfall Intensity',
    featureInfoRainIntensity: "Average rainfall per rainy day (mm/day). Calculated as Annual Rainfall / Number of Rainy Days.",
    featureLabelGDD: 'Growing Degree Days',
    featureInfoGDD: "A measure of heat accumulation, calculated based on daily temperatures. Often available from agricultural extension services.",
    featureLabelTempRainInteraction: 'Temp x Rainfall',
    featureInfoTempRainInteraction: "A complex interaction term. If unsure, start with a value around 20 or use the AI estimation.",
    notSureButton: 'Not Sure? Get AI Estimate for Inputs',
    predictYieldButton: 'Predict Crop Yield',
    calculating: 'Calculating...',
    aiEstimatorTitle: 'AI Input Estimator',
    aiEstimatorDescription: 'Upload images of your field and provide your location. Our AI will try to estimate some of the values for you.',
    fieldImagesLabel: 'Field Images (up to 5)',
    locationLabel: 'Your Location (e.g., "Bhubaneswar, Odisha, India")',
    locationPlaceholder: 'City, State, Country',
    getAIEstimatesButton: 'Get AI Estimates',
    estimating: 'Estimating...',
  },
  hi: {
    appName: 'कृषि मित्र',
    signInWithGoogle: 'Google से साइन इन करें',
    heroHeadline: 'तुरंत पौधों की बीमारी का',
    heroSubheadline: 'निदान आपकी जेब में',
    heroDescription: 'अनुमान लगाना बंद करें। अपनी फसलों की सुरक्षा और उत्पादन बढ़ाने के लिए AI से स्पष्ट, व्यावहारिक समाधान प्राप्त करें।',
    instantAnalysis: 'तुरंत विश्लेषण',
    expertSolutions: 'विशेषज्ञ समाधान',
    howItWorksTitle: 'यह कैसे काम करता है',
    howItWorksDescription: 'तीन सरल चरणों में अपना निदान प्राप्त करें।',
    step1Title: '१. फोटो लें',
    step1Description: 'प्रभावित पौधे की पत्ती की स्पष्ट तस्वीर लें।',
    step2Title: '२. तुरंत AI विश्लेषण प्राप्त करें',
    step2Description: 'हमारा AI बीमारियों, कीटों और कमियों के लिए छवि का विश्लेषण करता है।',
    step3Title: '३. उपचार योजना प्राप्त करें',
    step3Description: 'अपने पौधे को स्वस्थ बनाने के लिए सरल, व्यावहारिक कदम प्राप्त करें।',
    featuresTitle: 'कृषि मित्र क्यों चुनें',
    featuresDescription: 'उन्नत तकनीक व्यावहारिक कृषि समाधानों से मिलकर आपको स्वस्थ फसल उगाने में मदद करती है',
    feature1Title: 'उन्नत AI निदान',
    feature1Description: 'पौधों की बीमारियों, कीटों और पोषक तत्वों की कमी की पहचान में उच्च सटीकता सुनिश्चित करने के लिए अत्याधुनिक AI द्वारा संचालित।',
    feature2Title: 'बहु-भाषा समर्थन',
    feature2Description: 'अंग्रेजी, हिंदी, और अन्य भाषाओं में सलाह प्राप्त करें। हम आपकी भाषा बोलते हैं ताकि आपके पौधे फले-फूलें।',
    feature3Title: 'व्यावहारिक समाधान',
    feature3Description: 'हम जैविक और स्थानीय रूप से उपलब्ध उपचारों पर ध्यान देते हैं जो आपके, आपकी फसलों और पर्यावरण के लिए सुरक्षित हैं।',
    feature4Title: 'अपना इतिहास ट्रैक करें',
    feature4Description: 'समय के साथ अपने पौधे के स्वास्थ्य की निगरानी करने और एक व्यापक फसल स्वास्थ्य रिकॉर्ड बनाने के लिए हर निदान को सहेजें।',
    ctaTitle: 'अपनी फसलों की सुरक्षा के लिए तैयार हैं?',
    ctaDescription: 'हजारों किसानों के साथ जुड़ें जो सटीक पौधे स्वास्थ्य निदान के लिए कृषि मित्र पर भरोसा करते हैं। आज ही अपना मुफ्त विश्लेषण शुरू करें और अपने पौधों को वह देखभाल दें जिसके वे हकदार हैं।',
    ctaButton: 'अभी मुफ्त निदान शुरू करें',
    ctaDisclaimer: 'कोई क्रेडिट कार्ड आवश्यक नहीं • तुरंत परिणाम • दुनिया भर के किसानों द्वारा भरोसेमंद',
    authNotAvailable: 'प्रमाणीकरण उपलब्ध नहीं है। कृपया कॉन्फ़िगरेशन जांचें।',
    signInFailed: 'साइन इन असफल। कृपया पुनः प्रयास करें।',
    signingIn: 'साइन इन हो रहे हैं...',
    continueAsGuest: 'अतिथि के रूप में जारी रखें',
    language: 'भाषा',
    english: 'English',
    hindi: 'हिंदी',
    welcomeMessage: 'स्वागत है',
    welcomeDescription: 'आपके पौधों को स्वस्थ बढ़ने में मदद करने के लिए तैयार',
    welcomeInstructions: 'शुरू करने के लिए नीचे एक उपकरण चुनें।', // <-- ADDED THIS LINE
    diseaseDiagnosis: 'रोग निदान',
    yieldPrediction: 'उपज भविष्यवाणी',
    recentDiagnoses: 'हाल के निदान',
    clearAll: 'सभी साफ़ करें',
    areYouSureTitle: 'क्या आप निश्चित हैं?',
    areYouSureDescription: 'यह कार्रवाई पूर्ववत नहीं की जा सकती। यह आपके सभी निदान रिकॉर्ड स्थायी रूप से हटा देगा।',
    cancel: 'रद्द करें',
    confirmDelete: 'हाँ, सब कुछ हटा दें',
    noHistoryTitle: 'कोई इतिहास नहीं मिला',
    noHistoryDescription: 'अपना इतिहास यहाँ देखने के लिए एक पौधे का निदान करें।',
    uploadImage: 'छवि (यां) अपलोड करें',
    analyzeImage: 'पौधे का विश्लेषण करें',
    analyzing: 'विश्लेषण कर रहे हैं...',
    diagnosisResults: 'निदान परिणाम',
    confidence: 'आत्मविश्वास',
    startNewDiagnosis: 'नया निदान शुरू करें',
    multiUploadTitle: 'छवियों को यहां खींचें या चुनने के लिए क्लिक करें',
    multiUploadSubtitle: 'एक बार में {maxFiles} छवियों तक का चयन करें',
    selectedFiles: 'चयनित फाइलें',
    predictionResult: 'भविष्यवाणी परिणाम',
    tonsPerHectare: 'टन प्रति हेक्टेयर',
    startNewPrediction: 'नई भविष्यवाणी शुरू करें',
    featureLabelTemperature: 'तापमान (°C)',
    featureInfoTemperature: "बढ़ते मौसम के दौरान औसत तापमान। यह स्थानीय मौसम वेबसाइटों पर पाया जा सकता है या अनुमान लगाया जा सकता है।",
    featureLabelRainfall: 'वार्षिक वर्षा (मिमी)',
    featureInfoRainfall: "पूरे वर्ष में कुल वर्षा। इस मान के लिए अपने क्षेत्र के मौसम संबंधी डेटा की जाँच करें।",
    featureLabelHarvestDays: 'कटाई के दिन',
    featureInfoHarvestDays: "रोपण से लेकर फसल की कटाई के लिए परिपक्व होने तक के दिनों की संख्या।",
    featureLabelAgriInput: 'कृषि इनपुट स्कोर',
    featureInfoAgriInput: "उर्वरक और सिंचाई जैसे इनपुट की गुणवत्ता का प्रतिनिधित्व करने वाला 0 (कम) से 1 (उच्च) तक का स्कोर। 0.5 औसत है।",
    featureLabelTempStress: 'तापमान तनाव सूचकांक',
    featureInfoTempStress: "0 (उच्च तनाव) से 1 (कोई तनाव नहीं) तक का स्कोर यह दर्शाता है कि पौधे अत्यधिक गर्मी या ठंड का सामना कर रहे हैं या नहीं।",
    featureLabelRainIntensity: 'वर्षा की तीव्रता',
    featureInfoRainIntensity: "प्रति बरसात दिन औसत वर्षा (मिमी/दिन)। वार्षिक वर्षा / बरसात के दिनों की संख्या के रूप में गणना की जाती है।",
    featureLabelGDD: 'बढ़ते डिग्री दिन',
    featureInfoGDD: "गर्मी संचय का एक माप, जिसकी गणना दैनिक तापमान के आधार पर की जाती है। अक्सर कृषि विस्तार सेवाओं से उपलब्ध होता है।",
    featureLabelTempRainInteraction: 'तापमान x वर्षा',
    featureInfoTempRainInteraction: "एक जटिल इंटरैक्शन टर्म। यदि अनिश्चित हैं, तो लगभग 20 के मान से शुरू करें या AI अनुमान का उपयोग करें।",
    notSureButton: 'निश्चित नहीं? AI से अनुमान प्राप्त करें',
    predictYieldButton: 'फसल उपज की भविष्यवाणी करें',
    calculating: 'गणना हो रही है...',
    aiEstimatorTitle: 'AI इनपुट अनुमानक',
    aiEstimatorDescription: 'अपने खेत की तस्वीरें अपलोड करें और अपना स्थान प्रदान करें। हमारा AI आपके लिए कुछ मानों का अनुमान लगाने का प्रयास करेगा।',
    fieldImagesLabel: 'खेत की तस्वीरें (5 तक)',
    locationLabel: 'आपका स्थान (जैसे, "भुवनेश्वर, ओडिशा, भारत")',
    locationPlaceholder: 'शहर, राज्य, देश',
    getAIEstimatesButton: 'AI अनुमान प्राप्त करें',
    estimating: 'अनुमान लगाया जा रहा है...',
  },
}