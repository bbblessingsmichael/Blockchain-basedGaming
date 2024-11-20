;; tests/game-items_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that users can mint, transfer, and burn game items",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    // Mint item
    let block = chain.mineBlock([
      Tx.contractCall('game-items', 'mint-item', [
        types.ascii("Sword of Power"),
        types.ascii("A powerful sword"),
        types.uint(1),
        types.principal(wallet1.address)
      ], deployer.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok u1)');
    
    // Transfer item
    block = chain.mineBlock([
      Tx.contractCall('game-items', 'transfer-item', [
        types.uint(1),
        types.principal(wallet1.address),
        types.principal(wallet2.address)
      ], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    // Burn item
    block = chain.mineBlock([
      Tx.contractCall('game-items', 'burn-item', [
        types.uint(1),
        types.principal(wallet2.address)
      ], wallet2.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
  },
});

