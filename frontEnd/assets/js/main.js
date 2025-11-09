// Constants
const API_URL = 'http://localhost:3001/api';
const VALID_TERMS = [6, 12, 24, 36];

// DOM Elements
const loginForm = document.getElementById('login-form');
const simulatorSection = document.getElementById('simulator-section');
const simulatorForm = document.getElementById('simulator-form');
const amountInput = document.getElementById('amount');
const termSelector = document.getElementById('term-selector');
const loginError = document.getElementById('login-error');
const resultCard = document.getElementById('result-card');
const loadingIndicator = document.getElementById('loading');

// Results elements
const initialAmountResult = document.getElementById('initial-amount');
const termResult = document.getElementById('term');
const interestRateResult = document.getElementById('interest-rate');
const earnedInterestResult = document.getElementById('earned-interest');
const totalAmountResult = document.getElementById('total-amount');

// Event Listeners
loginForm?.addEventListener('submit', handleLogin);
simulatorForm?.addEventListener('submit', handleSimulation);
amountInput?.addEventListener('input', validateAmount);
document.querySelectorAll('.term-option').forEach(option => {
    option.addEventListener('click', handleTermSelection);
});

// Functions
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation - in a real app this would be against a backend
    if (username === 'admin' && password === '1234') {
        loginForm.style.display = 'none';
        simulatorSection.style.display = 'block';
        loginError.style.display = 'none';
    } else {
        loginError.style.display = 'block';
    }
}

function validateAmount() {
    const amount = parseFloat(amountInput.value);
    const submitButton = document.querySelector('button[type="submit"]');
    
    if (!amount || amount <= 0) {
        amountInput.classList.add('error');
        document.getElementById('amount-error').style.display = 'block';
        submitButton.disabled = true;
    } else {
        amountInput.classList.remove('error');
        document.getElementById('amount-error').style.display = 'none';
        submitButton.disabled = false;
    }
}

function handleTermSelection(e) {
    document.querySelectorAll('.term-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    e.target.classList.add('selected');
}

async function handleSimulation(e) {
    e.preventDefault();
    
    const amount = parseFloat(amountInput.value);
    const selectedTerm = document.querySelector('.term-option.selected');
    
    if (!amount || !selectedTerm) {
        return;
    }

    const term = parseInt(selectedTerm.dataset.term);
    
    try {
        loadingIndicator.style.display = 'block';
        resultCard.style.display = 'none';
        
        const response = await fetch(`${API_URL}/simulate-savings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount, term })
        });

        if (!response.ok) {
            throw new Error('Error en la simulación');
        }

        const result = await response.json();
        displayResults(result);
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al realizar la simulación');
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function displayResults(result) {
    initialAmountResult.textContent = formatCurrency(result.initialAmount);
    termResult.textContent = `${result.term} meses`;
    interestRateResult.textContent = `${(result.interestRate * 100).toFixed(2)}%`;
    earnedInterestResult.textContent = formatCurrency(result.earnedInterest);
    totalAmountResult.textContent = formatCurrency(result.totalAmount);
    
    resultCard.style.display = 'block';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(amount);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set default term
    const defaultTerm = document.querySelector('.term-option[data-term="12"]');
    if (defaultTerm) {
        defaultTerm.classList.add('selected');
    }
});