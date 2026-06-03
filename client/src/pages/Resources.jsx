import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HiPhone, HiDownload, HiChevronDown, HiChevronUp, HiQuestionMarkCircle, HiDocumentText } from 'react-icons/hi';
import toast from 'react-hot-toast';

const FAQ_ITEMS = [
  {
    question: {
      en: 'Is my report truly anonymous?',
      fr: 'Mon signalement est-il vraiment anonyme ?'
    },
    answer: {
      en: 'Yes. We do not require or collect your name, email address, phone number, or social media handles. We do not store your IP address or session tracking metadata. Only the details you input in the description and any uploaded files are saved.',
      fr: 'Oui. Nous n\'exigeons ni ne collectons votre nom, e-mail, numéro de téléphone ou profil. Nous ne stockons pas votre adresse IP ou métadonnées de suivi. Seuls les détails saisis dans la description et les fichiers joints sont enregistrés.'
    }
  },
  {
    question: {
      en: 'What happens after I submit a report?',
      fr: 'Que se passe-t-il après avoir soumis un rapport ?'
    },
    answer: {
      en: 'Upon submission, a unique 32-character case token is generated. Vetted caseworkers and support officers will review your report, categorize it, and coordinate with legal and psychosocial partners. You can enter your token on the "Track Case" page to see status updates and message replies.',
      fr: 'Lors de la soumission, un jeton unique à 32 caractères est généré. Des travailleurs sociaux et officiers agréés examinent votre rapport et coordonnent l\'aide avec les partenaires. Saisissez votre jeton sur la page de suivi pour voir les mises à jour et réponses.'
    }
  },
  {
    question: {
      en: 'Who has access to the evidence files I upload?',
      fr: 'Qui a accès aux fichiers de preuves que je télécharge ?'
    },
    answer: {
      en: 'Uploaded evidence files are encrypted and stored in private directories. Only authorized caseworkers assigned to your case can view them. Files are automatically stripped of metadata (like device type and GPS locations) upon upload to protect your physical safety.',
      fr: 'Les fichiers de preuves téléchargés sont chiffrés et stockés dans des répertoires privés. Seuls les agents affectés à votre dossier peuvent les consulter. Les fichiers sont expurgés de leurs métadonnées géographiques et d\'appareil pour votre sécurité.'
    }
  },
  {
    question: {
      en: 'How long does a case investigation take?',
      fr: 'Combien de temps prend l\'examen d\'un cas ?'
    },
    answer: {
      en: 'Case review typically starts within 24 to 48 hours of submission. High-priority cases involving immediate physical safety risks are prioritized and assigned immediately to partners (such as police or shelters). Track your case token regularly for real-time progress updates.',
      fr: 'L\'examen commence généralement sous 24 à 48 heures. Les cas prioritaires impliquant des risques immédiats de sécurité physique sont traités en priorité. Suivez régulièrement votre dossier grâce à votre jeton.'
    }
  }
];

const DOWNLOADS = [
  {
    title: {
      en: 'Survivor Digital Safety Guide',
      fr: 'Guide de Sécurité Numérique pour Survivants'
    },
    size: '1.2 MB',
    type: 'PDF'
  },
  {
    title: {
      en: 'OGBV Cameroon Legal Rights Pamphlet',
      fr: 'Pamphlet sur les Droits Juridiques OGBV au Cameroun'
    },
    size: '850 KB',
    type: 'PDF'
  },
  {
    title: {
      en: 'Evidence Collection Checklist',
      fr: 'Liste de Contrôle pour la Collecte de Preuves'
    },
    size: '420 KB',
    type: 'PDF'
  }
];

