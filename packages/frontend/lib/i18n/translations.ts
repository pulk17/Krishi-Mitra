export type Language = 'en' | 'hi'

export interface Translations {
  // Landing Page
  appName: string
  signInWithGoogle: string
  heroHeadline: string
  heroSubheadline: string
  heroDescription: string
  instantAnalysis: string
  expertSolutions: string
  
  // How It Works
  howItWorksTitle: string
  howItWorksDescription: string
  step1Title: string
  step1Description: string
  step2Title: string
  step2Description: string
  step3Title: string
  step3Description: string
  
  // Features
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
  
  // CTA
  ctaTitle: string
  ctaDescription: string
  ctaButton: string
  ctaDisclaimer: string
  
  // Dashboard
  welcomeMessage: string
  welcomeDescription: string
  welcomeInstructions: string
  totalDiagnoses: string
  healthyPlants: string
  issuesFound: string
  plantsAnalyzed: string
  noIssuesDetected: string
  diseasesDetected: string
  newDiagnosis: string
  recentDiagnoses: string
  healthy: string
  issueDetected: string
  noDiagnosesYet: string
  startAnalyzing: string
  
  // Diagnosis
  uploadImage: string
  analyzeImage: string
  analyzing: string
  diagnosisResults: string
  confidence: string
  description: string
  symptoms: string
  treatment: string
  prevention: string
  disclaimer: string
  disclaimerText: string
  startNewDiagnosis: string
  
  // Uploader Component
  multiUploadTitle: string
  multiUploadSubtitle: string
  selectedFiles: string
  clearAll: string

  // Language
  language: string
  english: string
  hindi: string
  
  // Authentication
  authNotAvailable: string
  signInFailed: string
  signingIn: string
  continueAsGuest: string
  
  // Common
  loading: string
  error: string
  retry: string
  cancel: string
  save: string
  delete: string
  edit: string
  close: string
}

