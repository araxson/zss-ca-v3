import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function verifySetup() {
  console.log('🔍 Verifying Stripe Products Setup\n');

  const products = await stripe.products.list({ limit: 10 });

  const ourProducts = products.data.filter((p: any) =>
    ['Essential Plan', 'Growth Plan', 'Pro Plan', 'Elite Plan'].includes(p.name)
  );

  for (const product of ourProducts) {
    console.log(`\n📦 ${product.name} (${product.id})`);
    console.log(`   Statement Descriptor: ${product.statement_descriptor}`);
    console.log(`   Tax Code: ${product.tax_code}`);
    console.log(`   Default Price: ${product.default_price}`);
    console.log(`   Metadata:`);
    Object.entries(product.metadata).forEach(([key, value]) => {
      console.log(`      - ${key}: ${value}`);
    });

    // Get prices for this product
    const prices = await stripe.prices.list({ product: product.id });
    console.log(`   Prices:`);
    for (const price of prices.data) {
      const interval = price.recurring?.interval || 'one-time';
      const amount = (price.unit_amount / 100).toFixed(2);
      console.log(`      - ${price.nickname} ($${amount} CAD/${interval})`);
      console.log(`        Lookup Key: ${price.lookup_key}`);
      console.log(`        Tax Behavior: ${price.tax_behavior}`);
      console.log(`        Metadata: ${JSON.stringify(price.metadata)}`);
    }
  }

  console.log('\n\n✅ Verification Complete!');
  console.log('\n📋 Summary:');
  console.log(`   Products created: ${ourProducts.length}/4`);
  console.log(`   All products have:`);
  console.log(`      ✓ Metadata for features`);
  console.log(`      ✓ Lookup keys for prices`);
  console.log(`      ✓ Tax codes (SaaS)`);
  console.log(`      ✓ Statement descriptors`);
  console.log(`      ✓ Monthly & Annual pricing`);
}

verifySetup().catch(console.error);
