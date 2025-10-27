-- Update subscription plans with real Stripe product/price IDs
-- Migration: Update plan table to match new Stripe products created with best practices
-- Date: 2025-01-26
-- Author: Claude Code

-- Update Starter → Essential Plan
UPDATE plan
SET
  slug = 'essential',
  name = 'Essential Plan',
  description = 'Perfect for solopreneurs & new businesses. Beautiful 3-page website, mobile-perfected design, SSL & backups, 2 content updates/month, email support.',
  stripe_price_id_monthly = 'price_1SMRoVP9fFsmlAaF9zkoG6QT',
  stripe_price_id_yearly = 'price_1SMRoVP9fFsmlAaFUMgWLMJO',
  features = '[
    {"name": "3-page website", "description": "Home, About, Contact", "included": true},
    {"name": "Mobile-responsive design", "description": "Looks great on all devices", "included": true},
    {"name": "SSL certificate", "description": "Secure HTTPS connection", "included": true},
    {"name": "Custom domain", "description": "Use your own domain name", "included": true},
    {"name": "Basic SEO", "description": "Search engine optimization", "included": true},
    {"name": "2 content updates/month", "description": "We handle content changes", "included": true},
    {"name": "Email support", "description": "48-hour response time", "included": true},
    {"name": "Free domain setup", "description": "We configure your domain", "included": true}
  ]'::jsonb,
  page_limit = 3,
  revision_limit = 2,
  sort_order = 1,
  updated_at = now()
WHERE slug = 'starter';

-- Update Business → Growth Plan
UPDATE plan
SET
  slug = 'growth',
  name = 'Growth Plan',
  description = 'For businesses ready to scale. Up to 7 pages, custom branding, SEO optimization, smart contact forms, 5 content updates/month, priority support, monthly reports.',
  stripe_price_id_monthly = 'price_1SMRoWP9fFsmlAaFnRp0Qap8',
  stripe_price_id_yearly = 'price_1SMRoWP9fFsmlAaF4V7jpxQI',
  features = '[
    {"name": "Up to 7 pages", "description": "Services, testimonials, gallery, blog", "included": true},
    {"name": "Custom branding", "description": "Colors, fonts, imagery that matches your brand", "included": true},
    {"name": "Advanced SEO", "description": "Get found on Google", "included": true},
    {"name": "Smart contact forms", "description": "Leads sent directly to your email/CRM", "included": true},
    {"name": "5 content updates/month", "description": "Menu changes, new services, etc.", "included": true},
    {"name": "Priority support", "description": "24-hour response time", "included": true},
    {"name": "Monthly performance report", "description": "See your visitor growth", "included": true},
    {"name": "Social media integration", "description": "Instagram feed, Facebook reviews", "included": true}
  ]'::jsonb,
  page_limit = 7,
  revision_limit = 5,
  sort_order = 2,
  updated_at = now()
WHERE slug = 'business';

-- Update Professional → Pro Plan
UPDATE plan
SET
  slug = 'pro',
  name = 'Pro Plan',
  description = 'For established businesses. E-commerce ready (50 products), blog engine, advanced analytics, custom integrations, unlimited updates, VIP support, monthly strategy call.',
  stripe_price_id_monthly = 'price_1SMRoXP9fFsmlAaFSKYWVyRK',
  stripe_price_id_yearly = 'price_1SMRoXP9fFsmlAaFrwN3YGUF',
  features = '[
    {"name": "Up to 10 pages", "description": "Everything you need to showcase your business", "included": true},
    {"name": "E-commerce ready", "description": "Sell up to 50 products online", "included": true},
    {"name": "Blog engine", "description": "Publish content, build authority", "included": true},
    {"name": "Advanced analytics", "description": "Understand your visitors", "included": true},
    {"name": "Custom integrations", "description": "Mailchimp, Google Ads, booking systems", "included": true},
    {"name": "Unlimited content updates", "description": "Change prices, add products, update hours", "included": true},
    {"name": "VIP support", "description": "6-hour response time", "included": true},
    {"name": "Monthly strategy call", "description": "30 minutes with your dedicated designer", "included": true},
    {"name": "Conversion optimization", "description": "We test & improve your site monthly", "included": true}
  ]'::jsonb,
  page_limit = 10,
  revision_limit = NULL, -- Unlimited
  sort_order = 3,
  updated_at = now()
