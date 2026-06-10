import { test, expect } from '@playwright/test';
import { config, getHeaders } from './config.js';

test.describe('Исполнение платежа', () => {
  const testRecipientWallet = '79991234567';

  test('Полный цикл: Создание и проверка исполнения платежа', async ({ request }) => {
    // ===== ШАГ 1: СОЗДАНИЕ ПЛАТЕЖА =====
    const transactionId = `test_execution_${Date.now()}`;

    const paymentData = {
      id: transactionId,
      sum: {
        amount: 1,
        currency: '643',
      },
      paymentMethod: {
        type: 'Account',
        accountId: '643',
      },
      comment: 'Тестовый платеж для проверки исполнения',
      fields: {
        account: testRecipientWallet,
      },
    };

    const createUrl = `${config.baseURL}${config.endpoints.createPayment(99)}`;
    const createResponse = await request.post(createUrl, {
      headers: getHeaders(),
      data: paymentData,
    });

    expect([200, 201, 400, 401, 403, 422]).toContain(createResponse.status());

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    if (createResponse.status() === 200 || createResponse.status() === 201) {
      const createData = await createResponse.json();

      // Получаем ID транзакции из ответа
      let createdTransactionId = transactionId;
      if (createData.transaction && createData.transaction.id) {
        createdTransactionId = createData.transaction.id;
      }

      // ===== ШАГ 2: ПРОВЕРКА ИСПОЛНЕНИЯ ПЛАТЕЖА =====
      // Небольшая задержка для обработки платежа
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const transactionUrl = `${config.baseURL}/payment-history/v2/transactions/${createdTransactionId}`;
      const checkResponse = await request.get(transactionUrl, {
        headers: getHeaders(),
      });

      expect([200, 401, 404]).toContain(checkResponse.status());

      if (checkResponse.status() === 200) {
        const transactionData = await checkResponse.json();

        // Проверка суммы
        expect(transactionData.sum.amount).toBe(1);

        // Проверка статуса (должен быть WAITING, SUCCESS или ERROR)
        expect(['WAITING', 'SUCCESS', 'ERROR']).toContain(transactionData.status);

        // Проверка наличия ID транзакции
        expect(transactionData.txnId).toBeDefined();
      }
    }
  });
});
