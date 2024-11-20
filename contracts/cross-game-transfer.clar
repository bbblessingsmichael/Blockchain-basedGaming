;; contracts/cross-game-transfer.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-game (err u101))
(define-constant err-transfer-failed (err u102))

;; Define maps
(define-map supported-games uint bool)
(define-map game-transfer-fees uint uint)

;; Private functions
(define-private (is-owner)
  (is-eq tx-sender contract-owner))

;; Public functions

;; Add supported game
(define-public (add-supported-game (game-id uint) (transfer-fee uint))
  (begin
    (asserts! (is-owner) err-owner-only)
    (map-set supported-games game-id true)
    (map-set game-transfer-fees game-id transfer-fee)
    (ok true)))

;; Remove supported game
(define-public (remove-supported-game (game-id uint))
  (begin
    (asserts! (is-owner) err-owner-only)
    (map-delete supported-games game-id)
    (map-delete game-transfer-fees game-id)
    (ok true)))

;; Transfer item between games
(define-public (transfer-between-games (item-id uint) (from-game uint) (to-game uint) (sender principal))
  (let
    (
      (is-from-game-supported (default-to false (map-get? supported-games from-game)))
      (is-to-game-supported (default-to false (map-get? supported-games to-game)))
      (transfer-fee (default-to u0 (map-get? game-transfer-fees to-game)))
    )
    (asserts! (and is-from-game-supported is-to-game-supported) err-invalid-game)
    (try! (contract-call? .player-economy burn-coins transfer-fee sender))
    (let
      (
        (item-details (unwrap! (contract-call? .game-items get-item-details item-id) err-transfer-failed))
      )
      (try! (contract-call? .game-items burn-item item-id sender))
      (contract-call? .game-items mint-item
        (get name item-details)
        (get description item-details)
        to-game
        sender))))

;; Read-only functions

(define-read-only (is-game-supported (game-id uint))
  (default-to false (map-get? supported-games game-id)))

(define-read-only (get-transfer-fee (game-id uint))
  (default-to u0 (map-get? game-transfer-fees game-id)))