export default function Resources() {
  const { language, t } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleDownload = (filename) => {
    // Mock download trigger
    toast.success(`Downloading ${filename}...`);
    // Create a mock download link
    const blob = new Blob([`SafeReport Mock Download File: ${filename}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/\s+/g, '_')}_mock.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-16 pb-12 max-w-6xl mx-auto px-4">
      {/* Page Title */}
      <section className="text-center py-6 space-y-3">
        <span className="badge bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-450 font-bold uppercase tracking-wider text-xs">
          {t('navResources')}
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-gray-905 dark:text-white leading-tight">
          {language === 'en' ? 'Help Center & Support Resources' : 'Centre d\'Aide & Ressources de Soutien'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          {language === 'en'
            ? 'Access direct emergency helplines, download digital safety manuals, and get answers to frequently asked questions.'
            : 'Accédez aux lignes d\'urgence directes, téléchargez des manuels de sécurité numérique et trouvez les réponses à vos questions.'}
        </p>
      </section>

      {/* Emergency Helplines Block */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="tel:1523" className="card p-6 flex flex-col justify-between gap-4 border-red-200/50 hover:border-red-400 dark:bg-gray-950 dark:border-gray-900 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <HiPhone className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wider">GBV Helpline</h3>
              <p className="text-2xl font-black font-mono text-red-600 dark:text-red-400 mt-1">1523</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {language === 'en' 
              ? 'Toll-free, 24/7 national counseling and emergency coordination hotline inside Cameroon.' 
              : 'Ligne d\'assistance nationale gratuite et disponible 24h/24 et 7j/7 au Cameroun.'}
          </p>
        </a>

        <a href="tel:113" className="card p-6 flex flex-col justify-between gap-4 hover:border-primary/40 dark:bg-gray-950 dark:border-gray-900 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <HiPhone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wider">Gendarmerie</h3>
              <p className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">113</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {language === 'en'
              ? 'National Gendarmerie intervention for direct physical protection and rescue operations.'
              : 'Intervention de la Gendarmerie nationale pour une protection physique directe.'}
          </p>
        </a>

        <a href="tel:117" className="card p-6 flex flex-col justify-between gap-4 hover:border-primary/40 dark:bg-gray-950 dark:border-gray-900 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <HiPhone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wider">Police</h3>
              <p className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">117</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {language === 'en'
              ? 'Emergency police assistance inside major cities and local stations across regions.'
              : 'Assistance policière d\'urgence dans les grandes villes et commissariats locaux.'}
          </p>
        </a>
      </section>

      {/* Downloads Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <HiDocumentText className="w-5 h-5 text-gray-400" />
          {language === 'en' ? 'Downloadable Awareness Materials' : 'Matériels de Sensibilisation Téléchargeables'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DOWNLOADS.map((item, i) => {
            const titleText = item.title[language] || item.title.en;
            return (
              <div key={i} className="card p-6 bg-white dark:bg-gray-950 dark:border-gray-900 shadow-sm flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 leading-snug">{titleText}</h3>
                  <div className="flex gap-2 text-[10px] font-bold text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded">{item.type}</span>
                    <span className="bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded">{item.size}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(titleText)}
                  className="btn-outline text-xs justify-center py-2.5 rounded-xl border-gray-200 dark:border-gray-800 hover:border-primary/50 text-gray-600 dark:text-gray-400"
                >
                  <HiDownload className="w-4 h-4" />
                  {language === 'en' ? 'Download PDF' : 'Télécharger le PDF'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <HiQuestionMarkCircle className="w-5 h-5 text-gray-400" />
          {language === 'en' ? 'Frequently Asked Questions' : 'Foire aux Questions'}
        </h2>

        <div className="space-y-4">
          {FAQ_ITEMS.map((faq, index) => {
            const questionText = faq.question[language] || faq.question.en;
            const answerText = faq.answer[language] || faq.answer.en;
            const isOpen = openFaq === index;

            return (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-900 rounded-2xl overflow-hidden bg-white dark:bg-gray-950"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <span>{questionText}</span>
                  {isOpen ? <HiChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <HiChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-6 py-4 border-t border-gray-150 dark:border-gray-900/60 bg-gray-50/50 dark:bg-gray-900/30 text-xs sm:text-sm text-gray-550 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {answerText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
