import fs from 'fs';
import path from 'path';
import { Article, Category, Author, BreakingNews, Advertisement, MediaItem, SiteSettings, User, DashboardStats } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'news_database.json');

export interface DatabaseSchema {
  users: User[];
  categories: Category[];
  authors: Author[];
  articles: Article[];
  breaking_news: BreakingNews[];
  advertisements: Advertisement[];
  media: MediaItem[];
  site_settings: SiteSettings;
  article_views: { id: string; articleId: string; timestamp: string; ip?: string }[];
  article_shares: { id: string; articleId: string; platform: string; timestamp: string }[];
}

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'কুড়িগ্রাম জেলা', slug: 'kurigram', description: 'কুড়িগ্রাম জেলার সর্বশেষ খবর', order: 1 },
  { id: 'cat-2', name: 'বাংলাদেশ', slug: 'bangladesh', description: 'সারাদেশের শীর্ষ সংবাদ', order: 2 },
  { id: 'cat-3', name: 'আন্তর্জাতিক', slug: 'international', description: 'বিশ্বজুড়ে ঘটে যাওয়া ঘটনা', order: 3 },
  { id: 'cat-4', name: 'রাজনীতি', slug: 'politics', description: 'রাজনীতি ও নির্বাচন সম্পর্কিত খবর', order: 4 },
  { id: 'cat-5', name: 'খেলাধুলা', slug: 'sports', description: 'ক্রিকেট, ফুটবল ও অন্যান্য খেলা', order: 5 },
  { id: 'cat-6', name: 'প্রযুক্তি', slug: 'technology', description: 'বিজ্ঞান ও তথ্যপ্রযুক্তি সংবাদ', order: 6 },
  { id: 'cat-7', name: 'ব্যবসা', slug: 'business', description: 'অর্থনীতি ও বাণিজ্য বার্তা', order: 7 },
  { id: 'cat-8', name: 'বিনোদন', slug: 'entertainment', description: 'চলচ্চিত্র, নাটক ও সংস্কৃতি', order: 8 },
  { id: 'cat-9', name: 'শিক্ষা', slug: 'education', description: 'শিক্ষাঙ্গন ও পরীক্ষা বিষয়ক তথ্য', order: 9 },
  { id: 'cat-10', name: 'ইসলাম', slug: 'islamic', description: 'ধর্ম ও আধ্যাত্মিক জীবনধারা', order: 10 },
  { id: 'cat-11', name: 'লাইফস্টাইল', slug: 'lifestyle', description: 'স্বাস্থ্য, ভ্রমণ ও দৈনন্দিন জীবন', order: 11 },
  { id: 'cat-12', name: 'ভিডিও', slug: 'video', description: 'ভিডিও প্রতিবেদন ও ভিজুয়াল রিপোর্ট', order: 12 },
  { id: 'cat-13', name: 'ছবি', slug: 'photo', description: 'ফটোগ্যালারি ও ছবির গল্প', order: 13 },
];

const defaultAuthors: Author[] = [
  {
    id: 'auth-1',
    name: 'মো. আনিসুর রহমান',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'প্রধান সম্পাদক ও জ্যেষ্ঠ সাংবাদিক। উত্তরবঙ্গের কৃষি ও নদ-নদী বিষয়ক গবেষক ও লেখক।',
    designation: 'প্রধান সম্পাদক',
    articleCount: 12,
    socialLinks: { facebook: 'https://facebook.com', email: 'anisur@kurigramnews.com' }
  },
  {
    id: 'auth-2',
    name: 'ফারহানা ইয়াসমিন',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'কুড়িগ্রাম জেলা বিশেষ প্রতিনিধি। প্রান্তিক জনপদের উন্নয়ন, নারী ক্ষমতায়ন ও শিক্ষা বিষয়ক অনুসন্ধানী রিপোর্টার।',
    designation: 'বিশেষ প্রতিনিধি',
    articleCount: 8,
    socialLinks: { facebook: 'https://facebook.com', email: 'farhana@kurigramnews.com' }
  },
  {
    id: 'auth-3',
    name: 'তানভীর আহমেদ',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'ক্রীড়া ও তথ্যপ্রযুক্তি বিভাগীয় প্রধান। তরুণ প্রজন্মের উদ্যোক্তা ও ক্রীড়া বিশ্লেষণ নিয়ে নিয়মিত লেখেন।',
    designation: 'সহকারী সম্পাদক (ক্রীড়া ও টেক)',
    articleCount: 6,
    socialLinks: { facebook: 'https://facebook.com', twitter: 'https://twitter.com' }
  }
];

const defaultUsers: User[] = [
  {
    id: 'usr-1',
    name: 'সুপার অ্যাডমিন',
    email: 'saimshinha2@gmail.com',
    role: 'SUPER_ADMIN',
    password: 'Salman@123*-*',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-2',
    name: 'বার্তা সম্পাদক',
    email: 'editor@kurigramnews.com',
    role: 'EDITOR',
    password: 'editor123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-3',
    name: 'স্টাফ রিপোর্টার',
    email: 'reporter@kurigramnews.com',
    role: 'REPORTER',
    password: 'reporter123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date().toISOString()
  }
];

const defaultBreakingNews: BreakingNews[] = [
  {
    id: 'bn-1',
    title: 'কুড়িগ্রামে ধরলা নদীর তীরে আধুনিক পর্যটন স্পট ও ইকোপার্ক নির্মাণের নতুন মেগা প্রকল্প অনুমোদন',
    link: '/news/kurigram/dharla-river-ecopark-project',
    articleId: 'art-1',
    active: true,
    priority: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bn-2',
    title: 'চিলমারী নদী বন্দর থেকে সরাসরি মালবাহী নৌযান চলাচল শুরু, উত্তরবঙ্গের বাণিজ্যে নতুন দিগন্ত',
    link: '/news/kurigram/chilmari-river-port-expansion',
    articleId: 'art-2',
    active: true,
    priority: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bn-3',
    title: 'টি-টোয়েন্টি সিরিজে ইতিহাস গড়ল বাংলাদেশ, শেষ ওভারে রুদ্ধশ্বাস বিজয় অর্জন',
    link: '/news/sports/bangladesh-cricket-thrilling-series-win',
    articleId: 'art-5',
    active: true,
    priority: 3,
    createdAt: new Date().toISOString()
  }
];

