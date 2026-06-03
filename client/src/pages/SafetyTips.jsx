import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HiSearch, HiShare, HiCheck, HiLockClosed, HiEye, HiOutlineGlobeAlt, HiChatAlt } from 'react-icons/hi';
import toast from 'react-hot-toast';

const TIPS_ARTICLES = [
  {
    id: 1,
    category: 'social_media',
    icon: <HiOutlineGlobeAlt className="w-5 h-5" />,
    title: {
      en: 'Secure Your Social Media Profiles',
      fr: 'Sécuriser vos profils de réseaux sociaux'
    },
    desc: {
      en: 'Learn how to configure privacy settings on Facebook, Instagram, and TikTok to limit exposure to harassers.',
      fr: 'Découvrez comment configurer les paramètres de confidentialité sur Facebook, Instagram et TikTok pour limiter l\'exposition aux harceleurs.'
    },
    content: {
      en: '1. Change profile visibility to "Friends Only".\n2. Disable location tagging on all posts.\n3. Limit who can comment, send direct messages (DMs), or tag you in photos.\n4. Remove personal details such as phone numbers, schools attended, or places of work from your public bio.',
      fr: '1. Modifiez la visibilité du profil sur "Amis uniquement".\n2. Désactivez le marquage de localisation sur tous les posts.\n3. Limitez qui peut commenter, envoyer des messages directs (DM) ou vous taguer.\n4. Supprimez les détails personnels comme votre numéro de téléphone de votre bio publique.'
    }
  },
  {
    id: 2,
    category: 'privacy',
    icon: <HiLockClosed className="w-5 h-5" />,
    title: {
      en: 'Recognizing & Documenting Cyberstalking',
      fr: 'Reconnaître et documenter le cyberharcèlement'
    },
    desc: {
      en: 'Gathering clear, untampered evidence is key to holding abusers accountable. Learn how to archive online threats.',
      fr: 'Rassembler des preuves claires et non falsifiées est essentiel pour responsabiliser les agresseurs. Apprenez à archiver les menaces.'
    },
    content: {
      en: '1. Take full screenshots including dates, times, and URLs.\n2. Do not delete threads or block immediately before capturing screenshots.\n3. Keep logs in a separate, password-protected folder.\n4. Back up evidence to a secure drive or upload it directly to SafeReport.',
      fr: '1. Prenez des captures d\'écran complètes incluant les dates, heures et URL.\n2. Ne supprimez pas les fils de discussion avant de capturer.\n3. Conservez les journaux dans un dossier distinct protégé par mot de passe.\n4. Sauvegardez les preuves sur un disque sécurisé ou SafeReport.'
    }
  },
  {
    id: 3,
    category: 'communication',
    icon: <HiChatAlt className="w-5 h-5" />,
    title: {
      en: 'Using Encrypted Messaging Apps',
      fr: 'Utiliser des messageries cryptées'
    },
    desc: {
      en: 'Ensure your private conversations remain confidential by using secure protocols and self-destructing texts.',
      fr: 'Assurez-vous que vos conversations privées restent confidentielles en utilisant des protocoles sécurisés.'
    },
    content: {
      en: '1. Choose Signal or WhatsApp for end-to-end encrypted chats.\n2. Enable disappearing messages (e.g., 24 hours or 7 days).\n3. Set up a security PIN/FaceID lock specifically for the messaging apps.\n4. Turn off automatic cloud backups, which are often not encrypted.',
      fr: '1. Choisissez Signal ou WhatsApp pour les discussions cryptées de bout en bout.\n2. Activez les messages éphémères (ex. 24 heures ou 7 jours).\n3. Configurez un verrouillage par code PIN/FaceID pour l\'application.\n4. Désactivez les sauvegardes automatiques dans le cloud non chiffrées.'
    }
  },
  {
    id: 4,
    category: 'cyberbullying',
    icon: <HiEye className="w-5 h-5" />,
    title: {
      en: 'Dealing with Online Threats and Trolls',
      fr: 'Faire face aux menaces en ligne et aux trolls'
    },
    desc: {
      en: 'Trolls seek reactions. Protect your peace, limit interaction, and report violations to platforms.',
      fr: 'Les trolls cherchent des réactions. Protégez votre paix, limitez les interactions et signalez les violations.'
    },
    content: {
      en: '1. Do not engage or argue with the harasser; this often escalates the abuse.\n2. Use platform reporting tools for hate speech, violence, or impersonation.\n3. Create lists of approved accounts or restrict comments temporarily.\n4. Reach out to friends, family, or professional counselors for emotional support.',
      fr: '1. Ne vous engagez pas et ne discutez pas avec le harceleur.\n2. Utilisez les outils de signalement de la plateforme pour discours de haine.\n3. Créez des listes de comptes approuvés ou restreignez les commentaires.\n4. Contactez des amis ou des conseillers pour un soutien psychologique.'
    }
  }
];

