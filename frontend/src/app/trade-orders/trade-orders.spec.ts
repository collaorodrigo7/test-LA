import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeOrders } from './trade-orders';

describe('TradeOrders', () => {
  let component: TradeOrders;
  let fixture: ComponentFixture<TradeOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
