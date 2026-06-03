import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    navHome: 'Home',
    navReport: 'Report Incident',
    navTrack: 'Track Case',
    navNews: 'News & Campaigns',
    navSafety: 'Safety Tips',
    navResources: 'Help Center',
    navDonate: 'Donate',
    navStories: 'Stories',
    navDashboard: 'Dashboard',
    navAdmin: 'Admin',
    staffLogin: 'Staff Login',
    signOut: 'Sign Out',
    
    // Common
    loading: 'Loading...',
    search: 'Search...',
    category: 'Category',
    all: 'All',
    submit: 'Submit',
    cancel: 'Cancel',
    back: 'Back',
    delete: 'Delete',
    refresh: 'Refresh',
    success: 'Success',
    error: 'Error',
    
    // Landing Page
    heroSubtitle: 'Safe · Anonymous · Confidential',
    heroTitle: 'Report Gender-Based Violence',
    heroTitleHighlight: 'Safely & Anonymously',
    heroDesc: 'No registration required. Protect your identity, report an incident, and receive a private cryptographic token to track your case at any time.',
    btnReportNow: 'Report an Incident',
    btnGetHelp: 'Get Help Now',
    btnLearnMore: 'Learn More',
    
    statsSectionTitle: 'Our Impact in African Communities',
    statsSectionDesc: 'Real-time metrics tracking report resolutions, partner network expansion, and resource access.',
    statReports: 'Reports Submitted',
    statAssisted: 'Survivors Assisted',
    statPartners: 'Partner NGOs & Agencies',
    statResources: 'Safety Resources',
    
    howTitle: 'How It Works',
    howStep1Title: '01. Submit Incident',
    howStep1Desc: 'Fill out general details anonymously. No personal identifier is ever tracked.',
    howStep2Title: '02. Save Private Token',
    howStep2Desc: 'Retrieve your unique token. This is your only access key to the case.',
    howStep3Title: '03. Support & Review',
    howStep3Desc: 'Assigned officers review details and coordinate with legal/psychosocial aid.',
    howStep4Title: '04. Resolution Path',
    howStep4Desc: 'Receive updates, seek counseling, and track progress using your token.',
    
    trustTitle: 'Why Trust SafeReport?',
    trustDesc: 'Built with trauma-informed design principles to guarantee survivor safety and data security.',
    trust1Title: 'Complete Anonymity',
    trust1Desc: 'We never log names, phone numbers, email addresses, or IP addresses.',
    trust2Title: 'Evidence Protection',
    trust2Desc: 'Uploaded screenshots and media are double-encrypted and stripped of metadata.',
    trust3Title: 'Verified Support',
    trust3Desc: 'Direct connections with vetted African NGOs, legal aid groups, and trauma specialists.',
    trust4Title: 'Secure Audit Logs',
    trust4Desc: 'Every admin action is recorded in immutable logs to prevent system abuse.',
    
    emergencyTitle: 'In immediate danger or need urgent help?',
    emergencyDesc: 'Call the Toll-Free Gender-Based Violence Hotline at 1523, Gendarmerie at 113, or Police at 117 immediately.',
    emergencyCallBtn: 'Call Hotline (1523)',

    // Report Form Page
    reportTitle: 'Submit an Anonymous Incident Report',
    reportSubtitle: 'Please do not include your name or specific address. Your safety is our primary concern.',
    labelViolenceType: 'Violence Type',
    labelCategory: 'Incident Category',
    labelPlatform: 'Platform Involved',
    labelDescription: 'Incident Description',
    descMinChars: 'Minimum 20 characters',
    labelLocation: 'General Location (optional)',
    placeholderLocation: 'e.g. Yaoundé Mokolo, Douala Akwa, Bamenda Up-Station...',
    descLocationHelper: 'General area only — do not enter your home address.',
    labelIncidentDate: 'Incident Date',
    labelEvidence: 'Evidence Upload (optional)',
    descEvidenceHelper: 'JPG, PNG, PDF, MP4, MP3 · Max 10 MB each · Up to 5 files',
    btnSubmitReport: 'Submit Secure Report',
    submitting: 'Submitting...',
    anonToggleLabel: 'Report fully anonymously (hides details from general listing)',

    // Track Page
    trackTitle: 'Track Case Status',
    trackSubtitle: 'Enter your private cryptographic case token to view progress and messages.',
    placeholderToken: 'Enter your 32-character case token',
    btnTrack: 'Track Progress',
    trackErrorNotFound: 'Case not found. Please verify your token.'
  },
  fr: {
    // Navbar
    navHome: 'Accueil',
    navReport: 'Signaler un Incident',
    navTrack: 'Suivre mon Dossier',
    navNews: 'Actualités & Campagnes',
    navSafety: 'Conseils de Sécurité',
    navResources: 'Centre d\'Aide',
    navDonate: 'Faire un Don',
    navStories: 'Témoignages',
    navDashboard: 'Tableau de Bord',
    navAdmin: 'Admin',
    staffLogin: 'Connexion Personnel',
    signOut: 'Se Déconnecter',
    
    // Common
    loading: 'Chargement...',
    search: 'Rechercher...',
    category: 'Catégorie',
    all: 'Tous',
    submit: 'Soumettre',
    cancel: 'Annuler',
    back: 'Retour',
    delete: 'Supprimer',
    refresh: 'Actualiser',
    success: 'Succès',
    error: 'Erreur',
    
    // Landing Page
    heroSubtitle: 'Sécurisé · Anonyme · Confidentiel',
    heroTitle: 'Signalez la violence basée sur le genre',
    heroTitleHighlight: 'En toute sécurité et anonymat',
    heroDesc: 'Aucune inscription requise. Protégez votre identité, signalez un incident et recevez un jeton cryptographique privé pour suivre votre dossier à tout moment.',
    btnReportNow: 'Signaler un Incident',
    btnGetHelp: 'Obtenir de l\'Aide',
    btnLearnMore: 'En Savoir Plus',
    
    statsSectionTitle: 'Notre impact dans les communautés africaines',
    statsSectionDesc: 'Suivi en temps réel de la résolution des cas, de l\'expansion du réseau de partenaires et de l\'accès aux ressources.',
    statReports: 'Signalements Soumis',
    statAssisted: 'Survivants Assistés',
    statPartners: 'ONG & Agences Partenaires',
    statResources: 'Ressources de Sécurité',
    
    howTitle: 'Comment ça fonctionne',
    howStep1Title: '01. Signaler l\'incident',
    howStep1Desc: 'Remplissez les détails généraux de manière anonyme. Aucun identifiant personnel n\'est collecté.',
    howStep2Title: '02. Sauvegarder le jeton',
    howStep2Desc: 'Récupérez votre jeton unique. C\'est votre seule clé d\'accès à votre dossier.',
    howStep3Title: '03. Support & Révision',
    howStep3Desc: 'Les agents affectés examinent les détails et coordonnent l\'aide juridique/psychosociale.',
    howStep4Title: '04. Chemin de Résolution',
    howStep4Desc: 'Recevez des mises à jour, demandez des conseils et suivez les progrès grâce à votre jeton.',
    
    trustTitle: 'Pourquoi faire confiance à SafeReport?',
    trustDesc: 'Conçu selon des principes adaptés aux traumatismes pour garantir la sécurité des survivants et la confidentialité des données.',
    trust1Title: 'Anonymat Complet',
    trust1Desc: 'Nous n\'enregistrons jamais de noms, de numéros de téléphone, d\'e-mails ou d\'adresses IP.',
    trust2Title: 'Protection des Preuves',
    trust2Desc: 'Les captures d\'écran et les fichiers téléchargés sont doublement cryptés et expurgés de leurs métadonnées.',
    trust3Title: 'Soutien Vérifié',
    trust3Desc: 'Connexions directes avec des ONG africaines agréées, des groupes d\'aide juridique et des psychologues.',
    trust4Title: 'Logs d\'Audit Sécurisés',
    trust4Desc: 'Chaque action des administrateurs est enregistrée dans des journaux immuables pour éviter les abus.',
    
    emergencyTitle: 'En danger immédiat ou besoin d\'aide urgente ?',
    emergencyDesc: 'Appelez immédiatement le numéro vert gratuit pour les violences basées sur le genre au 1523, la Gendarmerie au 113, ou la Police au 117.',
    emergencyCallBtn: 'Appeler le Numéro Vert (1523)',

    // Report Form Page
    reportTitle: 'Soumettre un signalement anonyme',
    reportSubtitle: 'Veuillez ne pas inclure votre nom ou adresse exacte. Votre sécurité est notre priorité absolue.',
    labelViolenceType: 'Type de Violence',
    labelCategory: 'Catégorie d\'Incident',
    labelPlatform: 'Plateforme Concernée',
    labelDescription: 'Description de l\'Incident',
    descMinChars: 'Minimum 20 caractères',
    labelLocation: 'Lieu Général (facultatif)',
    placeholderLocation: 'ex. Yaoundé Mokolo, Douala Akwa, Bamenda Up-Station...',
    descLocationHelper: 'Zone générale uniquement — ne saisissez pas votre adresse personnelle.',
    labelIncidentDate: 'Date de l\'Incident',
    labelEvidence: 'Téléchargement de Preuves (facultatif)',
    descEvidenceHelper: 'JPG, PNG, PDF, MP4, MP3 · Max 10 Mo chacun · Jusqu\'à 5 fichiers',
    btnSubmitReport: 'Soumettre le Signalement Sécurisé',
    submitting: 'Transmission...',
    anonToggleLabel: 'Signaler de manière totalement anonyme (masque les détails de la liste générale)',

    // Track Page
    trackTitle: 'Suivre l\'état du dossier',
    trackSubtitle: 'Saisissez votre jeton cryptographique privé pour voir l\'état d\'avancement et les messages.',
    placeholderToken: 'Saisissez votre jeton de dossier à 32 caractères',
    btnTrack: 'Suivre l\'Avancement',
    trackErrorNotFound: 'Dossier introuvable. Veuillez vérifier votre jeton.'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
