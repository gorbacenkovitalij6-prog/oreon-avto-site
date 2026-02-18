'use client';

import { Button } from '@/components/ui/button';
import { Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function TeamPage() {
  const teamMembers = [
    {
      name: 'Андрей Игоревич',
      image: 'https://i.ibb.co/bjNBwTnK/photo-2026-02-13-15-50-56.jpg'
    },
    {
      name: 'Юрий Владимирович',
      image: 'https://i.ibb.co/jvZbqk5n/photo-2026-02-13-15-51-11.jpg'
    },
    {
      name: 'Виктор Васильевич',
      image: 'https://i.ibb.co/WvzNYTqS/photo-2026-02-13-15-51-15.jpg'
    },
    {
      name: 'Роман Сергеевич',
      image: 'https://i.ibb.co/4Zhk2DwD/photo-2026-02-13-15-51-19.jpg'
    },
    {
      name: 'Михаил Андреевич',
      image: 'https://i.ibb.co/99tPWVZP/photo-2026-02-13-15-51-24.jpg'
    },
    {
      name: 'Смирнов Артём',
      image: 'https://i.ibb.co/0RmH9Fg3/photo-2026-02-13-15-51-27.jpg'
    },
    {
      name: 'Иван Алексеевич',
      image: 'https://i.ibb.co/CqF3bB8/photo-2026-02-13-15-51-31.jpg'
    },
    {
      name: 'Алексей Александрович',
      image: 'https://i.ibb.co/dw239xSw/photo-2026-02-13-15-51-34.jpg'
    },
    {
      name: 'Андрей Евгеньевич',
      image: 'https://i.ibb.co/39dM8DnT/photo-2026-02-13-15-51-38.jpg'
    },
    {
      name: 'Александр Петрович',
      image: 'https://i.ibb.co/232vM00R/photo-2026-02-13-15-51-41.jpg'
    },
    {
      name: 'Сергей Олегович',
      image: 'https://i.ibb.co/FkDmPZ27/photo-2026-02-13-15-51-44.jpg'
    },
    {
      name: 'Владимир Валерьевич',
      image: 'https://i.ibb.co/JjVwRGBc/photo-2026-02-13-15-51-48.jpg'
    },
    {
      name: 'Михаил Сергеевич',
      image: 'https://i.ibb.co/XfJRxK9x/photo-2026-02-13-15-51-51.jpg'
    }
  ];

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
            <Link href="/team" className="text-yellow-300 font-medium">
              Команда
            </Link>
            <Link href="/reviews" className="hover:text-yellow-300 transition-colors">
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
        {/* Diagonal Stripes Pattern */}
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
            <h1 className="text-5xl font-bold text-white">КОМАНДА</h1>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-12 px-8 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          {/* First member - centered */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 rounded-full overflow-hidden mb-4 border-4 border-[#BF360C]">
                <img
                  src={teamMembers[0].image}
                  alt={teamMembers[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#0A2540] text-center">
                {teamMembers[0].name}
              </h3>
            </div>
          </div>

          {/* Rest of the team - 4 columns grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {teamMembers.slice(1).map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-[#0A2540] text-center">
                  {member.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#BF360C] text-white">
        <div className="max-w-screen-2xl mx-auto px-8 py-6">
          {/* Top section with logo and navigation */}
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
              <Link href="/team" className="text-yellow-300 font-medium">
                Команда
              </Link>
              <Link href="/reviews" className="hover:text-yellow-300 transition-colors">
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

          {/* Bottom section with contact info */}
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
              <a href="tel:+78172263435" className="text-xs hover:text-yellow-300 transition-colors">
                +7 (817) 226-34-35
              </a>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-white/60 text-xs">Электронная почта</h3>
              <a href="mailto:oreon.ooo@internet.ru" className="text-xs hover:text-yellow-300 transition-colors">
                oreon.ooo@internet.ru
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

          {/* Copyright */}
          <div className="mt-6 pt-4 border-t border-white/20 text-center">
            <p className="text-xs text-white/60">
              Все права защищены © 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
