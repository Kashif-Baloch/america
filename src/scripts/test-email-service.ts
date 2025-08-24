import { SubscriptionPlan } from '@prisma/client';
import { sendSubscriptionWelcomeEmail } from '../lib/email-service';

async function testEmailService() {
  try {
    console.log('Testing email service with PRO plan...');
    await sendSubscriptionWelcomeEmail({
      to: 'test@example.com',
      userName: 'Test User',
      plan: SubscriptionPlan.PRO,
    });
    console.log('PRO welcome email sent successfully!');

    console.log('\nTesting email service with PRO+ plan...');
    await sendSubscriptionWelcomeEmail({
      to: 'test@example.com',
      userName: 'Test User',
      plan: SubscriptionPlan.PRO_PLUS,
    });
    console.log('PRO+ welcome email sent successfully!');
    
    console.log('\n✅ Email service tests completed successfully!');
  } catch (error) {
    console.error('❌ Error during email service test:', error);
    process.exit(1);
  }
}

testEmailService();
