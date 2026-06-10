/**
 * Конфигурация для тестирования API QIWI Кошелька
 */

export const config = {
  baseURL: 'https://edge.qiwi.com',

  // API токен (placeholder)
  apiToken: process.env.QIWI_API_TOKEN || 'Bearer_token_placeholder',

  // Номер кошелька для тестов
  wallet: process.env.QIWI_WALLET || '79991234567',

  // Endpoints
  endpoints: {
    profile: '/person-profile/v1/profile/current',
    balance: (personId) => `/funding-sources/v2/persons/${personId}/accounts`,
    paymentHistory: (wallet) => `/payment-history/v2/persons/${wallet}/payments`,
    createPayment: (id) => `/sinap/api/v2/terms/${id}/payments`,
    commission: (id) => `/sinap/providers/${id}/onlineCommission`,
  },
};

/**
 * Получить заголовки для API запросов
 */
export function getHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: config.apiToken,
  };
}
