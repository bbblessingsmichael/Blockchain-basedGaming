;; contracts/player-economy.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-insufficient-balance (err u101))

;; Define fungible token
(define-fungible-token game-coin)

;; Define maps
(define-map player-balances principal uint)

;; Private functions
(define-private (is-owner)
  (is-eq tx-sender contract-owner))

;; Public functions

;; Mint game coins (only contract owner)
(define-public (mint-coins (amount uint) (recipient principal))
  (begin
    (asserts! (is-owner) err-owner-only)
    (ft-mint? game-coin amount recipient)))

;; Transfer game coins
(define-public (transfer-coins (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-owner-only)
    (ft-transfer? game-coin amount sender recipient)))

;; Burn game coins
(define-public (burn-coins (amount uint) (owner principal))
  (begin
    (asserts! (is-eq tx-sender owner) err-owner-only)
    (ft-burn? game-coin amount owner)))

;; Player-to-player trade
(define-public (trade (coin-amount uint) (item-id uint) (coin-sender principal) (item-sender principal))
  (begin
    (try! (transfer-coins coin-amount coin-sender item-sender))
    (contract-call? .game-items transfer-item item-id item-sender coin-sender)))

;; Read-only functions

(define-read-only (get-balance (player principal))
  (ft-get-balance game-coin player))

(define-read-only (get-total-supply)
  (ft-get-supply game-coin))
