import { test, expect, Page } from '@playwright/test';

const login = async (page: Page) => {
    await page.locator('#username').fill('admin');
    await page.locator('#password').fill('1234');
    await page.getByRole('button', { name: 'Ingresar' }).click();
};

test.describe('Ahorro Digital - Suite de Pruebas Completa', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/pagina.html');
    });

    test.describe('P0 - Pruebas Críticas de Onboarding @P0', () => {
        test('Login exitoso', async ({ page }) => {
            await test.step('Realizar login', async () => {
                await login(page);
            });

            await test.step('Verificar acceso al simulador', async () => {
                await expect(page.locator('#simulator-section')).toBeVisible();
                await expect(page.locator('#login-form')).not.toBeVisible();
            });
        });

        test('Login fallido - Credenciales inválidas', async ({ page }) => {
            await test.step('Intentar login con credenciales incorrectas', async () => {
                await page.locator('#username').fill('usuario_invalido');
                await page.locator('#password').fill('pass_invalido');
                await page.getByRole('button', { name: 'Ingresar' }).click();
            });

            await test.step('Verificar mensaje de error', async () => {
                await expect(page.locator('#login-error')).toBeVisible();
                await expect(page.locator('#simulator-section')).not.toBeVisible();
            });
        });

        test('404 - Página no encontrada', async ({ page }) => {
            await test.step('Intentar acceder a página inexistente', async () => {
                await page.goto('/no-existe.html');
                await expect(page.locator('body')).toContainText(/404|not found|no encontrada/i);
            });
        });
    });

    test.describe('P1 - Pruebas del Simulador @P1', () => {
        test.beforeEach(async ({ page }) => {
            await login(page);
        });

        test('Simulación exitosa con diferentes plazos', async ({ page }) => {
            const plazos = [6, 12, 24, 36];
            for (const plazo of plazos) {
                await test.step(`Simulación a ${plazo} meses`, async () => {
                    await page.locator('#amount').fill('1000000');
                    await page.locator(`.term-option[data-term="${plazo}"]`).click();
                    await page.getByRole('button', { name: 'Simular' }).click();
                    
                    await expect(page.locator('#result-card')).toBeVisible();
                    await expect(page.locator('#term')).toContainText(`${plazo} meses`);
                });
            }
        });

        test('Validación de API - Simulación', async ({ request }) => {
            const response = await request.post('http://localhost:3001/api/simulate-savings', {
                data: {
                    amount: 1000000,
                    term: 12
                }
            });

            expect(response.ok()).toBeTruthy();
            const data = await response.json();
            expect(data.initialAmount).toBe(1000000);
            expect(data.term).toBe(12);
        });

        test('Validación de montos límite', async ({ page }) => {
            await test.step('Validar monto mínimo', async () => {
                await page.locator('#amount').fill('50000');
                await expect(page.locator('#amount-error')).toBeVisible();
            });

            await test.step('Validar monto máximo', async () => {
                await page.locator('#amount').fill('999999999');
                await expect(page.locator('#amount-error')).toBeVisible();
            });
        });
    });

    test.describe('P2 - Pruebas de UI y Productos @P2', () => {
        test('Responsive Design', async ({ page }) => {
            const viewports = [
                { width: 1920, height: 1080, name: 'Desktop' },
                { width: 768, height: 1024, name: 'Tablet' },
                { width: 375, height: 667, name: 'Mobile' }
            ];

            for (const viewport of viewports) {
                await test.step(`Validar diseño en ${viewport.name}`, async () => {
                    await page.setViewportSize(viewport);
                    await expect(page.locator('#login-form')).toBeVisible();
                    await expect(page.locator('h1')).toBeVisible();
                });
            }
        });

        test('Formato de números y validaciones', async ({ page }) => {
            await login(page);

            await test.step('Validar formato de miles', async () => {
                await page.locator('#amount').fill('1000000');
                await page.locator('#amount').blur();
                await expect(page.locator('#amount')).toHaveValue('1.000.000');
            });
        });

        test('Reinicio de simulación', async ({ page }) => {
            await login(page);

            await test.step('Realizar simulación inicial', async () => {
                await page.locator('#amount').fill('1000000');
                await page.locator('.term-option[data-term="12"]').click();
                await page.getByRole('button', { name: 'Simular' }).click();
                await expect(page.locator('#result-card')).toBeVisible();
            });

            await test.step('Reiniciar simulación', async () => {
                await page.getByRole('button', { name: 'Nueva simulación' }).click();
                await expect(page.locator('#result-card')).not.toBeVisible();
                await expect(page.locator('#amount')).toHaveValue('');
            });
        });
    });
});