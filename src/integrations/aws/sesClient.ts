import { SESClient } from '@aws-sdk/client-ses';

const REGION = 'ap-south-1';

const { AWS_SES_ACCESS_KEY, AWS_SES_SECRET_KEY } = process.env;

if (!AWS_SES_ACCESS_KEY || !AWS_SES_SECRET_KEY) {
  throw new Error('Missing AWS SES credentials in environment variables.');
}

const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: AWS_SES_ACCESS_KEY,
    secretAccessKey: AWS_SES_SECRET_KEY,
  },
});

export { sesClient };
