import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const contractSource = readFileSync('./contracts/player-economy.clar', 'utf8')

describe('Player Economy Contract', () => {
  it('should define error constant', () => {
    expect(contractSource).toContain('(define-constant err-insufficient-balance (err u101))')
  })
  
  it('should define game-coin fungible token', () => {
    expect(contractSource).toContain('(define-fungible-token game-coin)')
  })
  
  it('should have a mint-coins function', () => {
    expect(contractSource).toContain('(define-public (mint-coins (amount uint) (recipient principal))')
  })
  
  it('should use ft-mint? in mint-coins function', () => {
    expect(contractSource).toContain('(ft-mint? game-coin amount recipient)')
  })
  
  it('should have a transfer-coins function', () => {
    expect(contractSource).toContain('(define-public (transfer-coins (amount uint) (sender principal) (recipient principal))')
  })
  
  it('should use ft-transfer? in transfer-coins function', () => {
    expect(contractSource).toContain('(ft-transfer? game-coin amount sender recipient)')
  })
  
  it('should have a get-balance read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-balance (player principal))')
  })
  
  it('should use ft-get-balance in get-balance function', () => {
    expect(contractSource).toContain('(ft-get-balance game-coin player)')
  })
  
  it('should have a get-total-supply read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-total-supply)')
  })
  
  it('should use ft-get-supply in get-total-supply function', () => {
    expect(contractSource).toContain('(ft-get-supply game-coin)')
  })
})

