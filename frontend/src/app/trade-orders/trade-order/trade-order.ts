import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { TradeOrdersService } from '../trade-orders.service';

interface MarketPrice {
  pair: string;
  price: number;
  change: number;
}

@Component({
  selector: 'app-trade-order',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './trade-order.html',
  styleUrl: './trade-order.scss'
})
export class TradeOrderComponent implements OnInit {
  tradeOrderForm: FormGroup = new FormGroup({
    side: new FormControl('buy', [Validators.required]),
    type: new FormControl('market', [Validators.required]),
    amount: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    price: new FormControl(null),
    pair: new FormControl('BTCUSD', [Validators.required])
  });

  isSubmitting = false;

  marketPrices: MarketPrice[] = [
    { pair: 'BTCUSD', price: 100150.4, change: 2.45 },
    { pair: 'EURUSD', price: 1.035, change: -0.12 },
    { pair: 'ETHUSD', price: 3310, change: 1.87 }
  ];

  pairs = [
    { value: 'BTCUSD', label: 'BTC/USD', icon: '₿', symbol: 'bitcoin' },
    { value: 'EURUSD', label: 'EUR/USD', icon: '€', symbol: 'euro_symbol' },
    { value: 'ETHUSD', label: 'ETH/USD', icon: 'Ξ', symbol: 'currency_exchange' }
  ];

  sides = [
    { value: 'buy', label: 'Buy', icon: 'trending_up', class: 'buy' },
    { value: 'sell', label: 'Sell', icon: 'trending_down', class: 'sell' }
  ];

  types = [
    { value: 'market', label: 'Market', icon: 'flash_on', description: 'Execute immediately at current market price' },
    { value: 'limit', label: 'Limit', icon: 'trending_flat', description: 'Execute when price reaches your specified level' },
    { value: 'stop', label: 'Stop', icon: 'stop', description: 'Execute when price moves against your position' }
  ];

  constructor(
    public tradeOrdersService: TradeOrdersService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Watch for type changes to handle price field requirement
    this.tradeOrderForm.get('type')?.valueChanges.subscribe(type => {
      this.updatePriceValidation();
    });

    // Watch for side, type, price, and pair changes to validate price logic
    this.tradeOrderForm.valueChanges.subscribe(() => {
      this.validatePriceLogic();
    });

    // Set initial price validation
    this.updatePriceValidation();
  }

  private updatePriceValidation() {
    const type = this.tradeOrderForm.get('type')?.value;
    const priceControl = this.tradeOrderForm.get('price');

    if (type === 'market') {
      priceControl?.clearValidators();
      priceControl?.setValue(null);
    } else {
      priceControl?.setValidators([Validators.required, Validators.min(0.00001)]);
    }
    priceControl?.updateValueAndValidity();
  }

  private validatePriceLogic() {
    const formValue = this.tradeOrderForm.value;
    const { side, type, price, pair } = formValue;

    if (type === 'market' || !price || !pair || !side) {
      return; // Skip validation for market orders or incomplete forms
    }

    const marketPrice = this.getCurrentPrice(pair);
    const priceControl = this.tradeOrderForm.get('price');
    let errorMessage = '';

    if (type === 'limit') {
      if (side === 'buy' && price >= marketPrice) {
        errorMessage = `Buy limit price must be lower than market price (${marketPrice})`;
      } else if (side === 'sell' && price <= marketPrice) {
        errorMessage = `Sell limit price must be higher than market price (${marketPrice})`;
      }
    } else if (type === 'stop') {
      if (side === 'buy' && price <= marketPrice) {
        errorMessage = `Buy stop price must be higher than market price (${marketPrice})`;
      } else if (side === 'sell' && price >= marketPrice) {
        errorMessage = `Sell stop price must be lower than market price (${marketPrice})`;
      }
    }

    if (errorMessage) {
      priceControl?.setErrors({ priceLogic: errorMessage });
    } else {
      // Clear only the price logic error, keep other errors
      const errors = priceControl?.errors;
      if (errors) {
        delete errors['priceLogic'];
        priceControl?.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }
  }  getCurrentPrice(pair: string): number {
    const marketPrice = this.marketPrices.find(p => p.pair === pair);
    return marketPrice?.price || 0;
  }

  getPriceChange(pair: string): number {
    const marketPrice = this.marketPrices.find(p => p.pair === pair);
    return marketPrice?.change || 0;
  }

  isMarketOrder(): boolean {
    return this.tradeOrderForm.get('type')?.value === 'market';
  }

  getEstimatedTotal(): number {
    const amount = this.tradeOrderForm.get('amount')?.value || 0;
    const price = this.isMarketOrder()
      ? this.getCurrentPrice(this.tradeOrderForm.get('pair')?.value || 'BTCUSD')
      : this.tradeOrderForm.get('price')?.value || 0;

    return amount * price;
  }

  getPriceErrorMessage(): string {
    const priceControl = this.tradeOrderForm.get('price');
    if (priceControl?.hasError('required')) {
      return `Price is required for ${this.tradeOrderForm.get('type')?.value} orders`;
    }
    if (priceControl?.hasError('min')) {
      return 'Price must be greater than 0';
    }
    if (priceControl?.hasError('priceLogic')) {
      return priceControl.errors?.['priceLogic'];
    }
    return '';
  }

  isFormValid(): boolean {
    return this.tradeOrderForm.valid && !this.isSubmitting;
  }  onSubmit() {
    if (this.tradeOrderForm.valid) {
      this.isSubmitting = true;
      const formData = { ...this.tradeOrderForm.value };

      // Remove price for market orders
      if (formData.type === 'market') {
        delete formData.price;
      }

      // Create new order
      this.tradeOrdersService.create(formData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.snackBar.open('Order created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/trades']);
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.error('Error creating order:', error);
          this.snackBar.open(
            error.error?.message || 'Error creating order. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.tradeOrderForm.controls).forEach(key => {
      const control = this.tradeOrderForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel() {
    this.router.navigate(['/trades']);
  }

  resetForm() {
    this.tradeOrderForm.reset({
      side: 'buy',
      type: 'market',
      pair: 'BTCUSD'
    });
    this.updatePriceValidation();
  }
}
