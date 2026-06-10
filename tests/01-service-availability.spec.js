import { test, expect } from '@playwright/test';
import { config, getHeaders } from './config.js';

test.describe('Проверка доступности сервиса QIWI API', () => {
  test('Сервис доступен и возвращает корректный формат ответа', async ({ request }) => {
    const url = `${config.baseURL}${config.endpoints.paymentHistory(config.wallet)}?rows=10`;
    const response = await request.get(url, { headers: getHeaders() });

    // Сервис должен отвечать (200 - успех, 401/403 - проблема авторизации)
    expect([200, 401, 403]).toContain(response.status());

    // Content-Type должен быть JSON
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    // Ответ должен быть валидным JSON
    const data = await response.json();
    expect(data).toBeDefined();

    // Если успешный ответ - проверяем структуру
    if (response.status() === 200) {
      expect(data).toHaveProperty('data');
      expect(Array.isArray(data.data)).toBe(true);

      if (data.data.length > 0) {
        const payment = data.data[0];
        expect(payment).toHaveProperty('txnId');
        expect(payment).toHaveProperty('status');
      }
    }
  });
});
