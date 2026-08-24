-- Durable Stripe/Klarna order recovery and idempotency.
-- Safe to run repeatedly on MySQL 8 / MariaDB with JSON support.

CREATE TABLE IF NOT EXISTS stripe_order_drafts (
    payment_intent_id VARCHAR(255) NOT NULL,
    client_order_id VARCHAR(255) NOT NULL,
    amount_cents INT UNSIGNED NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'eur',
    order_data JSON NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'draft',
    order_id VARCHAR(255) DEFAULT NULL,
    last_event_id VARCHAR(255) DEFAULT NULL,
    admin_email_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    customer_email_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    admin_push_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    notification_locked_at TIMESTAMP NULL DEFAULT NULL,
    last_error TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (payment_intent_id),
    KEY idx_stripe_draft_status (status),
    KEY idx_stripe_draft_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE orders
    ADD COLUMN stripe_payment_id VARCHAR(255) DEFAULT NULL AFTER paypal_order_id;

CREATE UNIQUE INDEX uniq_orders_stripe_payment_id
    ON orders (stripe_payment_id);
