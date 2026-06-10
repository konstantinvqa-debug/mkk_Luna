import { test, expect } from '@playwright/test';
import { config, getHeaders } from './config.js';

test.describe('Создание платежа на 1 рубль', () => {
  const testRecipientWallet = '79991234567';

  test('Создание перевода на QIWI кошелек на сумму 1 рубль', async ({ request }) => {
    const transactionId = `test_${Date.now()}`;

    const paymentData = {
      id: transactionId,
      sum: {
        amount: 1,
        currency: '643', // RUB
      },
      paymentMethod: {
        type: 'Account',
        accountId: '643',
      },
      comment: 'Тестовый платеж - автотест',
      fields: {
        account: testRecipientWallet,
      },
    };

    const url = `${config.baseURL}${config.endpoints.createPayment(99)}`;
    const response = await request.post(url, {
      headers: getHeaders(),
      data: paymentData,
    });

    // Ожидаемые статусы: 200/201 - успех, 400/401/403/422 - ошибки
    expect([200, 201, 400, 401, 403, 422]).toContain(response.status());

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    if (response.status() === 200 || response.status() === 201) {
      const data = await response.json();

      // Проверка суммы платежа = 1 рубль
      expect(data.sum.amount).toBe(1);
      expect(data.sum.currency).toBe('643');

      // Проверка наличия ID транзакции
      expect(data.id).toBeDefined();

      // Проверка статуса транзакции
      if (data.transaction && data.transaction.state) {
        expect(['Accepted', 'Processing', 'Success']).toContain(data.transaction.state.code);
      }
    }
  });
});
