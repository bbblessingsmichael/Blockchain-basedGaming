;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-game (err u101))

;; Define maps
(define-map supported-games uint bool)
(define-map game-transfer-fees uint uint)

;; Public functions

;; Add supported game
(define-public (add-supported-game (game-id uint) (transfer-fee uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set supported-games game-id true)
    (map-set game-transfer-fees game-id transfer-fee)
    (ok true)))

;; Remove supported game
(define-public (remove-supported-game (game-id uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-delete supported-games game-id)
    (map-delete game-transfer-fees game-id)
    (ok true)))

;; Transfer item between games
(define-public (transfer-between-games (item-id uint) (from-game uint) (to-game uint))
  (let
    (
      (is-from-game-supported (default-to false (map-get? supported-games from-game)))
      (is-to-game-supported (default-to false (map-get? supported-games to-game)))
    )
    (asserts! (and is-from-game-supported is-to-game-supported) err-invalid-game)
    (ok true)))

;; Read-only functions

(define-read-only (is-game-supported (game-id uint))
  (default-to false (map-get? supported-games game-id)))

(define-read-only (get-transfer-fee (game-id uint))
  (default-to u0 (map-get? game-transfer-fees game-id)))

