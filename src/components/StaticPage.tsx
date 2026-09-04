import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { MapPin, Phone, Mail, CheckCircle2, Send, ShieldCheck, FileText, Info } from 'lucide-react';

interface StaticPageProps {
  page: 'about' | 'privacy' | 'terms' | 'advertise' | 'contact';
  settings: SiteSettings;
  onBackHome: () => void;
}

export const StaticPage: React.FC<StaticPageProps> = ({ page, settings, onBackHome }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setName('');
      setContact('');
      setMessage('');
      setFormSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={onBackHome}
        className="text-xs font-semibold text-neutral-500 hover:text-red-600 mb-6 inline-flex items-center gap-1 transition"
      >
        &larr; হোমপেজে ফিরে যান
      </button>

      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 md:p-10 shadow-xs">
        {page === 'about' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl md:text-3xl font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
                <Info className="w-6 h-6 text-red-600" />
                আমাদের সম্পর্কে (About Us)
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                {settings.siteName} — সত্যের সন্ধানে নির্ভীক ও দায়িত্বশীল সাংবাদিকতা
              </p>
            </div>

            <div className="article-prose space-y-4 text-sm text-neutral-700 leading-relaxed">
              <p>
                <strong>“{settings.siteName}”</strong> উত্তরবঙ্গের কুড়িগ্রাম জেলাসহ সমগ্র বাংলাদেশের নির্ভরযোগ্য, দ্রুত এবং নিরপেক্ষ অনলাইন সংবাদ মাধ্যম। তৃণমূল মানুষের সুখ-দুঃখ, অধিকার, সমসাময়িক রাজনীতি, নদীভাঙন, চরবাসীর জীবন সংগ্রাম এবং শিক্ষা-সংস্কৃতির বাস্তব চিত্র জাতির সামনে তুলে ধরাই আমাদের অঙ্গীকার।
              </p>
              <p>
                ডিজিটাল সাংবাদিকতার উৎকর্ষতায় আমরা বস্তুনিষ্ঠ তথ্য ও সত্য প্রকাশে আপসহীন। স্থানীয় সংবাদদাতাদের সুসংগঠিত নেটওয়ার্ক এবং আধুনিক নিউজরুমের সমন্বয়ে আমরা দিনরাত ২৪ ঘণ্টা সত্যনিষ্ঠ তথ্য পরিবেশন করে আসছি।
              </p>
              <h3 className="text-lg font-bold font-bangla-serif text-neutral-900 mt-4">সম্পাদকীয় পরিষদ ও পরিচালনা</h3>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>ভারপ্রাপ্ত সম্পাদক: {settings.editorName}</li>
                <li>প্রকাশক: {settings.publisherName}</li>
                <li>প্রধান কার্যালয়: {settings.address}</li>
                <li>যোগাযোগ: {settings.phone} | {settings.email}</li>
              </ul>
            </div>
          </div>
        )}

        {page === 'privacy' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl md:text-3xl font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-red-600" />
                গোপনীয়তা নীতি (Privacy Policy)
              </h1>
              <p className="text-xs text-neutral-500 mt-1">পাঠকের তথ্যের সুরক্ষা ও দায়িত্বশীলতা</p>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-neutral-700 leading-relaxed">
              <p>
                {settings.siteName} পাঠকদের ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা ও গোপনীয়তা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। আপনি যখন আমাদের ওয়েবসাইট পরিদর্শন করেন, তখন আপনার তথ্য কীভাবে সংরক্ষিত ও ব্যবহৃত হয় তা এখানে বর্ণিত হয়েছে।
              </p>
              <h4 className="font-bold text-neutral-900 text-sm">১. সংগৃহীত তথ্যাবলী</h4>
              <p>
                আমরা কোনো অযাচিত ব্যক্তিগত তথ্য সংরক্ষণ করি না। ব্রাউজিং সুবিধার জন্য কুকিজ ও অ্যানালিটিক্স ব্যবহার করে ভিজিটর ট্রাফিকের সমষ্টিগত ডেটা (যেমন: ব্রাউজার ধরন, পঠিত খবর) পর্যবেক্ষণ করা হয়।
              </p>
              <h4 className="font-bold text-neutral-900 text-sm">২. তথ্যের নিরাপত্তা</h4>
              <p>
                আপনার তথ্য কোনো তৃতীয় পক্ষের নিকট বিক্রয় বা হস্তান্তর করা হয় না। জাতীয় আইন ও সাইবার নীতিমালার প্রতি আমরা সর্বদা শ্রদ্ধাশীল।
              </p>
            </div>
          </div>
        )}

        {page === 'terms' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl md:text-3xl font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-red-600" />
                ব্যবহারের সাধারণ শর্তাবলী (Terms of Service)
              </h1>
              <p className="text-xs text-neutral-500 mt-1">পোর্টাল ব্যবহারের নিয়ম ও স্বত্বাধিকার</p>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-neutral-700 leading-relaxed">
              <h4 className="font-bold text-neutral-900 text-sm">১. কপিরাইট ও স্বত্বাধিকার</h4>
              <p>
                {settings.siteName}-এ প্রকাশিত সকল সংবাদ, আলোকচিত্র, ভিডিও ও গ্রাফিক্স সংশ্লিষ্ট নীতিমালার আওতাভুক্ত। পূর্বানুমতি ব্যতিরেকে বা ক্রেডিট ছাড়া বাণিজ্যিকভাবে ব্যবহার সম্পূর্ণ নিষিদ্ধ।
              </p>
              <h4 className="font-bold text-neutral-900 text-sm">২. মন্তব্য ও প্রতিক্রিয়া</h4>
              <p>
                সংবাদের নিচে গঠনমূলক মন্তব্য স্বাগত। তবে ধর্মীয় অনুভূতিতে আঘাত, মানহানিকর বা অশালীন কোনো বক্তব্য প্রকাশ আইনত দণ্ডনীয়।
              </p>
            </div>
          </div>
        )}

        {page === 'advertise' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl md:text-3xl font-bold font-bangla-serif text-neutral-900 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-600 rounded-sm"></span>
                বিজ্ঞাপন দিন (Advertise With Us)
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                আপনার প্রতিষ্ঠান ও পণ্যের প্রচারে উত্তরবঙ্গের সর্বাধিক জনপ্রিয় সংবাদ পোর্টালে বিজ্ঞাপন দিন
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-xs text-neutral-700 leading-relaxed">
                <h4 className="text-sm font-bold text-neutral-900 font-bangla-serif">কেন কুড়িগ্রাম নিউজে বিজ্ঞাপন দেবেন?</h4>
                <p>• প্রতিদিন লক্ষাধিক সক্রিয় সচেতন পাঠক ও প্রবাসীর নিয়মিত ভিজিট।</p>
                <p>• হেডার, হোমপেজ, সংবাদ পাঠ্য এবং সাইডবারে সর্বোচ্চ ভিজিবিলিটি।</p>
                <p>• আকর্ষণীয় মূল্য ও বিশেষ ছাড় প্যাকেজ।</p>

                <div className="p-4 bg-red-50 border border-red-200 rounded-xl mt-4">
                  <span className="font-bold text-red-900 block font-bangla-serif">বিজ্ঞাপন বিভাগ যোগাযোগ:</span>
                  <p className="text-red-700 mt-1">ফোন: {settings.phone}</p>
                  <p className="text-red-700">ইমেইল: ads@kurigramnews.com</p>
                </div>
              </div>

              {/* Advertising Inquiry Form */}
              <form onSubmit={handleContactSubmit} className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">বিজ্ঞাপন বুকিং ফর্ম</h4>
                {formSubmitted && (
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ধন্যবাদ! আমাদের প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">আপনার নাম / প্রতিষ্ঠানের নাম</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">ফোন নম্বর বা ইমেইল</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">বিজ্ঞাপনের বিবরণ / অবস্থান</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="হেডার ব্যানার / সাইডবার / স্পনসরড স্টোরি..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:border-red-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>তথ্য পাঠান</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {page === 'contact' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
              <h1 className="text-2xl md:text-3xl font-bold font-bangla-serif text-neutral-900">
                যোগাযোগ (Contact Us)
              </h1>
              <p className="text-xs text-neutral-500 mt-1">যেকোনো সংবাদ বিজ্ঞপ্তি, মতামত ও অনুসন্ধানের জন্য</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 text-xs text-neutral-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 text-sm font-bangla-serif">প্রধান কার্যালয়</strong>
                    <span>{settings.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900 text-sm font-bangla-serif">টেলিফোন ও মোবাইল</strong>
                    <span>{settings.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-sky-600 shrink-0" />
                  <div>
                    <strong className="block text-neutral-900 text-sm font-bangla-serif">ইমেইল</strong>
                    <span>{settings.email}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">বার্তা পাঠান</h4>
                {formSubmitted && (
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>আপনার বার্তা সফলভাবে গৃহীত হয়েছে!</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">নাম</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">ইমেইল বা ফোন</label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">বার্তা</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="আপনার বক্তব্য লিখুন..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded focus:outline-none focus:border-red-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>পাঠিয়ে দিন</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
