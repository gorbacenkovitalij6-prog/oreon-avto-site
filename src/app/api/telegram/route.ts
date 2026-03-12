import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, budget, type = 'consultation' } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || chatId === 'YOUR_CHAT_ID_HERE') {
      return NextResponse.json(
        { error: 'Telegram не настроен. Пожалуйста, укажите TELEGRAM_CHAT_ID' },
        { status: 500 }
      );
    }

    // Формируем сообщение
    let message = `🚗 *Новая заявка с сайта ОРЕОН*\n\n`;
    message += `👤 *Имя:* ${name}\n`;
    message += `📱 *Телефон:* ${phone}\n`;

    if (budget) {
      const budgetMap: Record<string, string> = {
        '500k': 'До 500 000 ₽',
        '1m': '500 000 - 1 000 000 ₽',
        '2m': '1 000 000 - 2 000 000 ₽',
        '3m': '2 000 000 - 3 000 000 ₽',
        'more': 'Более 3 000 000 ₽'
      };
      const budgetText = budgetMap[budget] || budget;

      message += `💰 *Бюджет:* ${budgetText}\n`;
    }

    message += `\n📝 *Тип заявки:* ${type === 'hero' ? 'Главная форма' : 'Консультация'}\n`;
    message += `🕒 *Дата:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

    // Отправляем сообщение в Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json(
        { error: 'Ошибка отправки в Telegram' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