export default function SafetyTips() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const shareLink = (id, titleText) => {
    const url = `${window.location.origin}/safety-tips?id=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const filtered = TIPS_ARTICLES.filter(art => {
    const title = art.title[language] || art.title.en;
    const desc = art.desc[language] || art.desc.en;
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || 
                          desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || art.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-12">
      {/* Header Banner Split */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gray-50 dark:bg-gray-950 p-6 md:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-900 shadow-sm max-w-6xl mx-auto">
        <div className="md:col-span-7 space-y-4 text-left">
          <span className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">
            {t('navSafety')}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            {language === 'en' ? 'Digital Safety & Privacy Center' : 'Centre de Sécurité Numérique & de Confidentialité'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {language === 'en' 
              ? 'Protect your digital presence, secure your profiles, and learn how to collect evidence safely when facing online violence or stalking.'
              : 'Protégez votre présence numérique, sécurisez vos profils et apprenez à recueillir des preuves en toute sécurité en cas de violence ou de harcèlement en ligne.'}
          </p>
        </div>
        <div className="md:col-span-5 relative flex justify-center">
          <div className="relative aspect-[16/10] w-full max-w-sm rounded-2xl overflow-hidden shadow-md">
            <img 
              src="/images/img5.jpg" 
              alt="STOP GBV Hand" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Controls: Search and Categories */}
      <section className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <HiSearch className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 w-full dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 py-2.5"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['all', 'social_media', 'privacy', 'communication', 'cyberbullying'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                category === cat
                  ? 'bg-primary border-primary text-white shadow-sm shadow-primary/10'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-950'
              }`}
            >
              {cat === 'all' && (language === 'en' ? 'All Tips' : 'Tous les Conseils')}
              {cat === 'social_media' && (language === 'en' ? 'Social Privacy' : 'Réseaux Sociaux')}
              {cat === 'privacy' && (language === 'en' ? 'Digital Identity' : 'Identité Numérique')}
              {cat === 'communication' && (language === 'en' ? 'Communication' : 'Communication')}
              {cat === 'cyberbullying' && (language === 'en' ? 'Harassment' : 'Harcèlement')}
            </button>
          ))}
        </div>
      </section>

      {/* Tips Cards */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((art) => {
            const titleText = art.title[language] || art.title.en;
            const descText = art.desc[language] || art.desc.en;
            const contentText = art.content[language] || art.content.en;

            return (
              <div key={art.id} className="card p-6 flex flex-col justify-between gap-4 dark:bg-gray-950 dark:border-gray-900 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                      {art.icon}
                      {art.category.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => shareLink(art.id, titleText)}
                      className="p-1.5 rounded-lg text-gray-450 hover:text-primary dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      title="Share link"
                    >
                      {copiedId === art.id ? <HiCheck className="w-4 h-4 text-emerald-500" /> : <HiShare className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="text-lg font-extrabold text-gray-850 dark:text-gray-100 leading-snug">{titleText}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{descText}</p>

                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-900/50 text-xs text-gray-600 dark:text-gray-350 whitespace-pre-line leading-relaxed">
                    {contentText}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12 text-gray-400">
            {language === 'en' ? 'No safety articles match your filters.' : 'Aucun conseil ne correspond à vos filtres.'}
          </div>
        )}
      </section>
    </div>
  );
}
