;; contracts/game-items.clar

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))

;; Define non-fungible token
(define-non-fungible-token game-item uint)

;; Define data variables
(define-data-var last-item-id uint u0)

;; Define maps
(define-map item-details uint {name: (string-ascii 50), description: (string-ascii 256), game-id: uint})

;; Private functions
(define-private (is-owner)
  (is-eq tx-sender contract-owner))

;; Public functions

;; Mint new game item
(define-public (mint-item (name (string-ascii 50)) (description (string-ascii 256)) (game-id uint) (recipient principal))
  (let
    (
      (new-item-id (+ (var-get last-item-id) u1))
    )
    (asserts! (is-owner) err-owner-only)
    (try! (nft-mint? game-item new-item-id recipient))
    (map-set item-details new-item-id {name: name, description: description, game-id: game-id})
    (var-set last-item-id new-item-id)
    (ok new-item-id)))

;; Transfer game item
(define-public (transfer-item (item-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-owner-only)
    (nft-transfer? game-item item-id sender recipient)))

;; Burn game item
(define-public (burn-item (item-id uint) (owner principal))
  (begin
    (asserts! (is-eq tx-sender owner) err-owner-only)
    (nft-burn? game-item item-id owner)))

;; Read-only functions

(define-read-only (get-item-details (item-id uint))
  (map-get? item-details item-id))

(define-read-only (get-owner (item-id uint))
  (nft-get-owner? game-item item-id))

(define-read-only (get-last-item-id)
  (var-get last-item-id))
