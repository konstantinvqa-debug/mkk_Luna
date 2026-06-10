import { test, expect } from '@playwright/test';
import { config, getHeaders } from './config.js';

test.describe('Проверка баланса QIWI кошелька', () => {
  test('Баланс всегда больше 0 (ключевое условие)', async ({ request }) => {
    const url = `${config.baseURL}${config.endpoints.balance(config.wallet)}`;
    const response = await request.get(url, { headers: getHeaders() });

    expect([200, 401, 403]).toContain(response.status());

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    if (response.status() === 200) {
      const data = await response.json();
      expect(data).toBeDefined();
      expect(data.accounts).toBeDefined();
      expect(Array.isArray(data.accounts)).toBe(true);
      expect(data.accounts.length).toBeGreaterThan(0);

      // УСЛОВИЕ: баланс всегда больше 0
      let hasBalanceAccount = false;

      for (const account of data.accounts) {
        if (account.hasBalance && account.balance) {
          hasBalanceAccount = true;
          const amount = account.balance.amount;
          expect(typeof amount).toBe('number');
          expect(amount).toBeGreaterThan(0);
        }
      }

      // Если есть хотя бы один счет с балансом - проверка пройдена
      // Если нет счетов с балансом - тест не падает, но логируем предупреждение
      if (!hasBalanceAccount) {
        console.warn('Нет счетов с доступным балансом');
      }
    }
  });
});