WHERE slug = 'professional';

-- Update Enterprise → Elite Plan
UPDATE plan
SET
  slug = 'elite',
  name = 'Elite Plan',
  description = 'For complex business needs. Unlimited pages/products, multi-language support, dedicated account manager, real-time chat, enterprise integrations, A/B testing, 99.9% uptime SLA.',
  stripe_price_id_monthly = 'price_1SMRoYP9fFsmlAaFHmXwXCth',
  stripe_price_id_yearly = 'price_1SMRoYP9fFsmlAaFt182MXUM',
  features = '[
    {"name": "Unlimited pages & products", "description": "No restrictions", "included": true},
    {"name": "Multi-language support", "description": "Serve English & French customers", "included": true},
    {"name": "Dedicated account manager", "description": "Your personal digital partner", "included": true},
    {"name": "Real-time chat support", "description": "Get help within hours", "included": true},
    {"name": "Enterprise integrations", "description": "CRM, ERP, custom APIs", "included": true},
    {"name": "A/B testing", "description": "Test different versions, increase conversions", "included": true},
    {"name": "White-label reporting", "description": "Share branded reports with stakeholders", "included": true},
    {"name": "Custom features", "description": "Need something special? We build it", "included": true},
    {"name": "99.9% uptime SLA", "description": "Legal guarantee your site stays online", "included": true},
    {"name": "Unlimited content updates", "description": "Change anything, anytime", "included": true}
  ]'::jsonb,
  page_limit = NULL, -- Unlimited
  revision_limit = NULL, -- Unlimited
  sort_order = 4,
  updated_at = now()
WHERE slug = 'enterprise';

-- Add stripe_product_id column to plan table for better Stripe integration
ALTER TABLE plan ADD COLUMN IF NOT EXISTS stripe_product_id text;
ALTER TABLE plan ADD CONSTRAINT valid_stripe_product_id_format
  CHECK (stripe_product_id IS NULL OR stripe_product_id ~ '^prod_(test_)?[a-zA-Z0-9]+$');

-- Update with Stripe product IDs
UPDATE plan SET stripe_product_id = 'prod_TJ3wnJmnh994fm' WHERE slug = 'essential';
UPDATE plan SET stripe_product_id = 'prod_TJ3wEEskj8hM4R' WHERE slug = 'growth';
UPDATE plan SET stripe_product_id = 'prod_TJ3wpQuXztGOK3' WHERE slug = 'pro';
UPDATE plan SET stripe_product_id = 'prod_TJ3wDlsVVABcCt' WHERE slug = 'elite';

-- Add comment
COMMENT ON COLUMN plan.stripe_product_id IS 'Stripe Product ID linking to the Stripe product catalog. Format: prod_xxxxx (live) or prod_test_xxxxx (test). Used for product-level operations and metadata sync.';

-- Verify the updates
DO $$
BEGIN
  RAISE NOTICE 'Migration complete! Updated plans:';
  RAISE NOTICE 'Essential Plan: price_1SMRoVP9fFsmlAaF9zkoG6QT (monthly), price_1SMRoVP9fFsmlAaFUMgWLMJO (annual)';
  RAISE NOTICE 'Growth Plan: price_1SMRoWP9fFsmlAaFnRp0Qap8 (monthly), price_1SMRoWP9fFsmlAaF4V7jpxQI (annual)';
  RAISE NOTICE 'Pro Plan: price_1SMRoXP9fFsmlAaFSKYWVyRK (monthly), price_1SMRoXP9fFsmlAaFrwN3YGUF (annual)';
  RAISE NOTICE 'Elite Plan: price_1SMRoYP9fFsmlAaFHmXwXCth (monthly), price_1SMRoYP9fFsmlAaFt182MXUM (annual)';
END $$;
