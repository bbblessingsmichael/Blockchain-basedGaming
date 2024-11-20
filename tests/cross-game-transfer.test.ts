;; tests/cross-game-transfer_test.ts

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that items can be transferred between supported games",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // Add supported games
    let block = chain.mineBlock([
      Tx.contractCall('cross-game-transfer', 'add-supported-game', [types.uint(1), types.uint(10)], deployer.address),
      Tx.contractCall('cross-game-transfer', 'add-supported-game', [types.uint(2), types.uint(20)], deployer.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    assertEquals(block.receipts[1].result, '(ok true)');
    
    // Mint item in game 1
    block = chain.mineBlock([
      Tx.contractCall('game-items', 'mint-item', [
        types.ascii("Magic Wand"),
        types.ascii("A powerful magical wand"),
        types.uint(1),
        types.principal(wallet1.address)
      ], deployer.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok u1)');
    
    // Mint coins for transfer fee
    block = chain.mineBlock([
      Tx.contractCall('player-economy', 'mint-coins', [
        types.uint(100),
        types.principal(wallet1.address)
      ], deployer.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok true)');
    
    // Transfer item from game 1 to game 2
    block = chain.mineBlock([
      Tx.contractCall('cross-game-transfer', 'transfer-between-games', [
        types.uint(1),
        types.uint(1),
        types.uint(2),
        types.principal(wallet1.address)
      ], wallet1.address)
    ]);
    assertEquals(block.receipts[0].result, '(ok u2)');
  },
});
