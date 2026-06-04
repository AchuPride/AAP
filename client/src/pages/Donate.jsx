import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HiHeart, HiCreditCard, HiPhone, HiChevronRight, HiCheckCircle, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Donate() {
  const { language, t } = useLanguage();
  const [amount, setAmount] = useState('2500');
  const [customAmount, setCustomAmount] = useState('');
  const [payMethod, setPayMethod] = useState('momo'); // momo | card | paypal
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Billing states
  const [phone, setPhone] = useState('');
  const [provider, setProvider] = useState('mtn');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const handleDonate = (e) => {
    e.preventDefault();
    const finalAmount = amount === 'custom' ? customAmount : amount;
    
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      toast.error('Please enter a valid donation amount.');
      return;
    }

    if (payMethod === 'momo' && !phone) {
      toast.error('Please enter your Mobile Money phone number.');
      return;
    }

    setLoading(true);
    // Simulate transaction
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success('Thank you for your generous donation!');
    }, 2500);
  };

  const getTierBenefit = () => {
    const finalVal = amount === 'custom' ? parseFloat(customAmount) || 0 : parseFloat(amount);
    if (finalVal >= 60000) return language === 'en' ? 'Provides safe shelter and counseling for a survivor for 1 month.' : 'Offre un abri sûr et des conseils à une survivante pendant 1 mois.';
    if (finalVal >= 30000) return language === 'en' ? 'Funds a full legal aid consultation and document archiving.' : 'Finance une consultation d\'aide juridique complète et l\'archivage de documents.';
    if (finalVal >= 15000) return language === 'en' ? 'Covers 1 week of digital safety and internet training for a youth group.' : 'Couvre 1 semaine de formation sur la sécurité numérique pour un groupe de jeunes.';
    return language === 'en' ? 'Supports platform hosting, encryption security, and database audits.' : 'Soutient l\'hébergement de la plateforme, la sécurité du chiffrement et les audits de base de données.';
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto py-12">
        <div className="card text-center space-y-6 p-8 dark:bg-gray-950 dark:border-gray-900 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center mx-auto">
            <HiCheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {language === 'en' ? 'Thank You!' : 'Merci Beaucoup !'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {language === 'en' 
                ? 'Your donation has been processed successfully. You are directly supporting local efforts to combat gender-based violence.'
                : 'Votre don a été traité avec succès. Vous soutenez directement les efforts locaux de lutte contre les violences basées sur le genre.'}
            </p>
          </div>
          <button onClick={() => setSuccess(false)} className="btn-primary w-full py-2.5 rounded-xl justify-center">
            {language === 'en' ? 'Make Another Donation' : 'Faire un autre don'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column Description and Image (img3.jpg) */}
      <div className="lg:col-span-6 space-y-6">
        <div className="space-y-4">
          <span className="badge bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">
            {t('navDonate')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white leading-tight">
            {language === 'en' ? 'Support Our Mission to End GBV' : 'Soutenez Notre Mission de Fin du GBV'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {language === 'en'
              ? 'SafeReport is a free public utility platform. Your contributions go directly towards maintaining server safety, expanding the vetting network of local NGOs, and providing direct legal counseling and shelter support to survivors of online harassment, stalking, and blackmail.'
              : 'SafeReport est une plateforme d\'utilité publique gratuite. Vos contributions servent à maintenir la sécurité des serveurs, à étendre le réseau d\'ONG et à offrir un soutien juridique et d\'hébergement aux survivantes.'}
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-250/20 dark:border-gray-850">
          <img
            src="/images/img3.jpg"
            alt="End GBV Campaign"
            className="w-full aspect-[4/3] object-cover"
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-900">
          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-2">
            {language === 'en' ? 'Platform Sustainability Goal' : 'Objectif de Pérennité de la Plateforme'}
          </h4>
          <div className="w-full bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden mb-2">
            <div className="bg-primary h-full rounded-full" style={{ width: '0%' }} />
          </div>
          <div className="flex justify-between text-xs text-gray-550 dark:text-gray-400 font-semibold">
            <span>0% {language === 'en' ? 'funded' : 'financé'}</span>
            <span>0frs / 5,000,000frs {language === 'en' ? 'monthly' : 'mensuel'}</span>
          </div>
        </div>
      </div>

      {/* Right Column Checkout Panel */}
      <div className="lg:col-span-6 card p-6 sm:p-8 dark:bg-gray-950 dark:border-gray-900 shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-indigo-950/30 flex items-center justify-center shrink-0">
            <HiHeart className="w-6 h-6 text-primary dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
              {language === 'en' ? 'Secure Contribution' : 'Contribution Sécurisée'}
            </h3>
            <p className="text-xs text-gray-400">{language === 'en' ? 'Transactions are encrypted end-to-end.' : 'Les transactions sont cryptées de bout en bout.'}</p>
          </div>
        </div>

        <form onSubmit={handleDonate} className="space-y-6">
          {/* Tiers Select Grid */}
          <div className="space-y-2">
            <label className="label">{language === 'en' ? 'Select Donation Amount (frs)' : 'Sélectionner le montant (frs)'}</label>
            <div className="grid grid-cols-4 gap-2">
              {['1000', '2500', '5000', '10000'].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => {
                    setAmount(tier);
                    setCustomAmount('');
                  }}
                  className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                    amount === tier
                      ? 'bg-primary border-primary text-white shadow-sm'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {tier} frs
                </button>
              ))}
            </div>
            
            {/* Custom Amount Option */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setAmount('custom')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all mb-2 ${
                  amount === 'custom'
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600'
                }`}
              >
                {language === 'en' ? 'Custom Amount' : 'Autre montant'}
              </button>
              {amount === 'custom' && (
                <div className="relative">
                  <input
                    type="number"
                    placeholder={language === 'en' ? "Enter amount in frs..." : "Entrez le montant en frs..."}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="input pr-10 text-xs py-2 w-full dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100"
                  />
                  <span className="absolute right-3.5 top-2 text-xs text-gray-450 font-bold">frs</span>
                </div>
              )}
            </div>
          </div>

          {/* Tier impact summary */}
          <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/40 dark:border-indigo-900/20 rounded-xl p-3.5 text-xs text-indigo-700 dark:text-indigo-400">
            <span className="font-bold">⭐ {language === 'en' ? 'Impact:' : 'Impact :'}</span> {getTierBenefit()}
          </div>

          {/* Payment Method Tabs */}
          <div className="space-y-2">
            <label className="label">{language === 'en' ? 'Payment Method' : 'Moyen de Paiement'}</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPayMethod('momo')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                  payMethod === 'momo'
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <HiPhone className="w-4 h-4" />
                <span>Mobile Money</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPayMethod('card')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                  payMethod === 'card'
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <HiCreditCard className="w-4 h-4" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPayMethod('paypal')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 justify-center ${
                  payMethod === 'paypal'
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="font-bold italic text-xs tracking-tight text-amber-500">Pay<span className="text-sky-500">Pal</span></span>
              </button>
            </div>
          </div>

          {/* Conditional Fields */}
          {payMethod === 'momo' && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-900">
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="provider"
                    value="mtn"
                    checked={provider === 'mtn'}
                    onChange={() => setProvider('mtn')}
                    className="text-primary"
                  />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">MTN MoMo</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="provider"
                    value="orange"
                    checked={provider === 'orange'}
                    onChange={() => setProvider('orange')}
                    className="text-primary"
                  />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Orange Money</span>
                </label>
              </div>

              <div>
                <label className="label text-[10px] uppercase font-bold text-gray-400">{language === 'en' ? 'Mobile Number' : 'Numéro Mobile'}</label>
                <input
                  type="text"
                  placeholder="e.g. +237 677 88 99 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input text-xs py-2 w-full dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100"
                />
              </div>
            </div>
          )}

          {payMethod === 'card' && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-900">
              <div>
                <label className="label text-[10px] uppercase font-bold text-gray-400">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="input text-xs py-2 w-full dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="label text-[10px] uppercase font-bold text-gray-400">Card Number</label>
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="input text-xs py-2 w-full dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100"
                />
              </div>
            </div>
          )}

          {payMethod === 'paypal' && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-900 text-center">
              <p className="text-xs text-gray-500">{language === 'en' ? 'You will be redirected to PayPal to complete your donation.' : 'Vous serez redirigé vers PayPal pour finaliser votre don.'}</p>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl justify-center text-sm font-bold shadow-md shadow-primary/20">
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                <span>{language === 'en' ? 'Verifying payment...' : 'Vérification...'}</span>
              </>
            ) : (
              <>
                <HiHeart className="w-5 h-5 shrink-0 text-white" />
                <span>
                  {language === 'en' ? 'Donate Now' : 'Faire le don'} ({amount === 'custom' ? customAmount || '0' : amount} frs)
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