export const translations: Record<Language, Translations> = {
  en: {
    // Landing Page
    appName: 'Krishi Mitra',
    signInWithGoogle: 'Sign In with Google',
    heroHeadline: 'Instant Plant Disease',
    heroSubheadline: 'Diagnosis in Your Pocket',
    heroDescription: 'Stop guessing. Use AI to get clear, actionable solutions to protect your crops and increase your yield.',
    instantAnalysis: 'Instant Analysis',
    expertSolutions: 'Expert Solutions',
    
    // How It Works
    howItWorksTitle: 'How It Works',
    howItWorksDescription: 'Get your diagnosis in three simple steps.',
    step1Title: '1. Snap a Photo',
    step1Description: 'Take a clear picture of the affected plant leaf.',
    step2Title: '2. Get Instant AI Analysis',
    step2Description: 'Our AI analyzes the image for diseases, pests, and deficiencies.',
    step3Title: '3. Receive a Treatment Plan',
    step3Description: 'Get simple, actionable steps to nurse your plant back to health.',
    
    // Features
    featuresTitle: 'Why Choose Krishi Mitra',
    featuresDescription: 'Advanced technology meets practical farming solutions to help you grow healthier crops',
    feature1Title: 'Advanced AI Diagnosis',
    feature1Description: 'Powered by cutting-edge AI to ensure high accuracy in identifying plant diseases, pests, and nutrient deficiencies.',
    feature2Title: 'Multi-Language Support',
    feature2Description: 'Get advice in English, Hindi, Spanish, and more. We speak your language to help your plants thrive.',
    feature3Title: 'Practical Solutions',
    feature3Description: 'We focus on organic and locally accessible treatments that are safe for you, your crops, and the environment.',
    feature4Title: 'Track Your History',
    feature4Description: 'Save every diagnosis to monitor your plant\'s health over time and build a comprehensive crop health record.',
    
    // CTA
    ctaTitle: 'Ready to Protect Your Crops?',
    ctaDescription: 'Join thousands of farmers who trust Krishi Mitra for accurate plant health diagnosis. Start your free analysis today and give your plants the care they deserve.',
    ctaButton: 'Start Free Diagnosis Now',
    ctaDisclaimer: 'No credit card required • Instant results • Trusted by farmers worldwide',
    
    // Dashboard
    welcomeMessage: 'Welcome',
    welcomeDescription: 'Ready to help your plants grow healthy',
    welcomeInstructions: 'Upload a photo of your plant to get instant AI diagnosis and treatment recommendations',
    totalDiagnoses: 'Total Diagnoses',
    healthyPlants: 'Healthy Plants',
    issuesFound: 'Issues Found',
    plantsAnalyzed: 'Plants analyzed',
    noIssuesDetected: 'No issues detected',
    diseasesDetected: 'Diseases detected',
    newDiagnosis: 'New Diagnosis',
    recentDiagnoses: 'Recent Diagnoses',
    healthy: 'Healthy',
    issueDetected: 'Issue Detected',
    noDiagnosesYet: 'Start by analyzing your first plant!',
    startAnalyzing: 'Start Analyzing',
    
    // Diagnosis
    uploadImage: 'Upload Image(s)',
    analyzeImage: 'Analyze Plant',
    analyzing: 'Analyzing...',
    diagnosisResults: 'Diagnosis Results',
    confidence: 'Confidence',
    description: 'Description',
    symptoms: 'Symptoms',
    treatment: 'Treatment',
    prevention: 'Prevention',
    disclaimer: 'Disclaimer',
    disclaimerText: 'This is AI-generated advice. For serious plant health issues, please consult a local agricultural expert or plant pathologist.',
    startNewDiagnosis: 'Start New Diagnosis',
    
    // Uploader Component
    multiUploadTitle: 'Drop images here or click to select',
    multiUploadSubtitle: 'Select up to {maxFiles} images at once',
    selectedFiles: 'Selected Files',
    clearAll: 'Clear All',

    // Language
    language: 'Language',
    english: 'English',
    hindi: 'हिंदी',
    
    // Authentication
    authNotAvailable: 'Authentication not available. Please check configuration.',
    signInFailed: 'Sign in failed. Please try again.',
    signingIn: 'Signing in...',
    continueAsGuest: 'Continue as Guest',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
  },
  hi: {
    // Landing Page
    appName: 'कृषि मित्र',
    signInWithGoogle: 'Google से साइन इन करें',
    heroHeadline: 'तुरंत पौधों की बीमारी का',
    heroSubheadline: 'निदान आपकी जेब में',
    heroDescription: 'अनुमान लगाना बंद करें। अपनी फसलों की सुरक्षा और उत्पादन बढ़ाने के लिए AI से स्पष्ट, व्यावहारिक समाधान प्राप्त करें।',
    instantAnalysis: 'तुरंत विश्लेषण',
    expertSolutions: 'विशेषज्ञ समाधान',
    
    // How It Works
    howItWorksTitle: 'यह कैसे काम करता है',
    howItWorksDescription: 'तीन सरल चरणों में अपना निदान प्राप्त करें।',
    step1Title: '1. फोटो लें',
    step1Description: 'प्रभावित पौधे की पत्ती की स्पष्ट तस्वीर लें।',
    step2Title: '2. तुरंत AI विश्लेषण प्राप्त करें',
    step2Description: 'हमारा AI बीमारियों, कीटों और कमियों के लिए छवि का विश्लेषण करता है।',
    step3Title: '3. उपचार योजना प्राप्त करें',
    step3Description: 'अपने पौधे को स्वस्थ बनाने के लिए सरल, व्यावहारिक कदम प्राप्त करें।',
    
    // Features
    featuresTitle: 'कृषि मित्र क्यों चुनें',
    featuresDescription: 'उन्नत तकनीक व्यावहारिक कृषि समाधानों से मिलकर आपको स्वस्थ फसल उगाने में मदद करती है',
    feature1Title: 'उन्नत AI निदान',
    feature1Description: 'पौधों की बीमारियों, कीटों और पोषक तत्वों की कमी की पहचान में उच्च सटीकता सुनिश्चित करने के लिए अत्याधुनिक AI द्वारा संचालित।',
    feature2Title: 'बहु-भाषा समर्थन',
    feature2Description: 'अंग्रेजी, हिंदी, स्पेनिश और अन्य भाषाओं में सलाह प्राप्त करें। हम आपकी भाषा बोलते हैं ताकि आपके पौधे फले-फूलें।',
    feature3Title: 'व्यावहारिक समाधान',
    feature3Description: 'हम जैविक और स्थानीय रूप से उपलब्ध उपचारों पर ध्यान देते हैं जो आपके, आपकी फसलों और पर्यावरण के लिए सुरक्षित हैं।',
    feature4Title: 'अपना इतिहास ट्रैक करें',
    feature4Description: 'समय के साथ अपने पौधे के स्वास्थ्य की निगरानी करने और एक व्यापक फसल स्वास्थ्य रिकॉर्ड बनाने के लिए हर निदान को सहेजें।',
    
    // CTA
    ctaTitle: 'अपनी फसलों की सुरक्षा के लिए तैयार हैं?',
    ctaDescription: 'हजारों किसानों के साथ जुड़ें जो सटीक पौधे स्वास्थ्य निदान के लिए कृषि मित्र पर भरोसा करते हैं। आज ही अपना मुफ्त विश्लेषण शुरू करें और अपने पौधों को वह देखभाल दें जिसके वे हकदार हैं।',
    ctaButton: 'अभी मुफ्त निदान शुरू करें',
    ctaDisclaimer: 'कोई क्रेडिट कार्ड आवश्यक नहीं • तुरंत परिणाम • दुनिया भर के किसानों द्वारा भरोसेमंद',
    
    // Dashboard
    welcomeMessage: 'स्वागत है',
    welcomeDescription: 'आपके पौधों को स्वस्थ बढ़ने में मदद करने के लिए तैयार',
    welcomeInstructions: 'तुरंत AI निदान और उपचार सिफारिशें प्राप्त करने के लिए अपने पौधे की फोटो अपलोड करें',
    totalDiagnoses: 'कुल निदान',
    healthyPlants: 'स्वस्थ पौधे',
    issuesFound: 'समस्याएं मिलीं',
    plantsAnalyzed: 'पौधों का विश्लेषण किया गया',
    noIssuesDetected: 'कोई समस्या नहीं मिली',
    diseasesDetected: 'बीमारियां मिलीं',
    newDiagnosis: 'नया निदान',
    recentDiagnoses: 'हाल के निदान',
    healthy: 'स्वस्थ',
    issueDetected: 'समस्या मिली',
    noDiagnosesYet: 'अपने पहले पौधे का विश्लेषण करके शुरुआत करें!',
    startAnalyzing: 'विश्लेषण शुरू करें',
    
    // Diagnosis
    uploadImage: 'छवि (यां) अपलोड करें',
    analyzeImage: 'पौधे का विश्लेषण करें',
    analyzing: 'विश्लेषण कर रहे हैं...',
    diagnosisResults: 'निदान परिणाम',
    confidence: 'विश्वास',
    description: 'विवरण',
    symptoms: 'लक्षण',
    treatment: 'उपचार',
    prevention: 'रोकथाम',
    disclaimer: 'अस्वीकरण',
    disclaimerText: 'यह AI-जनित सलाह है। गंभीर पौधे स्वास्थ्य समस्याओं के लिए, कृपया स्थानीय कृषि विशेषज्ञ या पौधे रोग विशेषज्ञ से सलाह लें।',
    startNewDiagnosis: 'नया निदान शुरू करें',

    // Uploader Component
    multiUploadTitle: 'छवियों को यहां खींचें या चुनने के लिए क्लिक करें',
    multiUploadSubtitle: 'एक बार में {maxFiles} छवियों तक का चयन करें',
    selectedFiles: 'चयनित फाइलें',
    clearAll: 'सभी साफ़ करें',
    
    // Language
    language: 'भाषा',
    english: 'English',
    hindi: 'हिंदी',
    
    // Authentication
    authNotAvailable: 'प्रमाणीकरण उपलब्ध नहीं है। कृपया कॉन्फ़िगरेशन जांचें।',
    signInFailed: 'साइन इन असफल। कृपया पुनः प्रयास करें।',
    signingIn: 'साइन इन हो रहे हैं...',
    continueAsGuest: 'अतिथि के रूप में जारी रखें',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    retry: 'पुनः प्रयास करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    close: 'बंद करें',
  },
}