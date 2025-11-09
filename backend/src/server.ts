import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

interface SimulationRequest {
  amount: number;
  term: number;
}

interface SimulationResponse {
  initialAmount: number;
  term: number;
  interestRate: number;
  earnedInterest: number;
  totalAmount: number;
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Validation middleware
const validateSimulationRequest = (req: Request, res: Response, next: Function) => {
  const { amount, term } = req.body;
  
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  if (!term || isNaN(term) || ![6, 12, 24, 36].includes(Number(term))) {
    return res.status(400).json({ error: 'Invalid term. Must be 6, 12, 24, or 36 months' });
  }

  next();
};

// Endpoint for savings simulation
app.post('/api/simulate-savings', validateSimulationRequest, (req: Request<{}, {}, SimulationRequest>, res: Response<SimulationResponse>) => {
  const { amount, term } = req.body;
  
  // Interest calculation based on term length
  let annualRate: number;
  switch(term) {
    case 6:
      annualRate = 0.045; // 4.5% for 6 months
      break;
    case 12:
      annualRate = 0.05; // 5% for 12 months
      // Bug #1 (Alta): No se está validando el monto máximo
      if (amount > 1000000000) {
        throw new Error('Amount exceeds maximum limit');
      }
      break;
    case 24:
      // Bug #2 (Media): Tasa incorrecta para 24 meses
      annualRate = 0.050; // Debería ser 5.5%
      break;
    case 36:
      // Bug #3 (Baja): Redondeo incorrecto
      annualRate = Math.floor(0.06 * 100) / 100; // Pérdida de precisión
      break;
    default:
      annualRate = 0.05;
  }

  const monthlyRate = annualRate / 12;
  const months = term;
  const interest = amount * monthlyRate * months;
  const totalAmount = amount + interest;

  res.json({
    initialAmount: amount,
    term: months,
    interestRate: annualRate,
    earnedInterest: interest,
    totalAmount: totalAmount
  });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});