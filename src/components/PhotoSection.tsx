import React, { useState } from 'react';
import { Camera, X, ZoomIn } from 'lucide-react';

interface PhotoItem {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  date: string;
}

export const PhotoSection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const photos: PhotoItem[] = [
    {
      id: 'p1',
      title: 'ধরলা নদীর বুকে শরতের শুভ্র কাশফুল ও রাখাল বালক',
      imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      caption: 'কুড়িগ্রামের ধরলা নদীর চরে ফুটে ওঠা শরতের শুভ্র কাশফুল ও শান্ত জলরাশি।',
      date: '৪ সেপ্টেম্বর ২০২৬'
    },
    {
      id: 'p2',
      title: 'চিলমারী নদী বন্দরের প্রাচীন ঘাট ও পণ্যবাহী নৌকা',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      caption: 'ব্রহ্মপুত্র নদের ওপর ঐতিহাসিক চিলমারী ঘাটের কর্মব্যস্ত সকালের চিত্র।',
      date: '৩ সেপ্টেম্বর ২০২৬'
    },
    {
      id: 'p3',
      title: 'কুড়িগ্রামের ঐতিহ্যবাহী শীতলপাটি বুননে ব্যস্ত নারী কারিগর',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      caption: 'গ্রামের ঘরে বসে নিপুণ হাতে শীতলপাটি তৈরি করছেন কুটির শিল্পীরা।',
      date: '২ সেপ্টেম্বর ২০২৬'
    },
    {
      id: 'p4',
      title: 'তিস্তা নদীর সূর্যোদয় ও কুয়াশাচ্ছন্ন মায়াবী সকাল',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      caption: 'ভোরের আলোয় নদীর কুয়াশাভেদ করে জেগে ওঠা উত্তরবঙ্গের শান্ত জনপদ।',
      date: '১ সেপ্টেম্বর ২০২৬'
    }
  ];

  return (
    <section className="my-8">
      <div className="flex items-center justify-between border-b-2 border-red-600 pb-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-600 rounded-xs"></span>
          <h3 className="text-xl font-black font-bangla-serif text-gray-900 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-red-600" /> ছবি সংবাদ ও গ্যালারি
          </h3>
        </div>
        <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">লেন্সের চোখে কুড়িগ্রাম</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            className="group relative cursor-pointer aspect-[4/3] rounded-lg overflow-hidden shadow-xs border border-gray-200/80 bg-gray-100"
          >
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition flex flex-col justify-end p-3">
              <span className="text-white text-xs font-semibold font-bangla-serif line-clamp-2 leading-snug">
                {item.title}
              </span>
              <span className="text-[10px] text-gray-300 mt-1 flex items-center justify-between">
                <span>{item.date}</span>
                <ZoomIn className="w-3.5 h-3.5 text-white/80" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-gray-900 text-white rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-800 text-white rounded-full hover:bg-red-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
              <img 
                src={selectedPhoto.imageUrl} 
                alt={selectedPhoto.title} 
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>
            <div className="p-5 bg-gray-900 border-t border-gray-800">
              <h4 className="text-lg font-bold font-bangla-serif mb-1">{selectedPhoto.title}</h4>
              <p className="text-sm text-gray-300">{selectedPhoto.caption}</p>
              <span className="text-xs text-gray-500 mt-2 block">{selectedPhoto.date}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
