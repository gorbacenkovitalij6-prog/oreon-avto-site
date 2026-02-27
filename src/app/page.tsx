'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase, type Car, type VideoReview } from '@/lib/supabase';
import { ContactDialog } from '@/components/ContactDialog';

export default function Home() {
  const [agreed, setAgreed] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [heroFormData, setHeroFormData] = useState({
    name: '',
    phone: '',
    budget: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleHeroFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      alert('Пожалуйста, согласитесь с условиями пользовательского соглашения');
      return;
    }

    setSubmitting(true);

    try {
      // Отправка в Telegram
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: heroFormData.name,
          phone: heroFormData.phone,
          budget: heroFormData.budget,
          type: 'hero'
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      alert(`Спасибо, ${heroFormData.name}! Мы свяжемся с вами в ближайшее время по номеру ${heroFormData.phone}`);

      // Очистка формы
      setHeroFormData({ name: '', phone: '', budget: '' });
      setAgreed(false);
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#BF360C] shadow-md px-6 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-start">
              <div className="text-2xl font-bold text-white leading-none">ОРЕОН</div>
              <div className="text-[8px] font-semibold text-white tracking-[0.15em] uppercase mt-0.5">
                Авто из Европы
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-5 text-white text-sm">
            <Link href="/" className="hover:text-yellow-300 transition-colors font-medium">
              Главная
            </Link>
            <Link href="/about" className="hover:text-yellow-300 transition-colors font-medium">
              О нас
            </Link>
            <Link href="/team" className="hover:text-yellow-300 transition-colors font-medium">
              Команда
            </Link>
            <Link href="/reviews" className="hover:text-yellow-300 transition-colors font-medium">
              Отзывы
            </Link>
            <Link href="/catalog" className="hover:text-yellow-300 transition-colors font-medium">
              Каталог
            </Link>
          </nav>

          {/* Contact Buttons */}
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

      {/* Hero Section */}
      <section className="flex items-stretch pt-[90px]">
        {/* Left Side - Form */}
        <div className="w-1/2 bg-white flex items-start justify-center px-10 py-10">
          <div className="max-w-xl w-full">
            <h1 className="text-4xl font-bold text-[#0A2540] leading-tight mb-4">
              АВТО ИЗ ЕВРОПЫ<br />
              С ДОСТАВКОЙ ПО РФ
            </h1>

            <p className="text-base text-gray-700 mb-6 leading-relaxed">
              Авто из-за границы под ключ — быстро и дешевле рынка на 20–30%.
              Полное сопровождение сделки (подбор, покупка, доставка,
              растаможка, оформление документов).
            </p>

            {/* Form */}
            <form onSubmit={handleHeroFormSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Ваше имя"
                value={heroFormData.name}
                onChange={(e) => setHeroFormData({ ...heroFormData, name: e.target.value })}
                required
                className="h-11 bg-gray-50 border-gray-200 text-sm"
              />

              <div className="flex gap-2">
                <div className="flex items-center gap-2 h-11 px-3 bg-gray-50 border border-gray-200 rounded-md">
                  <span className="text-xl">🇷🇺</span>
                  <span className="text-gray-500 text-sm">+7</span>
                </div>
                <Input
                  type="tel"
                  placeholder="(000) 000-00-00"
                  value={heroFormData.phone}
                  onChange={(e) => setHeroFormData({ ...heroFormData, phone: e.target.value })}
                  required
                  className="h-11 bg-gray-50 border-gray-200 text-sm flex-1"
                />
              </div>

              <Select
                value={heroFormData.budget}
                onValueChange={(value) => setHeroFormData({ ...heroFormData, budget: value })}
                required
              >
                <SelectTrigger className="h-11 bg-gray-50 border-gray-200 text-sm">
                  <SelectValue placeholder="Выберите бюджет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500k">До 500 000 ₽</SelectItem>
                  <SelectItem value="1m">500 000 - 1 000 000 ₽</SelectItem>
                  <SelectItem value="2m">1 000 000 - 2 000 000 ₽</SelectItem>
                  <SelectItem value="3m">2 000 000 - 3 000 000 ₽</SelectItem>
                  <SelectItem value="more">Более 3 000 000 ₽</SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="submit"
                disabled={submitting || !agreed}
                className="w-full h-11 bg-[#0A7ABF] hover:bg-[#095A8F] text-white text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Отправка...' : 'Оставить заявку'}
              </Button>

              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked: boolean) => setAgreed(checked)}
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-tight cursor-pointer"
                >
                  <span className="text-green-600">✓</span> Я согласился с условиями пользовательского соглашения
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Image with Stats */}
        <div className="w-1/2 relative">
          <div className="relative w-full h-full">
            <img
              src="https://i.ibb.co/99MMvGWQ/Gemini-Generated-Image-c24usmc24usmc24u.jpg"
              alt="Автовоз с машинами Mercedes-Benz"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40" />

            {/* Action Buttons */}
            <div className="absolute bottom-8 left-8 right-8 flex gap-4 items-center justify-center">
              <Button
                onClick={() => setContactDialogOpen(true)}
                className="bg-white text-[#BF360C] hover:bg-gray-100 px-10 py-6 text-base font-semibold rounded-lg shadow-lg transition-all hover:scale-105 whitespace-nowrap"
              >
                Запросить образец договора
              </Button>
              <a
                href="https://t.me/OreonAuto"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0088cc] hover:bg-[#0077b3] text-white px-10 py-6 text-base font-semibold rounded-lg shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Send className="w-5 h-5" />
                Наш Telegram канал
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-12">
          {/* Left Side - Text */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-[#0A2540] leading-tight">
              КЛИЕНТЫ, КОТОРЫЕ<br />
              УЖЕ ПОЛУЧИЛИ АВТО
            </h2>
          </div>

          {/* Right Side - Client Avatars */}
          <div className="flex-1 flex flex-col items-end gap-4">
            <div className="flex items-center -space-x-4">
              {/* Client photos */}
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
                <img
                  src="https://ext.same-assets.com/3655081281/309832735.jpeg"
                  alt="Клиент"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center overflow-hidden">
                <img
                  src="https://ext.same-assets.com/3655081281/3937889675.jpeg"
                  alt="Клиент"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
                <img
                  src="https://ext.same-assets.com/3655081281/331457206.jpeg"
                  alt="Клиент"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center overflow-hidden">
                <img
                  src="https://ext.same-assets.com/3655081281/2574035094.jpeg"
                  alt="Клиент"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center overflow-hidden">
                <img
                  src="https://ext.same-assets.com/3655081281/911256757.jpeg"
                  alt="Клиент"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center overflow-hidden">
                <img
                  src="https://ext.same-assets.com/3655081281/3422714086.jpeg"
                  alt="Клиент"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center overflow-hidden">
                <img
                  src="https://ext.same-assets.com/3655081281/1140135373.jpeg"
                  alt="Клиент"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>

              {/* Counter Badge */}
              <div className="w-24 h-24 rounded-full border-4 border-white bg-[#0A7ABF] flex flex-col items-center justify-center">
                <div className="text-white font-bold text-lg">1000+</div>
                <div className="text-white text-xs">чел.</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm">
              Более 1 000 человек уже получили свои автомобили
            </p>
          </div>
        </div>
      </section>

      {/* Cars Section */}
      <section className="py-12 px-8 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-4xl font-bold text-[#0A2540] text-center mb-8">
            АВТОМОБИЛИ - ГОТОВЫЕ К ОТПРАВКЕ В РФ
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-600 text-xl">Загрузка автомобилей...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">🚗</div>
              <p className="text-gray-800 text-xl font-semibold mb-2">Пока нет автомобилей</p>
              <p className="text-gray-600 mb-6">
                Добавьте первый автомобиль через админ панель
              </p>
              <Link href="/admin">
                <Button className="bg-[#0A7ABF] hover:bg-[#095A8F] px-6 py-6">
                  Добавить автомобиль
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cars.map((car) => (
                  <div key={car.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Car Image */}
                    <div className="relative h-56 bg-gray-200">
                      {car.images && car.images.length > 0 ? (
                        <img
                          src={car.images[0]}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🚗</div>
                            <div>Нет фото</div>
                          </div>
                        </div>
                      )}
                      {car.status === 'sold' && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Продано
                        </div>
                      )}
                      {car.status === 'reserved' && (
                        <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Забронировано
                        </div>
                      )}
                    </div>

                    {/* Car Info */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-[#0A2540] mb-2">
                        {car.brand} {car.model}
                      </h3>

                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div>Год выпуска: {car.year}</div>
                        <div>Пробег: {car.mileage.toLocaleString()} км</div>
                        <div>Топливо: {car.fuel_type}</div>
                        <div>КПП: {car.transmission}</div>
                        {car.engine_volume && <div>Объем: {car.engine_volume} л</div>}
                        {car.drive_type && <div>Привод: {car.drive_type}</div>}
                      </div>

                      {/* Price */}
                      <div className="text-2xl font-bold text-green-600 mb-4">
                        {car.price.toLocaleString()} ₽
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <Link href="/catalog" className="flex-1">
                          <Button variant="outline" className="w-full">
                            Подробнее
                          </Button>
                        </Link>
                        <Button
                          onClick={() => setContactDialogOpen(true)}
                          className="flex-1 bg-[#0A7ABF] hover:bg-[#095A8F]"
                        >
                          Заказать
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <Link href="/catalog">
                  <Button className="bg-[#0A7ABF] hover:bg-[#095A8F] px-8 py-6 text-lg">
                    Смотреть весь каталог
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Guarantees Section */}
      <section className="py-12 px-8 bg-[#BF360C]">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8">
            МЕЧТАЕТЕ О ХОРОШЕМ АВТО НО БОИТЕСЬ, ЧТО:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Risk 1 */}
            <div className="bg-white rounded-lg p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#BF360C] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-gray-800 font-medium leading-tight">
                  Окажется с замаскированным ремонтом.
                </p>
              </div>
            </div>

            {/* Risk 2 */}
            <div className="bg-white rounded-lg p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#BF360C] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-gray-800 font-medium leading-tight">
                  Цена «под ключ» вырастет на 500 000 ₽ при растаможке.
                </p>
              </div>
            </div>

            {/* Risk 3 */}
            <div className="bg-white rounded-lg p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#BF360C] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-gray-800 font-medium leading-tight">
                  Авто застрянет на границе или деньги заморозят в банке.
                </p>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">
                  Мы убрали эти риски с 2018 года.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-4xl font-bold text-[#0A2540] mb-8">
            ВЫБИРАЕТЕ АВТО - ОСТАЛЬНОЕ БЕРЁМ НА СЕБЯ
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Legal Safety Block */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-2">
                <div className="p-5 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-[#0A2540] mb-2">
                    ПОЛНАЯ ЮРИДИЧЕСКАЯ БЕЗОПАСНОСТЬ
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Ваш автомобиль будет ввезён и оформлен в РФ строго по закону — без рисков и скрытых проблем.
                  </p>
                  <p className="text-gray-700 text-xs">
                    <strong>Точно то, что вы хотите</strong><br />
                    Мы фиксируем все ваши требования в договоре: марка, комплектация, год, пробег, бюджет — и ищем идеальное соответствие.
                  </p>
                </div>
                <img
                  src="https://i.ibb.co/h1wMxhr0/photo-2026-02-12-13-08-08.jpg"
                  alt="Довольные клиенты"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* European Quality Block */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-2">
                <img
                  src="https://i.ibb.co/213tpzZq/photo-2026-02-12-13-08-12.jpg"
                  alt="Передача автомобиля"
                  className="w-full h-full object-cover"
                />
                <div className="p-5 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-[#0A2540] mb-3">
                    ЕВРОПЕЙСКОЕ КАЧЕСТВО — ПО РАЗУМНОЙ ЦЕНЕ
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Используем лучшие предложения с автоаукционов Европы и 10-летний опыт, чтобы подобрать надёжный авто в рамках вашего бюджета.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Block */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-2">
                <img
                  src="https://i.ibb.co/4BKx44M/photo-2026-02-03-13-15-49.jpg"
                  alt="Автомобиль"
                  className="w-full h-full object-cover"
                />
                <div className="p-5 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-[#0A2540] mb-2">
                    МЫ БЕРЁМ НА СЕБЯ ВСЁ СЛОЖНОЕ:
                  </h3>
                  <ul className="space-y-1.5 text-gray-700 text-xs">
                    <li>Поиск, бронирование, выкуп и доставка авто.</li>
                    <li>Комплексная диагностика + проверка истории и юридической чистоты.</li>
                    <li>Поддержка на каждом этапе — от выбора до постановки на учёт.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* You only need to */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-2">
                <div className="p-5 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-[#0A2540] mb-2">
                    ВАМ ОСТАЁТСЯ ТОЛЬКО:
                  </h3>
                  <ul className="space-y-1.5 text-gray-700 text-xs">
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Описать желаемый автомобиль</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Выбрать способ оплаты</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Получить ключи — спокойно и без стресса</span>
                    </li>
                  </ul>
                </div>
                <img
                  src="https://i.ibb.co/DDf4dP2V/photo-2026-02-12-13-10-04.jpg"
                  alt="Автомобиль премиум класса"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="bg-gradient-to-r from-[#BF360C] to-[#D84315] rounded-lg overflow-hidden shadow-lg mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-6 flex flex-col justify-start">
                <h3 className="text-xl font-bold text-white mb-3">
                  «ОРЕОН» — ВАШ НАДЕЖНЫЙ ПАРТНЁР
                </h3>
                <p className="text-white mb-2 text-sm">
                  в покупке автомобилей из Европы.
                </p>
                <p className="text-white/90 mb-3 text-sm leading-relaxed">
                  Экономьте ваше время. Берегите ваши нервы. Защищаем ваши интересы.
                </p>

                <div className="mb-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-white font-bold text-sm">✓</span>
                    <p className="text-white/95 text-xs leading-relaxed">
                      <strong>Более 13 лет опыта</strong> — успешно доставили 1000+ автомобилей по всей России
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white font-bold text-sm">✓</span>
                    <p className="text-white/95 text-xs leading-relaxed">
                      <strong>Экономия 20-30%</strong> — цены ниже рынка благодаря прямым поставкам из Европы
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white font-bold text-sm">✓</span>
                    <p className="text-white/95 text-xs leading-relaxed">
                      <strong>Полное сопровождение</strong> — от подбора до получения ключей и постановки на учёт
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white font-bold text-sm">✓</span>
                    <p className="text-white/95 text-xs leading-relaxed">
                      <strong>Юридическая гарантия</strong> — все документы, договоры и проверки в соответствии с законом РФ
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-white font-bold text-sm">✓</span>
                    <p className="text-white/95 text-xs leading-relaxed">
                      <strong>Прозрачные цены</strong> — фиксируем все расходы в договоре, никаких скрытых платежей
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <a
                    href="https://t.me/OreonAuto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-[#0088cc] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#0077b3] transition-colors"
                    title="Наш Telegram канал"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </a>
                  <p className="text-white/90 text-xs">
                    Переходите в наш телеграм-канал, там мы рассказываем про новые поступления и консультируем от 8 до 22 часов по МСК
                  </p>
                </div>
              </div>
              <div className="relative h-48 lg:h-auto">
                <img
                  src="https://i.ibb.co/7dwPNDMn/Gemini-Generated-Image-1towxm1towxm1tow-1.jpg"
                  alt="Toyota RAV4"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Car Section */}
      <HowToGetCarSection />

      {/* Client Reviews Section */}
      <ClientReviewsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Consultation Form Section */}
      <ConsultationFormSection />

      {/* Footer */}
      <footer className="bg-[#BF360C] text-white">
        <div className="max-w-screen-2xl mx-auto px-8 py-8">
          {/* Top section with logo and navigation */}
          <div className="flex items-center justify-between pb-8 border-b border-white/20">
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-start">
                <div className="text-3xl font-bold text-white leading-none">ОРЕОН</div>
                <div className="text-[9px] font-semibold text-white tracking-[0.15em] uppercase mt-0.5">
                  Авто из Европы
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-8">
              <Link href="/" className="hover:text-blue-400 transition-colors">
                Главная
              </Link>
              <Link href="/about" className="hover:text-blue-400 transition-colors">
                О нас
              </Link>
              <Link href="/team" className="hover:text-blue-400 transition-colors">
                Команда
              </Link>
              <Link href="/reviews" className="hover:text-blue-400 transition-colors">
                Отзывы
              </Link>
              <Link href="/catalog" className="hover:text-blue-400 transition-colors">
                Каталог
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://t.me/OreonAuto"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#0088cc] rounded-full flex items-center justify-center hover:bg-[#0077b3] transition-colors"
                title="Наш Telegram канал"
              >
                <Send className="w-6 h-6 text-white" />
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
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-3 text-white/60">Адрес</h3>
              <p className="text-sm">
                160019, Вологодская область,<br />
                город Вологда, ул. Старое шоссе, д.18
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-white/60">Телефон</h3>
              <a
                href="tel:+78172263435"
                className="text-sm hover:text-blue-400 transition-colors block"
                title="Позвонить нам"
              >
                +7 (817) 226-34-35
              </a>

              <h3 className="font-bold mt-4 mb-3 text-white/60">Электронная почта</h3>
              <a
                href="mailto:ooo.oreongroups@mail.ru"
                className="text-sm hover:text-blue-400 transition-colors block"
                title="Написать нам"
              >
                ooo.oreongroups@mail.ru
              </a>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-white/60">Реквизиты</h3>
              <div className="text-sm space-y-1">
                <p>ОГРН 1133525021310</p>
                <p>ИНН 3525313619</p>
                <p>КПП 352501001</p>
                <p>ОКПО 10571608</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-sm text-white/60">
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

function HowToGetCarSection() {
  const [currentReview, setCurrentReview] = useState(0);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const reviews = [
    {
      image: "https://i.ibb.co/yB7vDp2c/photo-2026-01-14-12-40-23.jpg",
      name: "Павел Д.",
      text: "Все прошло на высшем уровне. Доставили быстро, в идеальном состоянии, документы оформлены без задержек. Приятно, когда люди следуют выполненным срокам!",
      rating: 5
    },
    {
      image: "https://i.ibb.co/qMSXBdFL/photo-2026-01-14-12-40-43.jpg",
      name: "Екатерина Л.",
      text: "Приехала на свою новую покупку, как только планировала! Довольна качеством и состоянием, а также отличным сервисом и четкостью на всех этапах.",
      rating: 5
    },
    {
      image: "https://i.ibb.co/4GYrgJb/photo-2026-01-14-12-40-55.jpg",
      name: "Максим Р.",
      text: "Решил купить из Европы и не ошибся. Все расходы и этапы были прозрачны заранее, и доставили вовремя. Очень рад, что выбрал вас!",
      rating: 5
    },
    {
      image: "https://i.ibb.co/j9jbH9vJ/photo-2026-01-19-12-55-04.jpg",
      name: "Виктор С.",
      text: "Очень рекомендую этот способ покупки! Пригнали в отличном виде, документы в порядке. Профессиональная команда!",
      rating: 5
    },
    {
      image: "https://i.ibb.co/SDSkFmCB/photo-2026-01-19-13-00-11.jpg",
      name: "Лариса Д.",
      text: "Приехало в точном состоянии. Как и обещали, проверка была быстрой. Весь процесс прошел гладко!",
      rating: 5
    },
    {
      image: "https://i.ibb.co/dJfRt4YZ/photo-2026-01-26-17-10-30.jpg",
      name: "Федор П.",
      text: "Спасибо за честность и профессионализм! Соответствует всем заявленным характеристикам. Процесс был прозрачным от начала до конца.",
      rating: 5
    },
    {
      image: "https://i.ibb.co/GLyBZ69/photo-2026-01-26-17-33-52.jpg",
      name: "Дмитрий В.",
      text: "Очень доволен качеством подбора и скоростью доставки. Цена действительно выгоднее, чем у дилеров.",
      rating: 5
    },
    {
      image: "https://i.ibb.co/sJssx8HP/photo-2026-01-27-15-36-53.jpg",
      name: "Сергей М.",
      text: "Отличный сервис! Помогли с выбором, организовали доставку, оформили все документы. Рекомендую всем!",
      rating: 5
    },
    {
      image: "https://i.ibb.co/HLsdvDM2/photo-2026-01-30-13-27-51.jpg",
      name: "Алексей Т.",
      text: "Пришло в идеальном состоянии! Все как в описании. Спасибо за профессиональную работу и внимание к деталям.",
      rating: 5
    },
    {
      image: "https://i.ibb.co/TxzYwpTG/photo-2026-01-30-13-27-52.jpg",
      name: "Игорь П.",
      text: "Весь процесс занял меньше месяца. Отличная поддержка на всех этапах. Полностью соответствует ожиданиям!",
      rating: 5
    },
    {
      image: "https://i.ibb.co/JWkRjMk2/photo-2026-02-05-13-08-15-2.jpg",
      name: "Анна В.",
      text: "Качество подбора на высоте, все документы в порядке. Очень доволен сотрудничеством!",
      rating: 5
    },
    {
      image: "https://i.ibb.co/Q3qS7MMH/photo-2026-02-05-13-08-15.jpg",
      name: "Андрей Л.",
      text: "Профессиональный подход, честные цены, быстрая доставка. Всё на высшем уровне! Буду рекомендовать друзьям.",
      rating: 5
    },
    {
      image: "https://i.ibb.co/h1wMxhr0/photo-2026-02-12-13-08-08.jpg",
      name: "Ельвира К.",
      text: "Получил точно в срок. Вся информация была предоставлена заранее. Никаких скрытых платежей. Отличная работа!",
      rating: 5
    },
    {
      image: "https://i.ibb.co/213tpzZq/photo-2026-02-12-13-08-12.jpg",
      name: "Владимир Б.",
      text: "Очень доволен покупкой! В отличном состоянии, все документы оформлены правильно. Спасибо за качественную работу!",
      rating: 5
    },
    {
      image: "https://i.ibb.co/4BKx44M/photo-2026-02-03-13-15-49.jpg",
      name: "Константин Д.",
      text: "Приятно удивлен качеством сервиса. Весь процесс был прозрачным и понятным. Соответствует всем ожиданиям!",
      rating: 5
    },
    {
      image: "https://i.ibb.co/DDf4dP2V/photo-2026-02-12-13-10-04.jpg",
      name: "Николай П.",
      text: "Превосходный опыт покупки! Команда профессионалов сделала всё быстро и качественно. Теперь у меня!",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-12 px-8 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-4xl font-bold text-[#0A2540] mb-8">
          КАК ПОЛУЧИТЬ АВТОМОБИЛЬ<br />
          ИЗ ДРУГИХ СТРАН, ОТ А ДО Я
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Steps */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="bg-gray-50 rounded-lg p-5 relative">
                <div className="text-6xl font-bold text-gray-200 absolute top-2 right-4">01</div>
                <h3 className="text-lg font-bold text-[#0A2540] mb-2 relative z-10">
                  ОТПРАВЛЯЕТЕ ЗАЯВКУ
                </h3>
                <p className="text-sm text-gray-700 relative z-10">
                  Вы описываете пожелания по авто: год, цвет, комплектация, исходя из ваших финансовых возможностей и отправляете заявку.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-50 rounded-lg p-5 relative">
                <div className="text-6xl font-bold text-gray-200 absolute top-2 right-4">02</div>
                <h3 className="text-lg font-bold text-[#0A2540] mb-2 relative z-10">
                  МЫ ПОДБИРАЕМ АВТО
                </h3>
                <p className="text-sm text-gray-700 relative z-10">
                  Находим авто по вашему запросу в Европе и отправляем варианты, а вы выбираете то что понравится именно вам.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-50 rounded-lg p-5 relative">
                <div className="text-6xl font-bold text-gray-200 absolute top-2 right-4">03</div>
                <h3 className="text-lg font-bold text-[#0A2540] mb-2 relative z-10">
                  ОСМОТР АВТО
                </h3>
                <p className="text-sm text-gray-700 relative z-10">
                  Лично выезжаем на осмотр автомобиля, проводим полную диагностику и несем ответственность за авто.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-gray-50 rounded-lg p-5 relative">
                <div className="text-6xl font-bold text-gray-200 absolute top-2 right-4">04</div>
                <h3 className="text-lg font-bold text-[#0A2540] mb-2 relative z-10">
                  ЗАКЛЮЧАЕМ ДОГОВОР
                </h3>
                <p className="text-sm text-gray-700 relative z-10">
                  Подписываем договор и на основании этого договора мы приступаем к процессу пригона автомобиля.
                </p>
              </div>

              {/* Step 5 */}
              <div className="bg-gray-50 rounded-lg p-5 relative">
                <div className="text-6xl font-bold text-gray-200 absolute top-2 right-4">05</div>
                <h3 className="text-lg font-bold text-[#0A2540] mb-2 relative z-10">
                  ОПЛАТА ЗА АВТО И РАСХОДЫ
                </h3>
                <p className="text-sm text-gray-700 relative z-10">
                  Вы описываетесь пожелания по авто: год, цвет, комплектация, исходя из ваших финансовых возможностей, все оплаты идут по факту.
                </p>
              </div>

              {/* Step 6 */}
              <div className="bg-gray-50 rounded-lg p-5 relative">
                <div className="text-6xl font-bold text-gray-200 absolute top-2 right-4">06</div>
                <h3 className="text-lg font-bold text-[#0A2540] mb-2 relative z-10">
                  ОТПРАВКА АВТО В РОССИЮ
                </h3>
                <p className="text-sm text-gray-700 relative z-10">
                  Подписываем договор и на основании этого договора мы приступаем к процессу пригона автомобиля.
                </p>
              </div>
            </div>

            {/* Step 7 - Full width */}
            <div className="bg-gray-50 rounded-lg p-5 relative">
              <div className="text-6xl font-bold text-gray-200 absolute top-2 right-4">07</div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2 relative z-10">
                ПРОВЕРКА АВТО ПО ПРИЕЗДУ
              </h3>
              <p className="text-sm text-gray-700 relative z-10">
                По прибытию авто вы можете проверить его в сервисе и удостовериться в состоянии автомобиля.
              </p>
            </div>

            {/* DEKRA Expert Block */}
            <div className="bg-gradient-to-r from-[#00A651] to-[#00C853] rounded-lg p-6 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2">
                DEKRA EXPERT
              </h3>
              <p className="text-white/90 mb-4 text-sm">
                Профессиональная проверка автомобиля
              </p>
              <Button
                onClick={() => setContactDialogOpen(true)}
                className="bg-white text-[#00A651] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-md"
              >
                Заказать отчет про автомобиль
              </Button>
            </div>
          </div>

          {/* Contact Dialog */}
          <ContactDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />

          {/* Right side - Reviews Carousel */}
          <div className="relative">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full">
              <div className="relative h-full">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentReview ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xl">★</span>
                          ))}
                        </div>
                        <h4 className="font-bold text-[#0A2540] mb-2">{review.name}</h4>
                        <p className="text-sm text-gray-700">{review.text}</p>
                      </div>

                      {/* Rating badges */}
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-400 text-[#0A2540] px-4 py-2 rounded-lg font-bold">
                          <div className="text-xs">Яндекс</div>
                          <div className="text-2xl">4,9</div>
                        </div>
                        <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
                          <div className="text-xs">2ГИС</div>
                          <div className="text-2xl">4,9</div>
                        </div>
                        <div className="text-white text-xs">
                          Средняя оценка<br />по отзывам на<br />всех площадках
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Navigation arrows */}
                <button
                  onClick={() => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentReview((prev) => (prev + 1) % reviews.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center"
                >
                  →
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReview(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentReview ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConsultationFormSection() {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    budget: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Пожалуйста, согласитесь с условиями пользовательского соглашения');
      return;
    }

    setSubmitting(true);

    try {
      // Отправка в Telegram
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          budget: formData.budget,
          type: 'consultation'
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка отправки');
      }

      alert(`Спасибо, ${formData.name}! Мы свяжемся с вами в ближайшее время.`);

      // Reset form
      setFormData({ name: '', phone: '', budget: '' });
      setAgreed(false);
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12 px-8 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="bg-[#BF360C] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-12">
            {/* Left side - Text */}
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-8">
                ПОЛУЧИТЕ БЕСПЛАТНУЮ КОНСУЛЬТАЦИЮ<br />
                ПО ПОДБОРУ АВТОМОБИЛЯ
              </h2>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl flex-shrink-0">•</span>
                  <span className="text-lg">Объясним, как проходит процесс покупки и поставки авто</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl flex-shrink-0">•</span>
                  <span className="text-lg">Подберём подходящие модели под ваш бюджет и задачи</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl flex-shrink-0">•</span>
                  <span className="text-lg">Рассчитаем стоимость авто с учётом всех расходов</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl flex-shrink-0">•</span>
                  <span className="text-lg">Расскажем об актуальных акциях и возможных скидках</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 text-xl flex-shrink-0">•</span>
                  <span className="text-lg">Ответим на все вопросы по покупке, доставке и растаможке</span>
                </li>
              </ul>
            </div>

            {/* Right side - Form */}
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-14 bg-white text-gray-900 placeholder:text-gray-500"
                />

                <div className="flex gap-2">
                  <div className="flex items-center gap-2 h-14 px-4 bg-white border border-gray-200 rounded-md">
                    <span className="text-2xl">🇷🇺</span>
                    <span className="text-gray-500">+7</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="(000) 000-00-00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-14 bg-white text-gray-900 placeholder:text-gray-500 flex-1"
                  />
                </div>

                <Select
                  value={formData.budget}
                  onValueChange={(value) => setFormData({ ...formData, budget: value })}
                  required
                >
                  <SelectTrigger className="h-14 bg-white text-gray-900">
                    <SelectValue placeholder="Выберите бюджет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500k">До 500 000 ₽</SelectItem>
                    <SelectItem value="1m">500 000 - 1 000 000 ₽</SelectItem>
                    <SelectItem value="2m">1 000 000 - 2 000 000 ₽</SelectItem>
                    <SelectItem value="3m">2 000 000 - 3 000 000 ₽</SelectItem>
                    <SelectItem value="more">Более 3 000 000 ₽</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="submit"
                  disabled={!agreed || submitting}
                  className="w-full h-14 bg-[#0088cc] hover:bg-[#0077b3] text-white text-base font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Отправка...' : 'Оставить заявку'}
                </Button>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="consultation-terms"
                    checked={agreed}
                    onCheckedChange={(checked: boolean) => setAgreed(checked)}
                    className="mt-1 border-white data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <label
                    htmlFor="consultation-terms"
                    className="text-sm text-white leading-tight cursor-pointer"
                  >
                    Я согласился с условиями пользовательского соглашения
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Из чего формируется стоимость автомобиля?",
      answer: "Стоимость автомобиля складывается из нескольких составляющих: цена автомобиля на аукционе или у дилера, стоимость доставки из Европы в РФ, таможенные платежи (пошлина, НДС, утилизационный сбор), оформление документов и наши услуги по подбору и сопровождению сделки."
    },
    {
      question: "Могу ли я купить автомобиль в кредит?",
      answer: "Да, вы можете оформить кредит на покупку автомобиля. Мы сотрудничаем с несколькими банками и можем помочь подобрать оптимальные условия кредитования. Также возможна рассрочка платежа на этапах доставки."
    },
    {
      question: "Какие марки автомобилей вы привозите из Европы?",
      answer: "Мы работаем со всеми европейскими марками: Mercedes-Benz, BMW, Audi, Volkswagen, Porsche, Volvo, Land Rover, Jaguar и многими другими. Подбираем автомобили любых классов - от компактных городских до премиум и спортивных моделей."
    },
    {
      question: "Какие гарантии доставки и как страхуется автомобиль на время транспортировки?",
      answer: "Автомобиль страхуется на весь период транспортировки от момента покупки до передачи вам. Мы работаем только с проверенными транспортными компаниями. В договоре прописываются все сроки и условия доставки с гарантией возмещения в случае любых повреждений."
    },
    {
      question: "Как долго доставляется автомобиль из Европе?",
      answer: "Средний срок доставки составляет от 2 до 4 недель с момента покупки автомобиля. Это включает время на оформление документов, логистику и растаможку. Точные сроки зависят от страны отправления и текущей загруженности таможни."
    },
    {
      question: "Какие гарантии вы предоставляете?",
      answer: "Мы предоставляем полную юридическую гарантию чистоты автомобиля, гарантию соответствия заявленным характеристикам, страховку на время доставки. Все условия прописываются в договоре. Также проводим полную диагностику перед отправкой."
    },
    {
      question: "Куда можно доставить автомобиль?",
      answer: "Доставка возможна в любой город России. Автомобиль можно забрать самостоятельно на таможенном терминале или заказать доставку до вашего города автовозом. Стоимость доставки рассчитывается индивидуально."
    }
  ];

  return (
    <section className="py-12 px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-[#0A2540] mb-8">
          ОТВЕЧАЕМ НА ЧАСТО<br />
          ЗАДАВАЕМЫЕ ВОПРОСЫ
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left hover:text-[#0A7ABF] transition-colors"
              >
                <h3 className="text-lg font-semibold text-[#0A2540] pr-8">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <span className="text-3xl text-gray-400">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </div>
              </button>

              {openIndex === index && (
                <div className="pb-6 pr-12 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const reviews = [
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
      name: "Федор П.",

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
    <section className="py-12 px-8 bg-gray-50">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-[#0A2540]">
            ОТЗЫВЫ КЛИЕНТОВ —<br />
            ПОКАЗАТЕЛЬ КАЧЕСТВА
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
          {reviews.map((review, index) => (
            <div key={index} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-sm overflow-hidden">
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
  );
}
