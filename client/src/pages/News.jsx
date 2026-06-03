import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HiSearch, HiCalendar, HiUser, HiChevronLeft, HiChevronRight, HiBell } from 'react-icons/hi';

export default function News() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const limit = 6;

  const fetchArticles = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    fetch(`/api/news?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch news');
        return res.json();
      })
      .then((data) => {
        setArticles(data.articles);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, [page, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-12 pb-12 max-w-6xl mx-auto px-4">
      {/* Header Banner Split */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gray-50 dark:bg-gray-950 p-6 md:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-900 shadow-sm">
        <div className="md:col-span-7 space-y-4 text-left">
          <span className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">
            {t('navNews')}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            {language === 'en' ? 'News & Awareness Campaigns' : 'Actualités & Campagnes de Sensibilisation'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {language === 'en'
              ? 'Stay updated on public alerts, digital security guidelines, SafeReport workshops, and national campaigns against Online Gender-Based Violence.'
              : 'Restez informé des alertes publiques, des directives de sécurité numérique, des ateliers SafeReport et des campagnes contre les violences basées sur le genre en ligne.'}
          </p>
        </div>
        <div className="md:col-span-5 relative flex justify-center">
          <div className="relative aspect-[16/10] w-full max-w-sm rounded-2xl overflow-hidden shadow-md">
            <img 
              src="/images/img2.jpg" 
              alt="STOP GBV Activism" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Filter and Search controls */}
      <section className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-900 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md flex gap-2">
          <div className="relative flex-grow">
            <HiSearch className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 w-full dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 py-2.5"
            />
          </div>
          <button type="submit" className="btn-primary px-5 rounded-xl text-xs sm:text-sm font-semibold">
            {language === 'en' ? 'Find' : 'Chercher'}
          </button>
        </form>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['', 'campaign', 'news', 'update', 'alert'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                category === cat
                  ? 'bg-primary border-primary text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 border-gray-205 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50'
              }`}
            >
              {cat === '' && (language === 'en' ? 'All Feed' : 'Tout le Fil')}
              {cat === 'campaign' && (language === 'en' ? 'Campaigns' : 'Campagnes')}
              {cat === 'news' && (language === 'en' ? 'News' : 'Actualités')}
              {cat === 'update' && (language === 'en' ? 'Security updates' : 'Sécurité')}
              {cat === 'alert' && (language === 'en' ? 'Alerts' : 'Alertes')}
            </button>
          ))}
        </div>
      </section>

      {/* News Articles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-450">{t('loading')}</div>
        ) : articles.length > 0 ? (
          articles.map((art) => {
            const isExpanded = expandedId === art.id;
            return (
              <article key={art.id} className="card p-6 flex flex-col justify-between gap-4 dark:bg-gray-950 dark:border-gray-900 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      art.category === 'alert' 
                        ? 'bg-red-55/10 text-red-600'
                        : art.category === 'campaign'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                        : 'bg-indigo-50 text-primary dark:bg-indigo-950/20'
                    }`}>
                      {art.category}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-400">
                      <HiCalendar className="w-3.5 h-3.5" />
                      {new Date(art.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR')}
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-850 dark:text-gray-100 leading-snug">{art.title}</h3>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {isExpanded ? art.content : `${art.content.slice(0, 160)}...`}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-900/50">
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <HiUser className="w-3.5 h-3.5" /> {art.author_name || 'Staff'}
                  </span>
                  
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : art.id)}
                    className="text-xs font-bold text-primary dark:text-indigo-400 hover:underline"
                  >
                    {isExpanded 
                      ? (language === 'en' ? 'Read Less' : 'Moins de détails') 
                      : (language === 'en' ? 'Read More' : 'Lire la Suite')}
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            {language === 'en' ? 'No campaign articles found.' : 'Aucun article trouvé.'}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="p-2 border border-gray-205 dark:border-gray-800 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:bg-gray-950 transition-colors"
          >
            <HiChevronLeft className="w-5 h-5 text-gray-650 dark:text-gray-300" />
          </button>
          
          <span className="text-xs font-bold text-gray-550 dark:text-gray-400">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="p-2 border border-gray-205 dark:border-gray-800 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:bg-gray-950 transition-colors"
          >
            <HiChevronRight className="w-5 h-5 text-gray-650 dark:text-gray-300" />
          </button>
        </section>
      )}
    </div>
  );
}
