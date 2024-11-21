import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'

const contractSource = readFileSync('./contracts/cross-game-transfer.clar', 'utf8')

describe('Cross-Game Transfer Contract', () => {
  it('should define contract-owner constant', () => {
    expect(contractSource).toContain('(define-constant contract-owner tx-sender)')
  })
  
  it('should define error constants', () => {
    expect(contractSource).toContain('(define-constant err-owner-only (err u100))')
    expect(contractSource).toContain('(define-constant err-invalid-game (err u101))')
  })
  
  it('should define supported-games map', () => {
    expect(contractSource).toContain('(define-map supported-games uint bool)')
  })
  
  it('should define game-transfer-fees map', () => {
    expect(contractSource).toContain('(define-map game-transfer-fees uint uint)')
  })
  
  it('should have an add-supported-game function', () => {
    expect(contractSource).toContain('(define-public (add-supported-game (game-id uint) (transfer-fee uint))')
  })
  
  it('should check for contract owner in add-supported-game function', () => {
    expect(contractSource).toContain('(asserts! (is-eq tx-sender contract-owner) err-owner-only)')
  })
  
  it('should have a remove-supported-game function', () => {
    expect(contractSource).toContain('(define-public (remove-supported-game (game-id uint))')
  })
  
  it('should check for contract owner in remove-supported-game function', () => {
    expect(contractSource).toContain('(asserts! (is-eq tx-sender contract-owner) err-owner-only)')
  })
  
  it('should have a transfer-between-games function', () => {
    expect(contractSource).toContain('(define-public (transfer-between-games (item-id uint) (from-game uint) (to-game uint))')
  })
  
  it('should check for supported games in transfer-between-games function', () => {
    expect(contractSource).toContain('(asserts! (and is-from-game-supported is-to-game-supported) err-invalid-game)')
  })
  
  it('should have an is-game-supported read-only function', () => {
    expect(contractSource).toContain('(define-read-only (is-game-supported (game-id uint))')
  })
  
  it('should have a get-transfer-fee read-only function', () => {
    expect(contractSource).toContain('(define-read-only (get-transfer-fee (game-id uint))')
  })
})

