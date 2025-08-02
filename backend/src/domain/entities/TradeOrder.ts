export interface TradeOrder {
  id: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop'
  amount: number
  price: number
  status: "open" | "cancelled" | "executed"
  pair: string
  createdAt: Date
  updatedAt: Date
  isDeleted?: boolean
  deletedAt?: Date
}
