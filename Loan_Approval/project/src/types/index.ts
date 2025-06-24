export interface LoanApplication {
  bank_balance: number;
  cibil_score: number;
  loan_amount: number;
  monthly_income: number;
  loan_tenure: number;
  age: number;
  employment_type?: string;
  income_source?: string;
  existing_loans?: string;
  emi_existing?: number;
  language?: string;
}

export interface LoanResult {
  status: string;
  status_class: string;
  eligibility_score: number;
  estimated_emi: number;
  emi_ratio: number;
  reasons: string[];
  criteria_scores: Record<string, string>;
  recommendation: string;
  loan_details: {
    amount: number;
    tenure: number;
    estimated_interest_rate: number;
    processing_fee: number;
    total_payable: number;
  };
  ml_prediction?: {
    prediction: string;
    confidence: number;
  };
}

export interface ApiResponse {
  success: boolean;
  result?: LoanResult;
  error?: string;
}

export interface Language {
  code: string;
  name: string;
}