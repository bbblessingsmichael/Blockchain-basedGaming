;; Define constants
(define-constant err-insufficient-balance (err u101))

;; Define fungible token
(define-fungible-token game-coin)

;; Public functions

;; Mint game coins
(define-public (mint-coins (amount uint) (recipient principal))
  (ft-mint? game-coin amount recipient))

;; Transfer game coins
(define-public (transfer-coins (amount uint) (sender principal) (recipient principal))
  (ft-transfer? game-coin amount sender recipient))

;; Read-only functions

(define-read-only (get-balance (player principal))
  (ft-get-balance game-coin player))

(define-read-only (get-total-supply)
  (ft-get-supply game-coin))

