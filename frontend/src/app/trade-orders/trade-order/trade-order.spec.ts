import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeOrder } from './trade-order';

describe('TradeOrder', () => {
  let component: TradeOrder;
  let fixture: ComponentFixture<TradeOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
