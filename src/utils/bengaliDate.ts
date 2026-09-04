export const toBengaliNumber = (num: number | string): string => {
  const bnDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
};

export const formatBengaliDate = (dateString?: string | Date): string => {
  const date = dateString ? new Date(dateString) : new Date();
  if (isNaN(date.getTime())) return '';

  const bnMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const bnDays = [
    'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
  ];

  const dayName = bnDays[date.getDay()];
  const day = toBengaliNumber(date.getDate());
  const month = bnMonths[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());

  let hours = date.getHours();
  const minutes = toBengaliNumber(String(date.getMinutes()).padStart(2, '0'));
  let period = 'সকাল';

  if (hours >= 12 && hours < 15) {
    period = 'দুপুর';
  } else if (hours >= 15 && hours < 18) {
    period = 'বিকাল';
  } else if (hours >= 18 && hours < 20) {
    period = 'সন্ধ্যা';
  } else if (hours >= 20 || hours < 5) {
    period = 'রাত';
  }

  const formattedHours = toBengaliNumber(hours % 12 === 0 ? 12 : hours % 12);

  return `${dayName}, ${day} ${month} ${year}, ${period} ${formattedHours}:${minutes}`;
};

export const formatBengaliDateSimple = (dateString?: string | Date): string => {
  const date = dateString ? new Date(dateString) : new Date();
  if (isNaN(date.getTime())) return '';

  const bnMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  const day = toBengaliNumber(date.getDate());
  const month = bnMonths[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());

  return `${day} ${month} ${year}`;
};

export const getTimeAgoBengali = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffSecs = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSecs < 60) return 'কিছুক্ষণ আগে';
  if (diffSecs < 3600) {
    const mins = Math.floor(diffSecs / 60);
    return `${toBengaliNumber(mins)} মিনিট আগে`;
  }
  if (diffSecs < 86400) {
    const hours = Math.floor(diffSecs / 3600);
    return `${toBengaliNumber(hours)} ঘণ্টা আগে`;
  }
  const days = Math.floor(diffSecs / 86400);
  if (days < 7) {
    return `${toBengaliNumber(days)} দিন আগে`;
  }
  return formatBengaliDateSimple(date);
};

export const calculateReadingTime = (text: string): string => {
  const words = text.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  const mins = Math.ceil(words / 180);
  return `${toBengaliNumber(mins)} মিনিট পাঠ`;
};
