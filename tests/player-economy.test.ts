;; tests/player-economy_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that players can trade coins and items",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;
    
    // Mint coins
    let block = chain.mineBlock([
      Tx.contractCall('player-economy', 'mint-coins', [
        types.uint(1000),
        types.principal(wallet1.address)
      ], deployer.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    // Mint item
    block = chain.mineBlock([
      Tx.contractCall('game-items', 'mint-item', [
        types.ascii("Rare Gem"),
        types.ascii("A valuable gem"),
        types.uint(1),
        types.principal(wallet2.address)
      ], deployer.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok u1)');
    
    // Trade coins for item
    block = chain.mineBlock([
      Tx.contractCall('player-economy', 'trade', [
        types.uint(500),
        types.uint(1),
        types.principal(wallet1.address),
        types.principal(wallet2.address)
      ], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
  },
});
