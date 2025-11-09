import { test, expect } from '@playwright/test';

test.describe('API Tests - Ahorro Digital', () => {
    const API_URL = 'http://localhost:3001/api';

    test('API Health Check', async ({ request }) => {
        const response = await request.get(`${API_URL}/health`);
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.status).toBe('ok');
    });

    test('Simular ahorro con monto válido y plazo 12 meses', async ({ request }) => {
        const response = await request.post(`${API_URL}/simulate-savings`, {
            data: {
                amount: 1000000,
                term: 12
            }
        });
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.initialAmount).toBe(1000000);
        expect(data.term).toBe(12);
        expect(data.interestRate).toBe(0.05); // 5% para 12 meses
        expect(data.earnedInterest).toBeDefined();
        expect(data.totalAmount).toBe(data.initialAmount + data.earnedInterest);
    });

    test('Simular ahorro con monto válido y plazo 6 meses', async ({ request }) => {
        const response = await request.post(`${API_URL}/simulate-savings`, {
            data: {
                amount: 500000,
                term: 6
            }
        });
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.initialAmount).toBe(500000);
        expect(data.term).toBe(6);
        expect(data.interestRate).toBe(0.045); // 4.5% para 6 meses
    });

    test('Simular ahorro con monto válido y plazo 24 meses', async ({ request }) => {
        const response = await request.post(`${API_URL}/simulate-savings`, {
            data: {
                amount: 2000000,
                term: 24
            }
        });
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.initialAmount).toBe(2000000);
        expect(data.term).toBe(24);
        expect(data.interestRate).toBe(0.055); // 5.5% para 24 meses
    });

    test('Validar error con monto negativo', async ({ request }) => {
        const response = await request.post(`${API_URL}/simulate-savings`, {
            data: {
                amount: -1000,
                term: 12
            }
        });
        expect(response.status()).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('Invalid amount');
    });

    test('Validar error con plazo inválido', async ({ request }) => {
        const response = await request.post(`${API_URL}/simulate-savings`, {
            data: {
                amount: 1000000,
                term: 15
            }
        });
        expect(response.status()).toBe(400);
        const data = await response.json();
        expect(data.error).toBe('Invalid term. Must be 6, 12, 24, or 36 months');
    });
});