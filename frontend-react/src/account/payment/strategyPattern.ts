export type PaymentReceipt = {
  method: "credit" | "paypal";
  maskedDetails?: string;
  email?: string;
};

export interface PaymentStrategy {
  pay(amount: number): PaymentReceipt;
}

export class PaymentProcessor {
  constructor(private readonly strategy: PaymentStrategy) {}

  process(amount: number): PaymentReceipt {
    return this.strategy.pay(amount);
  }
}

export class CreditCardPayment implements PaymentStrategy {
  constructor(private readonly cardNumber: string) {}

  pay(_amount: number): PaymentReceipt {
    const masked = this.cardNumber.replace(/\d(?=\d{4})/g, "*");
    return { method: "credit", maskedDetails: masked };
  }
}

export class PayPalPayment implements PaymentStrategy {
  constructor(private readonly email: string) {}

  pay(_amount: number): PaymentReceipt {
    return { method: "paypal", email: this.email };
  }
}