const defaultArticles: Article[] = [
  {
    id: 'art-1',
    title: 'কুড়িগ্রামে ধরলা নদীর তীরে আধুনিক ইকোপার্ক ও পর্যটন স্পট নির্মাণে মেগা প্রকল্প অনুমোদন',
    subtitle: 'উত্তরাঞ্চলের অর্থনৈতিক রূপান্তর ও পর্যটন সম্ভাবনার নতুন দুয়ার উন্মোচন হতে যাচ্ছে',
    slug: 'dharla-river-ecopark-project',
    summary: 'কুড়িগ্রামের ধরলা নদীর অববাহিকায় আন্তর্জাতিক মানের ইকোপার্ক, ওয়াকওয়ে ও বিনোদন কেন্দ্র স্থাপনের অনুমোদন মিলেছে। এতে স্থানীয় হাজারো মানুষের কর্মসংস্থান সৃষ্টি হবে।',
    content: `<h2>কুড়িগ্রামের প্রকৃতি ও পর্যটনে নতুন দিগন্ত</h2>
<p>কুড়িগ্রাম জেলার প্রাকৃতিক সৌন্দর্য ও নদীমাতৃক আবহকে কাজে লাগিয়ে ধরলা নদীর তীরে একটি পূর্ণাঙ্গ পরিবেশবান্ধব ইকোপার্ক এবং নদী পর্যটন কেন্দ্র গড়ে তোলার উদ্যোগ নেওয়া হয়েছে। পানি সম্পদ মন্ত্রণালয় ও পর্যটন করপোরেশনের যৌথ উদ্যোগে এই মেগা প্রকল্পটি বাস্তবায়ন হবে।</p>
<blockquote>"এই প্রকল্পটি বাস্তবায়িত হলে শুধু কুড়িগ্রাম নয়, সমগ্র রংপুর বিভাগের অন্যতম দৃষ্টিনন্দন পর্যটন কেন্দ্রে পরিণত হবে ধরলা পাড়।" - জেলা প্রশাসক</blockquote>
<h3>প্রকল্পের প্রধান সুবিধাসমূহ:</h3>
<ul>
<li>ধরলা নদীর দুই তীরে ৫ কিলোমিটার ব্যাপী বৃক্ষরোপণ ও সুরক্ষিত ওয়াকওয়ে</li>
<li>নদী অববাহিকায় শিশুদের জন্য আধুনিক বিনোদন পার্ক ও মুক্তমঞ্চ</li>
<li>স্থানীয় তাঁত ও হস্তশিল্পীদের তৈরি পণ্য প্রদর্শনের স্থায়ী বাণিজ্য শেড</li>
<li>সৌরবিদ্যুৎচালিত লাইটিং এবং সার্বক্ষণিক সিসিটিভি নজরদারি ব্যবস্থা</li>
</ul>
<p>স্থানীয় ব্যবসায়ী ও সুশীল সমাজের প্রতিনিধিরা জানিয়েছেন, এই প্রকল্প বাস্তবায়নের মাধ্যমে কুড়িগ্রামের পর্যটন শিল্পে বৈপ্লবিক পরিবর্তন আসবে। আগামী অক্টোবর মাস থেকেই এর আনুষ্ঠানিক অবকাঠামো নির্মাণকাজ শুরু হবে বলে সংশ্লিষ্ট কর্তৃপক্ষ নিশ্চিত করেছে।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'ধরলা নদীর নয়নাভিরাম সূর্যাস্ত ও শান্ত জলরাশির দৃশ্যপট',
    categoryId: 'cat-1',
    categorySlug: 'kurigram',
    categoryName: 'কুড়িগ্রাম জেলা',
    authorId: 'auth-1',
    authorName: 'মো. আনিসুর রহমান',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorDesignation: 'প্রধান সম্পাদক',
    tags: ['কুড়িগ্রাম', 'ধরলা নদী', 'পর্যটন', 'উন্নয়ন প্রকল্প'],
    status: 'published',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    views: 4820,
    shares: 340,
    seoTitle: 'কুড়িগ্রামে ধরলা নদীর তীরে আধুনিক ইকোপার্ক প্রকল্প অনুমোদন | কুড়িগ্রাম নিউজ',
    metaDescription: 'কুড়িগ্রামের ধরলা নদীর তীরে আধুনিক ইকোপার্ক ও পর্যটন কেন্দ্র অনুমোদনের বিস্তারিত তথ্য পড়ুন কুড়িগ্রাম নিউজে।',
    keywords: ['কুড়িগ্রাম', 'ধরলা', 'ইকোপার্ক', 'উন্নয়ন'],
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art-2',
    title: 'চিলমারী নদী বন্দর থেকে সরাসরি মালবাহী নৌযান চলাচল শুরু, চাঙ্গা হচ্ছে আঞ্চলিক অর্থনীতি',
    subtitle: 'ভারত ও ভুটানের সাথে নৌপথের সহজ সংযোগ গড়ে উঠছে চিলমারীর মাধ্যমে',
    slug: 'chilmari-river-port-expansion',
    summary: 'ঐতিহাসিক চিলমারী নদী বন্দর পুনরুজ্জীবনের মাধ্যমে কুড়িগ্রাম সীমান্ত বাণিজ্য ও নদী পরিবহনে নতুন গতি সঞ্চার হয়েছে।',
    content: `<h2>ব্রহ্মপুত্রের তীরে বাণিজ্যের পুনর্জাগরণ</h2>
<p>ঐতিহাসিক চিলমারী নদী বন্দর থেকে আজ আনুষ্ঠানিকভাবে অভ্যন্তরীণ এবং আন্তর্জাতিক রুটে নিয়মিত মালবাহী নৌযান চলাচল শুরু হয়েছে। এর ফলে কুড়িগ্রামসহ উত্তরাঞ্চলের কৃষিজাত পণ্য, পাট, ভুট্টা ও কাঁচামাল অত্যন্ত সাশ্রয়ী খরচে দেশের অন্যান্য প্রান্তসহ প্রতিবেশী দেশগুলোতে রপ্তানির পথ সুগম হলো।</p>
<p>বিআইডব্লিউটিএ এবং কাস্টমস কর্মকর্তারা জানান, বন্দরের ড্রেজিং কাজ সফলভাবে শেষ হওয়ায় এখন সারা বছরই বড় আকারের কার্গো ভেসেল ভিড়তে পারবে।</p>
<blockquote>"চিলমারী বন্দর আমাদের কুড়িগ্রামের ঐতিহ্যবাহী প্রাণকেন্দ্র। আধুনিক সুযোগ-সুবিধা সম্বলিত এই বন্দর উত্তরাঞ্চলের পিছিয়ে পড়া অর্থনীতিতে প্রাণ ফিরিয়ে এনেছে।"</blockquote>
<h3>অর্থনৈতিক প্রভাব:</h3>
<p>স্থানীয় পরিবহন ও গুদামজাতকরণ খাতে প্রায় ৫ হাজার মানুষের সরাসরি কর্মসংস্থান তৈরি হচ্ছে। নদী পথের কারণে সড়কপথের তুলনায় পরিবহন ব্যয় প্রায় ৪০ শতাংশ হ্রাস পাবে।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'চিলমারী নদী বন্দরে মালবোঝাই কার্গো জাহাজ ও ব্যস্ত শ্রমিকরা',
    categoryId: 'cat-1',
    categorySlug: 'kurigram',
    categoryName: 'কুড়িগ্রাম জেলা',
    authorId: 'auth-2',
    authorName: 'ফারহানা ইয়াসমিন',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    authorDesignation: 'বিশেষ প্রতিনিধি',
    tags: ['কুড়িগ্রাম', 'চিলমারী', 'নদী বন্দর', 'বাণিজ্য'],
    status: 'published',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    views: 3210,
    shares: 195,
    seoTitle: 'চিলমারী নদী বন্দর থেকে মালবাহী নৌযান চলাচল শুরু | কুড়িগ্রাম নিউজ',
    metaDescription: 'চিলমারী নদী বন্দরের আধুনিকায়ন ও নৌবাণিজ্য সম্প্রসারণের বিস্তারিত রিপোর্ট।',
    keywords: ['চিলমারী', 'কুড়িগ্রাম', 'নদী বন্দর'],
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art-3',
    title: 'কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়ে নতুন গবেষণা ল্যাব উদ্বোধন, উন্নত ফসলের জাত উদ্ভাবনে সাফল্য',
    subtitle: 'চরের বালুকাময় মাটিতে অধিক ফলনশীল গম ও চিনাবাদাম চাষের গবেষণায় বিস্ময়কর ফলাফল',
    slug: 'kurigram-agricultural-university-research-lab',
    summary: 'কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়ের গবেষকরা চরাঞ্চলের প্রতিকূল আবহাওয়ায় টিকে থাকা বিশেষ জাতের গম ও চিনাবাদাম উদ্ভাবন করেছেন।',
    content: `<h2>চরাঞ্চলের কৃষিতে বিপ্লবের হাতছানি</h2>
<p>কুড়িগ্রামের দুর্গম চরাঞ্চলের অনুর্বর বালু মাটিতে উচ্চফলনশীল দানাশস্য চাষে এক অভাবনীয় সাফল্য দেখিয়েছেন কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়ের তরুণ গবেষক দল। বিশ্ববিদ্যালয়ের কেন্দ্রীয় গবেষণা গবেষণাগার উদ্বোধনের মাধ্যমে এ কার্যক্রম আরও গতিশীল করা হয়েছে।</p>
<p>উদ্বোধনী অনুষ্ঠানে উপাচার্য বলেন, "আমাদের লক্ষ্য উত্তরবঙ্গের কৃষকদের জলবায়ু সহনশীল উন্নত জাত উপহার দেওয়া, যাতে বন্যার পরেও তারা দ্রুত ফসল ঘরে তুলতে পারেন।"</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'কৃষি বিশ্ববিদ্যালয়ের আধুনিক ল্যাবে নতুন চারা পরীক্ষার দৃশ্য',
    categoryId: 'cat-9',
    categorySlug: 'education',
    categoryName: 'শিক্ষা',
    authorId: 'auth-2',
    authorName: 'ফারহানা ইয়াসমিন',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    authorDesignation: 'বিশেষ প্রতিনিধি',
    tags: ['কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়', 'শিক্ষা', 'কৃষি গবেষণা'],
    status: 'published',
    isBreaking: false,
    isFeatured: true,
    isTrending: false,
    views: 1980,
    shares: 88,
    seoTitle: 'কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়ে নতুন গবেষণা ল্যাব উদ্বোধন | কুড়িগ্রাম নিউজ',
    metaDescription: 'কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়ে উন্নত বীজ উদ্ভাবন ও ল্যাব উদ্বোধন নিয়ে বিস্তারিত প্রতিবেদন।',
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art-4',
    title: 'বৈদেশিক মুদ্রার রিজার্ভে ইতিবাচক ধারা, রেমিট্যান্স প্রবাহে নতুন রেকর্ড',
    subtitle: 'প্রবাসী আয়ে উল্লেখযোগ্য প্রবৃদ্ধি ও রপ্তানি আয়ে স্বস্তি ফিরছে ব্যাংক খাতে',
    slug: 'foreign-exchange-reserve-and-remittance-growth',
    summary: 'বাংলাদেশ ব্যাংকের সর্বশেষ তথ্যমতে বৈদেশিক মুদ্রার রিজার্ভে উন্নতি দেখা গেছে এবং বৈধ পথে রেমিট্যান্স পাঠানোর পরিমাণ এক মাসে ২০ শতাংশ বেড়েছে।',
    content: `<h2>অর্থনীতিতে স্বস্তির সুবাতাস</h2>
<p>বাংলাদেশ ব্যাংকের প্রকাশিত হালনাগাদ তথ্যে দেখা গেছে, বৈধ পথে রেমিট্যান্সের প্রবাহ বৃদ্ধি পাওয়ার কারণে বৈদেশিক মুদ্রার রিজার্ভে ইতিবাচক ধারা তৈরি হয়েছে। প্রবাসীদের প্রণোদনা প্রদান এবং ব্যাংকিং চ্যানেলের সহজীকরণের কারণে রেমিট্যান্স প্রবাহে এই লক্ষণীয় উল্লম্ফন ঘটেছে।</p>
<p>অর্থনীতিবিদদের মতে, বর্তমান গতিধারা অব্যাহত থাকলে আগামী মাসগুলোতে আমদানি দায় পরিশোধের চাপ অনেকটাই সহনীয় পর্যায়ে চলে আসবে।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'ব্যাংকিং খাতে স্থিতিশীলতা ও রেমিট্যান্স আহরণের গ্রাফ',
    categoryId: 'cat-7',
    categorySlug: 'business',
    categoryName: 'ব্যবসা',
    authorId: 'auth-1',
    authorName: 'মো. আনিসুর রহমান',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorDesignation: 'প্রধান সম্পাদক',
    tags: ['অর্থনীতি', 'রেমিট্যান্স', 'বাংলাদেশ ব্যাংক', 'ব্যবসা'],
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    views: 2450,
    shares: 112,
    publishedAt: new Date(Date.now() - 3600000 * 11).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art-5',
    title: 'টি-টোয়েন্টি সিরিজে ইতিহাস গড়ল টাইগাররা, শেষ ওভারের নাটকীয়তায় জয়',
    subtitle: 'অলরাউন্ডারদের দারুণ নৈপুণ্য এবং চাপের মুখে পেসারদের বুদ্ধিদীপ্ত বোলিংয়ে সাফল্য',
    slug: 'bangladesh-cricket-thrilling-series-win',
    summary: 'রুদ্ধশ্বাস ম্যাচে শেষ ওভারের শেষ দুই বলে উইকেট শিকার করে স্মরণীয় সিরিজ জয় নিশ্চিত করল বাংলাদেশ জাতীয় ক্রিকেট দল।',
    content: `<h2>মিরপুরে গ্যালারিভর্তি দর্শকের উল্লাস</h2>
<p>এক চরম নাটকীয় ম্যাচে শেষ ওভারের টানটান উত্তেজনায় প্রতিপক্ষকে হারিয়ে ৩ ম্যাচের টি-টোয়েন্টি সিরিজ ২-১ ব্যবধানে জিতে নিয়েছে বাংলাদেশ দল। দলের পক্ষে ব্যাট হাতে অর্ধশতক করার পাশাপাশি বল হাতেও গুরুত্বপূর্ণ উইকেট শিকার করেন ম্যান অব দ্য ম্যাচ।</p>
<p>ম্যাচ পরবর্তী সংবাদ সম্মেলনে অধিনায়ক বলেন, "আমরা দল হিসেবে ঐক্যবদ্ধভাবে লড়াই করেছি। সমর্থকদের অকৃত্রিম ভালোবাসাই আমাদের এই সাফল্যের প্রেরণা।"</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'সিরিজ জয়ের পর জাতীয় দলের খেলোয়াড়দের সম্মিলিত উচ্ছ্বাস',
    categoryId: 'cat-5',
    categorySlug: 'sports',
    categoryName: 'খেলাধুলা',
    authorId: 'auth-3',
    authorName: 'তানভীর আহমেদ',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorDesignation: 'সহকারী সম্পাদক (ক্রীড়া ও টেক)',
    tags: ['ক্রিকেট', 'টাইগার', 'টি-টোয়েন্টি', 'খেলাধুলা'],
    status: 'published',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    views: 5930,
    shares: 512,
    publishedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art-6',
    title: 'কৃত্রিম বুদ্ধিমত্তা ও বাংলা ভাষা: ইউনিকোডে নতুন নিউরাল মডেলের আত্মপ্রকাশ',
    subtitle: 'বাংলা টেক্সট প্রসেসিং ও কণ্ঠস্বর রূপান্তরে আন্তর্জাতিক মানের উন্মুক্ত মডেল উন্মোচিত',
    slug: 'bangla-ai-neural-model-launch',
    summary: 'বাংলাদেশি কম্পিউটার বিজ্ঞানীদের তৈরি করা সর্বাধুনিক এআই মডেল বাংলা ভাষার জটিল ব্যাকরণ ও উচ্চারণকে নিখুঁতভাবে অনুবাদ করতে সক্ষম।',
    content: `<h2>মাতৃভাষায় তথ্যপ্রযুক্তির নবজাগরণ</h2>
<p>বাংলা ভাষাভাষী কোটি মানুষের জন্য আধুনিক তথ্যপ্রযুক্তিকে সহজলভ্য করতে উন্মোচিত হলো প্রথম সম্পূর্ণ উন্মুক্ত কৃত্রিম বুদ্ধিমত্তাভিত্তিক বাংলা এলএলএম ও ভয়েস সিন্থেসিস মডেল। এটি স্বাস্থ্য, শিক্ষা এবং আইনি সেবায় সাধারণ নাগরিকের প্রশ্নের তাৎক্ষণিক ও সঠিক সমাধান দিতে পারে।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'কৃত্রিম বুদ্ধিমত্তা ও ডাটা ভিজ্যুয়ালাইজেশনের প্রতীকী চিত্র',
    categoryId: 'cat-6',
    categorySlug: 'technology',
    categoryName: 'প্রযুক্তি',
    authorId: 'auth-3',
    authorName: 'তানভীর আহমেদ',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    authorDesignation: 'সহকারী সম্পাদক (ক্রীড়া ও টেক)',
    tags: ['কৃত্রিম বুদ্ধিমত্তা', 'প্রযুক্তি', 'বাংলা এআই'],
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    views: 1840,
    shares: 94,
    publishedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art-7',
    title: 'নাগেশ্বরী ও ফুলবাড়ী সীমান্তে নিরাপত্তা জোরদার ও চোরাচালান প্রতিরোধে কঠোর নজরদারি',
    subtitle: 'বিজিবি ও স্থানীয় প্রশাসনের যৌথ উদ্যোগে সচেতনতামূলক মতবিনিময় সভা অনুষ্ঠিত',
    slug: 'nageshwari-fulbari-border-security',
    summary: 'কুড়িগ্রামের সীমান্ত উপজেলাগুলোতে মাদকদ্রব্য ও চোরাচালান প্রতিরোধে স্থানীয় জনপ্রতিনিধিদের সাথে বিজিবির বিশেষ বৈঠক অনুষ্ঠিত হয়েছে।',
    content: `<h2>সীমান্তে শান্তি ও শৃঙ্খলা রক্ষায় সমন্বিত উদ্যোগ</h2>
<p>কুড়িগ্রাম জেলার নাগেশ্বরী ও ফুলবাড়ী উপজেলার আন্তর্জাতিক সীমান্ত এলাকায় শান্তি-শৃঙ্খলা বজায় রাখা এবং অবৈধ অনুপ্রবেশ ও চোরাচালান সম্পূর্ণ নির্মূল করতে বিজিবির পক্ষ থেকে বিশেষ পেট্রোলিং শুরু করা হয়েছে।</p>
<p>স্থানীয় গণ্যমান্য ব্যক্তিবর্গ সীমান্তবাসীদের সচেতন করতে নিয়মিত সামাজিক সভা আয়োজনের আহ্বান জানান।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'সীমান্তবর্তী অঞ্চলের সচেতনতামূলক সভা ও নিরাপত্তা টহল',
    categoryId: 'cat-1',
    categorySlug: 'kurigram',
    categoryName: 'কুড়িগ্রাম জেলা',
    authorId: 'auth-2',
    authorName: 'ফারহানা ইয়াসমিন',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    authorDesignation: 'বিশেষ প্রতিনিধি',
    tags: ['কুড়িগ্রাম', 'সীমান্ত', 'আইনশৃঙ্খলা', 'নাগেশ্বরী'],
    status: 'published',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    views: 1420,
    shares: 42,
    publishedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art-8',
    title: 'কুড়িগ্রামের ঐতিহ্যবাহী শীতলপাটি ও বাঁশশিল্প জাতীয় স্বীকৃতি ও আন্তর্জাতিক বাজারে রপ্তানি',
    subtitle: 'প্রান্তিক নারী কারিগরদের পাশে দাঁড়িয়েছে ক্ষুদ্র ও কুটির শিল্প সংস্থা',
    slug: 'kurigram-traditional-handicrafts-export',
    summary: 'কুড়িগ্রামের ঐতিহ্যবাহী হস্তশিল্প শীতলপাটি ও পরিবেশবান্ধব বাঁশের সামগ্রী এখন দেশের গণ্ডি পেরিয়ে ইউরোপ ও আমেরিকায় রপ্তানি হচ্ছে।',
    content: `<h2>শিল্পের আলোয় আত্মনির্ভরতার জয়যাত্রা</h2>
<p>প্রজন্মের পর প্রজন্ম ধরে চলে আসা কুড়িগ্রামের ঐতিহ্যবাহী শীতলপাটি এবং বাঁশের সৌখিন তৈজসপত্র এখন বিশ্ববাজারে নন্দিত হচ্ছে। জেলা প্রশাসনের সহায়তায় গঠিত বিশেষ সমবায় সমিতির মাধ্যমে কারিগররা সরাসরি ন্যায্যমূল্য পাচ্ছেন।</p>
<p>কারিগররা জানান, প্লাস্টিকের বিকল্প হিসেবে পরিবেশবান্ধব এই পণ্যের চাহিদা দিনে দিনে বৃদ্ধি পাচ্ছে।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'নিখুঁত দক্ষতায় ঐতিহ্যবাহী শীতলপাটি ও কারুশিল্প বোনার দৃশ্য',
    categoryId: 'cat-11',
    categorySlug: 'lifestyle',
    categoryName: 'লাইফস্টাইল',
    authorId: 'auth-2',
    authorName: 'ফারহানা ইয়াসমিন',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    authorDesignation: 'বিশেষ প্রতিনিধি',
    tags: ['কুড়িগ্রাম', 'হস্তশিল্প', 'শীতলপাটি', 'লাইফস্টাইল'],
    status: 'published',
    isBreaking: false,
    isFeatured: true,
    isTrending: false,
    views: 2110,
    shares: 130,
    publishedAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'art-9',
    title: 'ভিডিও প্রতিবেদন: তিস্তা মহাপরিকল্পনা বাস্তবায়নে চরাঞ্চলবাসীর দীর্ঘ প্রতীক্ষা ও বর্তমান বাস্তবতা',
    subtitle: 'নদীভাঙন রোধ ও কোটি মানুষের জীবনমান বদলে দেওয়ার বিশেষ অন-গ্রাউন্ড ভিডিও রিপোর্ট',
    slug: 'teesta-river-mega-project-video-report',
    summary: 'তিস্তা নদীর চরাঞ্চলে সরেজমিনে গিয়ে স্থানীয় কৃষকদের কান্না ও স্বপ্নের গল্প তুলে ধরেছে কুড়িগ্রাম নিউজ বিশেষ ক্যামেরা টিম।',
    content: `<h2>সরেজমিন বিশেষ ভিডিও প্রতিবেদন</h2>
<p>তিস্তা নদীর ভাঙনে প্রতি বছর শত শত বসতভিটা ও ফসলি জমি নদীগর্ভে বিলীন হয়ে যায়। দীর্ঘদিনের দাবি তিস্তা মেগা প্রকল্প বাস্তবায়ন হলে উত্তরবঙ্গের পাঁচ জেলার অর্থনীতি ঘুরে দাঁড়াবে। দেখুন কুড়িগ্রাম নিউজের বিশেষ গ্রাউন্ড রিপোর্ট।</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'নদীভাঙনের মুখোমুখি চরাঞ্চলের মানুষের টিকে থাকার লড়াই',
    categoryId: 'cat-12',
    categorySlug: 'video',
    categoryName: 'ভিডিও',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    authorId: 'auth-1',
    authorName: 'মো. আনিসুর রহমান',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    authorDesignation: 'প্রধান সম্পাদক',
    tags: ['ভিডিও', 'তিস্তা নদী', 'কুড়িগ্রাম', 'নদীভাঙন'],
    status: 'published',
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    views: 3890,
    shares: 240,
    publishedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultAdvertisements: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'শীর্ষ ব্যানার বিজ্ঞাপন - কুড়িগ্রাম কৃষি ব্যাংক ও সঞ্চয় সেবা',
    location: 'top_banner',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
    targetUrl: 'https://example.com/ad',
    active: true,
    impressions: 12400,
    clicks: 450,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad-2',
    title: 'সাইডবার বিজ্ঞাপন - কুড়িগ্রাম আধুনিক চক্ষু ও ডায়াগনস্টিক সেন্টার',
    location: 'sidebar',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
    targetUrl: 'https://example.com/hospital',
    active: true,
    impressions: 8900,
    clicks: 310,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad-3',
    title: 'হোমপেজ মিডল বিজ্ঞাপন - উত্তরবঙ্গ সৌরশক্তি ও কৃষি পাম্প সলিউশন',
    location: 'homepage_mid',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
    targetUrl: 'https://example.com/solar',
    active: true,
    impressions: 6500,
    clicks: 220,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad-4',
    title: 'নিবন্ধের মধ্যবর্তী বিজ্ঞাপন - স্পন্সরড কনটেন্ট ও ক্যারিয়ার কোর্স',
    location: 'article_mid',
    type: 'html',
    htmlCode: '<div class="p-6 bg-gradient-to-r from-red-700 to-amber-600 text-white rounded-xl shadow-md text-center"><span class="inline-block px-3 py-1 bg-white/20 text-xs uppercase tracking-wider rounded-full mb-2 font-semibold">বিজ্ঞাপন</span><h4 class="text-xl font-bold mb-1">কুড়িগ্রাম আইটি একাডেমি: ফ্রিল্যান্সিং ও ওয়েব ডেভেলপমেন্ট কোর্স</h4><p class="text-sm text-red-100 mb-3">অভিজ্ঞ মেন্টর দ্বারা সরাসরি ক্লাস ও ১০০% প্রজেক্টভিত্তিক প্রশিক্ষণ।</p><a href="#" class="inline-block px-5 py-2 bg-white text-red-700 font-bold rounded-lg text-sm hover:bg-neutral-100 transition">ভর্তি তথ্য জানুন &rarr;</a></div>',
    active: true,
    impressions: 4300,
    clicks: 180,
    createdAt: new Date().toISOString()
  }
];

const defaultMedia: MediaItem[] = [
  {
    id: 'med-1',
    name: 'ধরলা নদী ও নৌকা',
    url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    caption: 'ধরলা নদীর জলরাশি ও নৌকার দৃশ্য',
    size: '1.2 MB',
    mimeType: 'image/jpeg',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med-2',
    name: 'চিলমারী নদী বন্দর',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    caption: 'চিলমারী নদী বন্দরে মালবাহী জাহাজ',
    size: '1.8 MB',
    mimeType: 'image/jpeg',
    createdAt: new Date().toISOString()
  },
  {
    id: 'med-3',
    name: 'বাংলাদেশ ক্রিকেট উল্লাস',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    caption: 'ক্রিকেট দলের বাঁধভাঙা আনন্দ',
    size: '2.1 MB',
    mimeType: 'image/jpeg',
    createdAt: new Date().toISOString()
  }
];

const defaultSiteSettings: SiteSettings = {
  siteName: 'কুড়িগ্রাম নিউজ',
  siteSlogan: 'সত্য ও বস্তুনিষ্ঠ সংবাদের বিশ্বস্ত ঠিকানা',
  logoUrl: '',
  faviconUrl: '',
  description: 'কুড়িগ্রাম, উত্তরবঙ্গ ও বাংলাদেশের সর্বশেষ খবর, বিশ্লেষণ, রাজনীতি, কৃষি, অর্থনীতি ও আন্তর্জাতিক সংবাদ নিয়ে ২৪ ঘণ্টা আপডেট বাংলা অনলাইন সংবাদপত্র।',
  phone: '+৮৮০ ১৭০০-১২২৩৩৪',
  email: 'editor@kurigramnews.com',
  address: 'প্রেস ক্লাব ভবন (৩য় তলা), কলেজ রোড, কুড়িগ্রাম-৫৬০০, বাংলাদেশ',
  editorName: 'মো. আনিসুর রহমান',
  publisherName: 'কুড়িগ্রাম মিডিয়া লিমিটেড',
  socialLinks: {
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/8801700122334',
    twitter: 'https://twitter.com'
  },
  footerText: '© ২০২৬ কুড়িগ্রাম নিউজ। সর্বস্বত্ব সংরক্ষিত। অনুমতি ছাড়া এই ওয়েবসাইটের কোনো লেখা বা ছবি প্রকাশ দণ্ডনীয় অপরাধ।',
  googleAnalyticsId: 'G-KURIGRAM2026',
  adsensePublisherId: 'pub-908682295380',
  defaultSeoTitle: 'কুড়িগ্রাম নিউজ | সত্য ও বস্তুনিষ্ঠ সংবাদের বিশ্বস্ত ঠিকানা',
  defaultMetaDesc: 'কুড়িগ্রাম জেলার শীর্ষ অনলাইন পত্রিকা। সর্বশেষ ব্রেকিং নিউজ, রাজনীতি, শিক্ষা ও উন্নয়ন সমাচার।',
  breakingTickerEnabled: true
};

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure admin user has updated email and password
        const admin = this.data.users?.find(u => u.id === 'usr-1' || u.role === 'SUPER_ADMIN');
        if (admin) {
          admin.email = 'saimshinha2@gmail.com';
          admin.password = 'Salman@123*-*';
          this.save();
        }
      } catch (err) {
        console.error('Error reading db file, re-initializing default data:', err);
        this.data = this.initDefaultData();
        this.save();
      }
    } else {
      this.data = this.initDefaultData();
      this.save();
    }
  }

  private initDefaultData(): DatabaseSchema {
    return {
      users: defaultUsers,
      categories: defaultCategories,
      authors: defaultAuthors,
      articles: defaultArticles,
      breaking_news: defaultBreakingNews,
      advertisements: defaultAdvertisements,
      media: defaultMedia,
      site_settings: defaultSiteSettings,
      article_views: [],
      article_shares: []
    };
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db file:', err);
    }
  }

  // Articles
  getArticles(params?: {
    categorySlug?: string;
    tag?: string;
    search?: string;
    status?: string;
    isFeatured?: boolean;
    isTrending?: boolean;
    isBreaking?: boolean;
    limit?: number;
    offset?: number;
  }): { articles: Article[]; total: number } {
    let list = [...this.data.articles];

    if (params?.status) {
      list = list.filter(a => a.status === params.status);
    } else {
      // By default for public website, only published
      list = list.filter(a => a.status === 'published');
    }

    if (params?.categorySlug) {
      list = list.filter(a => a.categorySlug === params.categorySlug);
    }

    if (params?.tag) {
      const t = params.tag.toLowerCase();
      list = list.filter(a => a.tags?.some(tag => tag.toLowerCase().includes(t)));
    }

    if (params?.isFeatured !== undefined) {
      list = list.filter(a => a.isFeatured === params.isFeatured);
    }

    if (params?.isTrending !== undefined) {
      list = list.filter(a => a.isTrending === params.isTrending);
    }

    if (params?.isBreaking !== undefined) {
      list = list.filter(a => a.isBreaking === params.isBreaking);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) ||
        (a.summary && a.summary.toLowerCase().includes(q)) ||
        a.content.toLowerCase().includes(q) ||
        a.categoryName.toLowerCase().includes(q) ||
        a.authorName.toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort by publishedAt desc
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const total = list.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || total;
    const paginated = list.slice(offset, offset + limit);

    return { articles: paginated, total };
  }

  getAllArticlesAdmin(): Article[] {
    return [...this.data.articles].sort(
      (a, b) => new Date(b.updatedAt || b.publishedAt).getTime() - new Date(a.updatedAt || a.publishedAt).getTime()
    );
  }

  getArticleBySlug(slug: string): Article | undefined {
    return this.data.articles.find(a => a.slug === slug);
  }

  getArticleById(id: string): Article | undefined {
    return this.data.articles.find(a => a.id === id);
  }

  createArticle(articleData: Partial<Article>): Article {
    const id = `art-${Date.now()}`;
    const slug = articleData.slug || 
      (articleData.title ? articleData.title.toLowerCase().replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, '-').replace(/^-+|-+$/g, '') : `news-${Date.now()}`);

    const newArticle: Article = {
      id,
      title: articleData.title || 'শিরোনামহীন সংবাদ',
      subtitle: articleData.subtitle || '',
      slug,
      content: articleData.content || '',
      summary: articleData.summary || '',
      featuredImage: articleData.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
      imageCaption: articleData.imageCaption || '',
      categoryId: articleData.categoryId || 'cat-1',
      categorySlug: articleData.categorySlug || 'kurigram',
      categoryName: articleData.categoryName || 'কুড়িগ্রাম জেলা',
      authorId: articleData.authorId || 'auth-1',
      authorName: articleData.authorName || 'মো. আনিসুর রহমান',
      authorAvatar: articleData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      authorDesignation: articleData.authorDesignation || 'প্রধান সম্পাদক',
      tags: articleData.tags || ['কুড়িগ্রাম', 'সংবাদ'],
      status: articleData.status || 'published',
      isBreaking: Boolean(articleData.isBreaking),
      isFeatured: Boolean(articleData.isFeatured),
      isTrending: Boolean(articleData.isTrending),
      views: 0,
      shares: 0,
      seoTitle: articleData.seoTitle || articleData.title,
      metaDescription: articleData.metaDescription || articleData.summary,
      keywords: articleData.keywords || [],
      videoUrl: articleData.videoUrl || '',
      publishedAt: articleData.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.articles.unshift(newArticle);

    // If it's breaking, auto add or update breaking news
    if (newArticle.isBreaking) {
      this.syncBreakingItemForArticle(newArticle);
    }

    this.save();
    return newArticle;
  }

  updateArticle(id: string, updates: Partial<Article>): Article | null {
    const index = this.data.articles.findIndex(a => a.id === id);
    if (index === -1) return null;

    const existing = this.data.articles[index];
    const updated: Article = {
      ...existing,
      ...updates,
      id: existing.id,
      updatedAt: new Date().toISOString()
    };

    this.data.articles[index] = updated;

    if (updated.isBreaking) {
      this.syncBreakingItemForArticle(updated);
    } else {
      // Remove from breaking list if was breaking
      this.data.breaking_news = this.data.breaking_news.filter(bn => bn.articleId !== id);
    }

    this.save();
    return updated;
  }

  deleteArticle(id: string): boolean {
    const before = this.data.articles.length;
    this.data.articles = this.data.articles.filter(a => a.id !== id);
    this.data.breaking_news = this.data.breaking_news.filter(bn => bn.articleId !== id);
    const deleted = this.data.articles.length < before;
    if (deleted) this.save();
    return deleted;
  }

  incrementView(id: string): number {
    const article = this.data.articles.find(a => a.id === id);
    if (article) {
      article.views = (article.views || 0) + 1;
      this.data.article_views.push({
        id: `vw-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        articleId: id,
        timestamp: new Date().toISOString()
      });
      this.save();
      return article.views;
    }
    return 0;
  }

  incrementShare(id: string, platform: string): number {
    const article = this.data.articles.find(a => a.id === id);
    if (article) {
      article.shares = (article.shares || 0) + 1;
      this.data.article_shares.push({
        id: `sh-${Date.now()}`,
        articleId: id,
        platform,
        timestamp: new Date().toISOString()
      });
      this.save();
      return article.shares;
    }
    return 0;
  }

  // Breaking News
  getBreakingNews(): BreakingNews[] {
    return [...this.data.breaking_news]
      .filter(bn => bn.active)
      .sort((a, b) => a.priority - b.priority);
  }

  getAllBreakingNewsAdmin(): BreakingNews[] {
    return [...this.data.breaking_news].sort((a, b) => a.priority - b.priority);
  }

  addBreakingNews(item: Partial<BreakingNews>): BreakingNews {
    const newItem: BreakingNews = {
      id: `bn-${Date.now()}`,
      title: item.title || '',
      link: item.link || '',
      articleId: item.articleId,
      active: item.active !== undefined ? item.active : true,
      priority: item.priority || (this.data.breaking_news.length + 1),
      createdAt: new Date().toISOString()
    };
    this.data.breaking_news.unshift(newItem);
    this.save();
    return newItem;
  }

  updateBreakingNews(id: string, updates: Partial<BreakingNews>): BreakingNews | null {
    const item = this.data.breaking_news.find(bn => bn.id === id);
    if (!item) return null;
    Object.assign(item, updates);
    this.save();
    return item;
  }

  deleteBreakingNews(id: string): boolean {
    const initial = this.data.breaking_news.length;
    this.data.breaking_news = this.data.breaking_news.filter(bn => bn.id !== id);
    const success = this.data.breaking_news.length < initial;
    if (success) this.save();
    return success;
  }

  reorderBreakingNews(orderedIds: string[]): BreakingNews[] {
    orderedIds.forEach((id, index) => {
      const item = this.data.breaking_news.find(bn => bn.id === id);
      if (item) {
        item.priority = index + 1;
      }
    });
    this.save();
    return this.getAllBreakingNewsAdmin();
  }

  private syncBreakingItemForArticle(article: Article) {
    const existing = this.data.breaking_news.find(bn => bn.articleId === article.id);
    if (existing) {
      existing.title = article.title;
      existing.active = article.isBreaking;
      existing.link = `/news/${article.categorySlug}/${article.slug}`;
    } else {
      this.data.breaking_news.unshift({
        id: `bn-${Date.now()}`,
        title: article.title,
        link: `/news/${article.categorySlug}/${article.slug}`,
        articleId: article.id,
        active: true,
        priority: 1,
        createdAt: new Date().toISOString()
      });
    }
  }

  // Categories
  getCategories(): Category[] {
    return this.data.categories.map(c => {
      const count = this.data.articles.filter(a => a.categoryId === c.id && a.status === 'published').length;
      return { ...c, articleCount: count };
    }).sort((a, b) => a.order - b.order);
  }

  createCategory(cat: Partial<Category>): Category {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: cat.name || 'নতুন ক্যাটাগরি',
      slug: cat.slug || `cat-${Date.now()}`,
      description: cat.description || '',
      order: cat.order || (this.data.categories.length + 1)
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const cat = this.data.categories.find(c => c.id === id);
    if (!cat) return null;
    Object.assign(cat, updates);
    this.save();
    return cat;
  }

  deleteCategory(id: string): boolean {
    const count = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    const ok = this.data.categories.length < count;
    if (ok) this.save();
    return ok;
  }

  // Authors
  getAuthors(): Author[] {
    return this.data.authors.map(a => {
      const count = this.data.articles.filter(art => art.authorId === a.id && art.status === 'published').length;
      return { ...a, articleCount: count };
    });
  }

  createAuthor(author: Partial<Author>): Author {
    const newAuthor: Author = {
      id: `auth-${Date.now()}`,
      name: author.name || 'সাংবাদিক নাম',
      photo: author.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: author.bio || '',
      designation: author.designation || 'রিপোর্টার',
      socialLinks: author.socialLinks || {}
    };
    this.data.authors.push(newAuthor);
    this.save();
    return newAuthor;
  }

  updateAuthor(id: string, updates: Partial<Author>): Author | null {
    const author = this.data.authors.find(a => a.id === id);
    if (!author) return null;
    Object.assign(author, updates);
    this.save();
    return author;
  }

  deleteAuthor(id: string): boolean {
    const count = this.data.authors.length;
    this.data.authors = this.data.authors.filter(a => a.id !== id);
    const ok = this.data.authors.length < count;
    if (ok) this.save();
    return ok;
  }

  // Advertisements
  getAds(location?: string): Advertisement[] {
    let ads = [...this.data.advertisements];
    if (location) {
      ads = ads.filter(a => a.location === location && a.active);
    }
    return ads;
  }

  getAllAdsAdmin(): Advertisement[] {
    return [...this.data.advertisements];
  }

  createAd(ad: Partial<Advertisement>): Advertisement {
    const newAd: Advertisement = {
      id: `ad-${Date.now()}`,
      title: ad.title || 'নতুন বিজ্ঞাপন',
      location: ad.location || 'sidebar',
      type: ad.type || 'image',
      imageUrl: ad.imageUrl || '',
      targetUrl: ad.targetUrl || '',
      htmlCode: ad.htmlCode || '',
      active: ad.active !== undefined ? ad.active : true,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString()
    };
    this.data.advertisements.push(newAd);
    this.save();
    return newAd;
  }

  updateAd(id: string, updates: Partial<Advertisement>): Advertisement | null {
    const ad = this.data.advertisements.find(a => a.id === id);
    if (!ad) return null;
    Object.assign(ad, updates);
    this.save();
    return ad;
  }

  deleteAd(id: string): boolean {
    const count = this.data.advertisements.length;
    this.data.advertisements = this.data.advertisements.filter(a => a.id !== id);
    const ok = this.data.advertisements.length < count;
    if (ok) this.save();
    return ok;
  }

  // Media
  getMedia(): MediaItem[] {
    return [...this.data.media].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createMedia(item: Partial<MediaItem>): MediaItem {
    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      name: item.name || 'ছবি',
      url: item.url || '',
      caption: item.caption || '',
      size: item.size || '1.0 MB',
      mimeType: item.mimeType || 'image/jpeg',
      createdAt: new Date().toISOString()
    };
    this.data.media.unshift(newItem);
    this.save();
    return newItem;
  }

  deleteMedia(id: string): boolean {
    const count = this.data.media.length;
    this.data.media = this.data.media.filter(m => m.id !== id);
    const ok = this.data.media.length < count;
    if (ok) this.save();
    return ok;
  }

  // Site Settings
  getSettings(): SiteSettings {
    return { ...this.data.site_settings };
  }

  updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.site_settings = {
      ...this.data.site_settings,
      ...updates
    };
    this.save();
    return this.data.site_settings;
  }

  // Users & Auth
  getUsers(): User[] {
    return this.data.users.map(u => ({ ...u }));
  }

  login(email: string, password?: string): User | null {
    const user = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    if (user.password && password && user.password !== password) {
      return null;
    }
    return user;
  }

  createUser(user: Partial<User>): User {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: user.name || 'নতুন ইউজার',
      email: user.email || `user${Date.now()}@kurigramnews.com`,
      role: user.role || 'REPORTER',
      password: user.password || 'user123',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const u = this.data.users.find(usr => usr.id === id);
    if (!u) return null;
    Object.assign(u, updates);
    this.save();
    return u;
  }

  deleteUser(id: string): boolean {
    // Prevent deleting the primary super admin
    if (id === 'usr-1') return false;
    const len = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    const ok = this.data.users.length < len;
    if (ok) this.save();
    return ok;
  }

  // Dashboard Stats
  getStats(): DashboardStats {
    const totalArticles = this.data.articles.length;
    const publishedArticles = this.data.articles.filter(a => a.status === 'published').length;
    const draftArticles = this.data.articles.filter(a => a.status === 'draft').length;
    const breakingNewsCount = this.data.breaking_news.filter(bn => bn.active).length;
    const totalViews = this.data.articles.reduce((acc, a) => acc + (a.views || 0), 0);
    const totalShares = this.data.articles.reduce((acc, a) => acc + (a.shares || 0), 0);

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const todayViews = this.data.article_views.filter(v => v.timestamp.startsWith(todayStr)).length || Math.floor(totalViews * 0.15);

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      breakingNewsCount,
      totalViews,
      totalShares,
      totalCategories: this.data.categories.length,
      totalAuthors: this.data.authors.length,
      totalAds: this.data.advertisements.length,
      todayViews
    };
  }
}

export const db = new DatabaseStore();
