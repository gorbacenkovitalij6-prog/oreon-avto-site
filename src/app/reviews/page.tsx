'use client';

import { Button } from '@/components/ui/button';
import { Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { supabase, type VideoReview } from '@/lib/supabase';
import { ContactDialog } from '@/components/ContactDialog';

export default function ReviewsPage() {
  const [videoReviews, setVideoReviews] = useState<VideoReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  useEffect(() => {
    fetchVideoReviews();
  }, []);

  async function fetchVideoReviews() {
    try {
      const { data, error } = await supabase
        .from('video_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideoReviews(data || []);
    } catch (error) {
      console.error('Error fetching video reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  // Функция для получения embed URL
  const getEmbedUrl = (videoUrl: string, platform: 'rutube' | 'youtube') => {
    if (platform === 'rutube') {
      // Rutube URL format: https://rutube.ru/video/ID/
      const videoId = videoUrl.split('/video/')[1]?.split('/')[0];
      if (!videoId) {
        return '';
      }
      return `https://rutube.ru/play/embed/${videoId}`;
    } else {
      // YouTube URL format: https://youtube.com/watch?v=ID
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      if (!videoId) {
        return '';
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }
  };

  const textReviews = [
    {
      name: "Павел Д.",

      text: "Все прошло на высшем уровне. Доставили быстро, авто в идеальном состоянии, документы оформлены без задержек. Приятно, когда люди следуют выполненным сроках!",
      carImage: "https://i.ibb.co/yB7vDp2c/photo-2026-01-14-12-40-23.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Екатерина Л.",

      text: "Приехала на свою новую машину, как только планировала! Довольна качеством и состоянием авто, а также отличным сервисом и четкостью на всех этапах. Все организовано быстро и удобно.",
      carImage: "https://i.ibb.co/qMSXBdFL/photo-2026-01-14-12-40-43.jpg",
      platform: "2gis",
      rating: 4.9
    },
    {
      name: "Максим Р.",

      text: "Решил купить авто из Европы и не ошибся. Все расходы и этапы были прозрачны, заранее, и автомобиль доставили вовремя. Очень рад, что выбрал вас!",
      carImage: "https://i.ibb.co/4GYrgJb/photo-2026-01-14-12-40-55.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Виктор С.",

      text: "Очень рекомендую этот способ покупки! Автомобиль пригнали в отличном виде, документы в порядке. Профессиональная команда, с которой приятно работать.",
      carImage: "https://i.ibb.co/j9jbH9vJ/photo-2026-01-19-12-55-04.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Лариса Д.",

      text: "Приехал отличный автомобиль в точном расстояние. Как и обещали, проверка была быстрой. Весь процесс прошел гладко и без каких либо сюрпризов.",
      carImage: "https://i.ibb.co/SDSkFmCB/photo-2026-01-19-13-00-11.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Анна К.",

      text: "Спасибо за честность и профессионализм! Машина соответствует всем заявленным характеристикам. Процесс был прозрачным от начала до конца.",
      carImage: "https://i.ibb.co/dJfRt4YZ/photo-2026-01-26-17-10-30.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Дмитрий В.",

      text: "Очень доволен качеством подбора и скоростью доставки. Цена действительно выгоднее, чем у дилеров. Получил именно то, что хотел!",
      carImage: "https://i.ibb.co/GLyBZ69/photo-2026-01-26-17-33-52.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Сергей М.",

      text: "Отличный сервис! Помогли с выбором, организовали доставку, оформили все документы. Рекомендую всем, кто хочет купить авто из Европы.",
      carImage: "https://i.ibb.co/sJssx8HP/photo-2026-01-27-15-36-53.jpg",
      platform: "yandex",
      rating: 4.9
    },
    {
      name: "Алексей Т.",

      text: "Машина пришла в идеальном состоянии! Все как в описании. Спасибо за профессиональную работу и внимание к деталям.",
      carImage: "https://i.ibb.co/HLsdvDM2/photo-2026-01-30-13-27-51.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Игорь П.",

      text: "Весь процесс занял меньше месяца. Отличная поддержка на всех этапах. Автомобиль полностью соответствует ожиданиям!",
      carImage: "https://i.ibb.co/TxzYwpTG/photo-2026-01-30-13-27-52.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Анна В.",

      text: "Качество подбора на высоте, все документы в порядке. Очень доволен сотрудничеством! Автомобиль мечты получен.",
      carImage: "https://i.ibb.co/JWkRjMk2/photo-2026-02-05-13-08-15-2.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Андрей Л.",

      text: "Профессиональный подход, честные цены, быстрая доставка. Всё на высшем уровне! Буду рекомендовать друзьям.",
      carImage: "https://i.ibb.co/Q3qS7MMH/photo-2026-02-05-13-08-15.jpg",
      platform: "yandex",
      rating: 4.9
    },
    {
      name: "Ельвира К.",

      text: "Получил автомобиль точно в срок. Вся информация была предоставлена заранее. Никаких скрытых платежей. Отличная работа!",
      carImage: "https://i.ibb.co/h1wMxhr0/photo-2026-02-12-13-08-08.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Владимир Б.",

      text: "Очень доволен покупкой! Автомобиль в отличном состоянии, все документы оформлены правильно. Спасибо за качественную работу!",
      carImage: "https://i.ibb.co/213tpzZq/photo-2026-02-12-13-08-12.jpg",
      platform: "yandex",
      rating: 5.0
    },
    {
      name: "Константин Д.",

      text: "Приятно удивлен качеством сервиса. Весь процесс был прозрачным и понятным. Автомобиль соответствует всем ожиданиям!",
      carImage: "https://i.ibb.co/4BKx44M/photo-2026-02-03-13-15-49.jpg",
      platform: "2gis",
      rating: 5.0
    },
    {
      name: "Николай П.",

      text: "Превосходный опыт покупки! Команда профессионалов сделала всё быстро и качественно. Автомобиль мечты теперь у меня!",
      carImage: "https://i.ibb.co/DDf4dP2V/photo-2026-02-12-13-10-04.jpg",
      platform: "2gis",
      rating: 5.0
    }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#BF360C] px-6 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex flex-col items-start">
              <div className="text-2xl font-bold text-white leading-none">ОРЕОН</div>
              <div className="text-[8px] font-semibold text-white tracking-[0.15em] uppercase mt-0.5">
                Авто из Европы
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-5 text-white text-sm">
            <Link href="/" className="hover:text-yellow-300 transition-colors">
              Главная
            </Link>
            <Link href="/about" className="hover:text-yellow-300 transition-colors">
              О нас
            </Link>
            <Link href="/team" className="hover:text-yellow-300 transition-colors">
              Команда
            </Link>
            <Link href="/reviews" className="text-yellow-300 font-medium">
              Отзывы
            </Link>
            <Link href="/catalog" className="hover:text-yellow-300 transition-colors">
              Каталог
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://t.me/OreonAuto"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#0088cc] rounded-full flex items-center justify-center hover:bg-[#0077b3] transition-colors"
              title="Наш Telegram канал"
            >
              <Send className="w-5 h-5 text-white" />
            </a>
            <a
              href="tel:+78172263435"
              className="flex items-center gap-2 bg-white text-[#BF360C] hover:bg-gray-100 px-4 py-2 rounded-full font-medium shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">+7 (817) 226-34-35</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section with Diagonal Stripes */}
      <section className="relative bg-[#BF360C] overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-full flex">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-full bg-[#D84315] transform skew-x-[-20deg] origin-top-left"
                style={{
                  width: '80px',
                  marginLeft: i % 2 === 0 ? '40px' : '0px',
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 px-8 py-8">
          <div className="max-w-screen-2xl mx-auto">
            <h1 className="text-5xl font-bold text-white">ОТЗЫВЫ КЛИЕНТОВ</h1>
          </div>
        </div>
      </section>

      {/* Video Reviews Grid */}
      <section className="py-12 px-8 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Загрузка видео-отзывов...</div>
            </div>
          ) : videoReviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-gray-800 text-xl font-semibold mb-2">Пока нет видео-отзывов</p>
              <p className="text-gray-600 mb-6">
                Добавьте первое видео через админ панель
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videoReviews.map((video) => (
                <div
                  key={video.id}
                  className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden"
                >
                  <iframe
                    src={getEmbedUrl(video.video_url, video.platform)}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Text Reviews Section */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#0A2540]">
              ТЕКСТОВЫЕ ОТЗЫВЫ КЛИЕНТОВ
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-12 h-12 bg-[#0A2540] hover:bg-[#1E3A4C] text-white rounded-full flex items-center justify-center transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-12 h-12 bg-[#0A2540] hover:bg-[#1E3A4C] text-white rounded-full flex items-center justify-center transition-colors"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {textReviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Header with name */}
                <div className="p-5">
                  <h4 className="font-bold text-[#0A2540]">{review.name}</h4>
                </div>

                {/* Review text */}
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.text}
                  </p>
                </div>

                {/* Car image */}
                <div className="px-5">
                  <img
                    src={review.carImage}
                    alt="Автомобиль"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Footer with platform and rating */}
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {review.platform === '2gis' ? (
                      <div className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <span>2ГИС</span>
                      </div>
                    ) : (
                      <div className="bg-yellow-400 text-[#0A2540] px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <span>Яндекс</span>
                      </div>
                    )}
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#0A2540]">
                    {review.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#BF360C] text-white">
        <div className="max-w-screen-2xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between pb-6 border-b border-white/20">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col items-start">
                <div className="text-2xl font-bold text-white leading-none">ОРЕОН</div>
                <div className="text-[8px] font-semibold text-white tracking-[0.15em] uppercase mt-0.5">
                  Авто из Европы
                </div>
              </div>
            </Link>

            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-yellow-300 transition-colors">
                Главная
              </Link>
              <Link href="/about" className="hover:text-yellow-300 transition-colors">
                О нас
              </Link>
              <Link href="/team" className="hover:text-yellow-300 transition-colors">
                Команда
              </Link>
              <Link href="/reviews" className="text-yellow-300 font-medium">
                Отзывы
              </Link>
              <Link href="/catalog" className="hover:text-yellow-300 transition-colors">
                Каталог
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://t.me/OreonAuto"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0088cc] rounded-full flex items-center justify-center hover:bg-[#0077b3] transition-colors"
                title="Наш Telegram канал"
              >
                <Send className="w-5 h-5 text-white" />
              </a>
              <a
                href="tel:+78172263435"
                className="flex items-center gap-2 bg-white text-[#BF360C] hover:bg-gray-100 px-4 py-2 rounded-full font-medium shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">+7 (817) 226-34-35</span>
              </a>
            </div>
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div>
              <h3 className="font-bold mb-2 text-white/60 text-xs">Адрес</h3>
              <p className="text-xs">
                160019, Вологодская область,<br />
                город Вологда, ул. Старое шоссе, д.18
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-white/60 text-xs">Телефон</h3>
              <a href="tel:+78172263435" className="text-xs hover:text-blue-400 transition-colors">
                +7 (817) 226-34-35
              </a>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-white/60 text-xs">Электронная почта</h3>
              <a href="mailto:ooo.oreongroups@mail.ru" className="text-xs hover:text-blue-400 transition-colors">
                ooo.oreongroups@mail.ru
              </a>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-white/60 text-xs">Реквизиты</h3>
              <div className="text-xs space-y-1">
                <p>ОГРН 1133525021310</p>
                <p>ИНН 3525313619</p>
                <p>КПП 352501001</p>
                <p>ОКПО 10571608</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 text-center">
            <p className="text-xs text-white/60">
              Все права защищены © 2026
            </p>
          </div>
        </div>
      </footer>

      {/* Contact Dialog */}
      <ContactDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />
    </div>
  );
}
