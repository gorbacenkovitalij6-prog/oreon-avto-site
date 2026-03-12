'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase, type Car } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function CatalogPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBudget, setFilterBudget] = useState('all');

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      setError('Не удалось загрузить автомобили. Пожалуйста, попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  }

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch = car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           car.model.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesBudget = true;
      if (filterBudget !== 'all') {
        const price = car.price;
        if (filterBudget === '500k') matchesBudget = price <= 500000;
        else if (filterBudget === '1m') matchesBudget = price > 500000 && price <= 1000000;
        else if (filterBudget === '2m') matchesBudget = price > 1000000 && price <= 2000000;
        else if (filterBudget === '3m') matchesBudget = price > 2000000 && price <= 3000000;
        else if (filterBudget === 'more') matchesBudget = price > 3000000;
      }

      return matchesSearch && matchesBudget;
    });
  }, [cars, searchQuery, filterBudget]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#BF360C] shadow-md px-6 py-3">
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
            <Link href="/catalog" className="text-yellow-300 font-medium">
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

      <div className="max-w-screen-2xl mx-auto px-8 py-12 pt-24">
        <h1 className="text-5xl font-bold text-[#0A2540] mb-8">Каталог автомобилей</h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchCars}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Повторить
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Поиск по марке или модели..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12"
            />
            <Select value={filterBudget} onValueChange={setFilterBudget}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Все бюджеты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все бюджеты</SelectItem>
                <SelectItem value="500k">До 500 000 ₽</SelectItem>
                <SelectItem value="1m">500 000 - 1 000 000 ₽</SelectItem>
                <SelectItem value="2m">1 000 000 - 2 000 000 ₽</SelectItem>
                <SelectItem value="3m">2 000 000 - 3 000 000 ₽</SelectItem>
                <SelectItem value="more">Более 3 000 000 ₽</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setSearchQuery('');
                setFilterBudget('all');
              }}
              variant="outline"
              className="h-12"
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">Автомобили не найдены</p>
            <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative h-64 bg-gray-200">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Нет фото
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
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#0A2540] mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <span>{car.year} г.</span>
                    <span>•</span>
                    <span>{car.mileage.toLocaleString()} км</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                    <span>{car.fuel_type}</span>
                    <span>•</span>
                    <span>{car.transmission}</span>
                    {car.engine_volume && (
                      <>
                        <span>•</span>
                        <span>{car.engine_volume} л</span>
                      </>
                    )}
                    {car.drive_type && (
                      <>
                        <span>•</span>
                        <span>{car.drive_type} привод</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4 line-clamp-2">{car.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-[#0A7ABF]">
                      {car.price.toLocaleString()} ₽
                    </div>
                    <a
                      href="https://t.me/OreonAuto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-[#0A7ABF] hover:bg-[#095A8F]">
                        Подробнее
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
