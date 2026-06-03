import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HiChatAlt2, HiCheckCircle, HiEyeOff, HiUserCircle, HiHeart } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function SuccessStories() {
  const { language, t } = useLanguage();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Submission Form
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchStories = () => {
    setLoading(true);
    fetch('/api/testimonials')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch testimonials');
        return res.json();
      })
      .then((data) => {
        setStories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content || content.length < 15) {
      toast.error('Please write at least 15 characters to describe your story.');
      return;
    }

    setSubmitting(true);
    const payload = {
      author_name: isAnonymous ? 'Anonymous' : authorName || 'Anonymous',
      content: content,
    };

    fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      })
      .then(() => {
        setSubmitting(false);
        setSubmitted(true);
        setContent('');
        setAuthorName('');
        toast.success('Testimonial submitted for moderation review!');
      })
      .catch((err) => {
        console.error(err);
        setSubmitting(false);
        toast.error('Failed to submit testimonial. Please try again.');
      });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column Feed of Testimonials */}
      <div className="lg:col-span-7 space-y-8">
        <div className="space-y-3">
          <span className="badge bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">
            {t('navStories')}
          </span>
          <h1 className="text-3xl font-black text-gray-905 dark:text-white leading-tight">
            {language === 'en' ? 'Survivor Testimonials & Success Stories' : 'Témoignages & Histoires de Réussite'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {language === 'en'
              ? 'Read stories of strength and restoration from survivors who successfully reported abuse, received legal aid, or found security support through our network.'
              : 'Lisez des récits de force et de rétablissement de survivantes qui ont signalé des abus ou obtenu une aide juridique grâce à notre réseau.'}
          </p>
        </div>

        {/* Stories List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-gray-450">{t('loading')}</div>
          ) : stories.length > 0 ? (
            stories.map((story) => (
              <div key={story.id} className="card p-6 bg-white dark:bg-gray-950 dark:border-gray-900 shadow-sm relative space-y-4">
                <div className="absolute top-6 right-6 text-gray-100 dark:text-gray-900 pointer-events-none">
                  <HiChatAlt2 className="w-12 h-12" />
                </div>
                
                <p className="text-xs sm:text-sm text-gray-650 dark:text-gray-300 leading-relaxed italic whitespace-pre-line">
                  "{story.content}"
                </p>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-900/50">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 flex items-center justify-center">
                    <HiUserCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">{story.author_name}</h4>
                    <span className="text-[10px] text-gray-400">
                      {new Date(story.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 card bg-gray-50 dark:bg-gray-950/20 text-gray-500">
              {language === 'en' 
                ? 'No success stories published yet. Be the first to share your journey.' 
                : 'Aucun témoignage publié pour le moment.'}
            </div>
          )}
        </div>
      </div>

      {/* Right Column Share Form */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
        
        {/* Context Image (img2.jpg) */}
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-250/20 dark:border-gray-850">
          <img
            src="/images/img2.jpg"
            alt="Survivor Empowerment"
            className="w-full aspect-[4/3] object-cover"
          />
        </div>

        {/* Share Story Card Form */}
        <div className="card p-6 dark:bg-gray-950 dark:border-gray-900 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-indigo-950/30 flex items-center justify-center shrink-0">
              <HiHeart className="w-6 h-6 text-primary dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {language === 'en' ? 'Share Your Journey' : 'Partager votre Parcours'}
              </h3>
              <p className="text-xs text-gray-500">{language === 'en' ? 'Help inspire other survivors to speak up.' : 'Inspirez d\'autres survivantes à s\'exprimer.'}</p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <HiCheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold">{language === 'en' ? 'Testimonial Received' : 'Témoignage Reçu'}</span>
              </div>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
                {language === 'en' 
                  ? 'Your story has been submitted for moderation review. Once verified by our administrators, it will be published publicly. Thank you for your courage!'
                  : 'Votre histoire a été soumise pour modération. Une fois validée par nos administrateurs, elle sera publiée. Merci pour votre courage !'}
              </p>
              <button onClick={() => setSubmitted(false)} className="text-xs font-bold text-primary dark:text-indigo-400 hover:underline">
                {language === 'en' ? 'Write another testimonial' : 'Écrire un autre témoignage'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Anonymous Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-primary border-gray-305 dark:border-gray-800 dark:bg-gray-900 focus:ring-primary"
                />
                <label htmlFor="isAnonymous" className="text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer flex items-center gap-1">
                  <HiEyeOff className="w-4 h-4 text-gray-400" />
                  {language === 'en' ? 'Post Anonymously' : 'Publier anonymement'}
                </label>
              </div>

              {/* Author name if not anonymous */}
              {!isAnonymous && (
                <div>
                  <label className="label text-[10px] uppercase font-bold text-gray-400">{language === 'en' ? 'Your Name / Nickname' : 'Votre Nom / Pseudo'}</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Marie L."
                    className="input text-xs py-2 w-full dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100"
                  />
                </div>
              )}

              {/* Content text */}
              <div>
                <label className="label text-[10px] uppercase font-bold text-gray-400">{language === 'en' ? 'Your Story' : 'Votre Histoire'}</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder={language === 'en' ? 'Describe how reporting or support helped you...' : 'Décrivez comment le signalement ou le soutien vous a aidée...'}
                  className="input resize-none text-xs w-full dark:bg-gray-900 dark:border-gray-800 dark:text-gray-105"
                />
              </div>

              {/* Moderation Notice banner */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl p-3 text-[11px] text-amber-700 dark:text-amber-400/90 leading-relaxed">
                ℹ️ {language === 'en' 
                  ? 'All submissions are reviewed by moderators before publication to filter abuse, spam, or personally identifying details.' 
                  : 'Toutes les soumissions sont examinées par les modérateurs avant publication.'}
              </div>

              {/* Submit btn */}
              <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5 rounded-xl justify-center text-xs font-bold">
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <>{language === 'en' ? 'Submit Story' : 'Soumettre l\'Histoire'}</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
