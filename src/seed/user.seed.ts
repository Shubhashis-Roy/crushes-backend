import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
import mongoose from 'mongoose';

async function connectDB() {
  const MONGODB_URL = '';
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', (error as Error).message);
    process.exit(1);
  }
}

async function seedUsers() {
  await connectDB();

  const dummyUsers = [
    {
      firstName: 'Riaan',
      lastName: 'Mansukhani',
      emailId: 'riaan@gmail.com',
      password: 'Password@123',
      dateOfBirth: '11/03/1998',
      city: 'Mumbai',
      gender: 'male',
      photoUrl: [
        { url: 'https://i.pravatar.cc/1395', public_id: 'riaan_photo_1' },
        { url: 'https://i.pravatar.cc/1396', public_id: 'riaan_photo_2' },
        { url: 'https://i.pravatar.cc/1397', public_id: 'riaan_photo_3' },
        { url: 'https://i.pravatar.cc/1398', public_id: 'riaan_photo_4' },
        { url: 'https://i.pravatar.cc/1399', public_id: 'riaan_photo_5' },
      ],
      interest: ['women'],
      profession: 'Cloud Engineer',
      organization: 'AWS India',
      education: 'B.Tech',
      bio: 'Engineering the future of cloud.',
      lookingFor: ['friendship'],
      preferredAge: { min: 23, max: 30 },
      preferredDistance: 15,
    },
    {
      firstName: 'Saanvi',
      lastName: 'Gera',
      emailId: 'saanvi@gmail.com',
      password: 'Password@123',
      dateOfBirth: '22/07/1999',
      city: 'Delhi',
      gender: 'female',
      photoUrl: [
        { url: 'https://i.pravatar.cc/1400', public_id: 'saanvi_photo_1' },
        { url: 'https://i.pravatar.cc/1401', public_id: 'saanvi_photo_2' },
        { url: 'https://i.pravatar.cc/1402', public_id: 'saanvi_photo_3' },
        { url: 'https://i.pravatar.cc/1403', public_id: 'saanvi_photo_4' },
        { url: 'https://i.pravatar.cc/1404', public_id: 'saanvi_photo_5' },
      ],
      interest: ['men'],
      profession: 'Dentist',
      organization: 'Smile Care',
      education: 'BDS',
      bio: 'Healthy smiles matter.',
      lookingFor: ['relationship'],
      preferredAge: { min: 22, max: 29 },
      preferredDistance: 12,
    },
    {
      firstName: 'Omkar',
      lastName: 'Joshi',
      emailId: 'omkar@gmail.com',
      password: 'Password@123',
      dateOfBirth: '08/11/1997',
      city: 'Pune',
      gender: 'male',
      photoUrl: [
        { url: 'https://i.pravatar.cc/1405', public_id: 'omkar_photo_1' },
        { url: 'https://i.pravatar.cc/1406', public_id: 'omkar_photo_2' },
        { url: 'https://i.pravatar.cc/1407', public_id: 'omkar_photo_3' },
        { url: 'https://i.pravatar.cc/1408', public_id: 'omkar_photo_4' },
        { url: 'https://i.pravatar.cc/1409', public_id: 'omkar_photo_5' },
      ],
      interest: ['women'],
      profession: 'Automobile Engineer',
      organization: 'Mahindra Auto',
      education: 'B.Tech',
      bio: 'Cars are my passion.',
      lookingFor: ['friendship'],
      preferredAge: { min: 24, max: 32 },
      preferredDistance: 18,
    },
    {
      firstName: 'Charvi',
      lastName: 'Kapoor',
      emailId: 'charvi@gmail.com',
      password: 'Password@123',
      dateOfBirth: '17/05/1999',
      city: 'Chandigarh',
      gender: 'female',
      photoUrl: [
        { url: 'https://i.pravatar.cc/1410', public_id: 'charvi_photo_1' },
        { url: 'https://i.pravatar.cc/1411', public_id: 'charvi_photo_2' },
        { url: 'https://i.pravatar.cc/1412', public_id: 'charvi_photo_3' },
        { url: 'https://i.pravatar.cc/1413', public_id: 'charvi_photo_4' },
        { url: 'https://i.pravatar.cc/1414', public_id: 'charvi_photo_5' },
      ],
      interest: ['men'],
      profession: 'Dermatologist',
      organization: 'SkinCare Clinic',
      education: 'MD',
      bio: 'Passionate about skincare.',
      lookingFor: ['friendship', 'relationship'],
      preferredAge: { min: 23, max: 30 },
      preferredDistance: 12,
    },
    {
      firstName: 'Vihaan',
      lastName: 'Saxena',
      emailId: 'vihaan@gmail.com',
      password: 'Password@123',
      dateOfBirth: '03/09/1996',
      city: 'Gurgaon',
      gender: 'male',
      photoUrl: [
        { url: 'https://i.pravatar.cc/1415', public_id: 'vihaan_photo_1' },
        { url: 'https://i.pravatar.cc/1416', public_id: 'vihaan_photo_2' },
        { url: 'https://i.pravatar.cc/1417', public_id: 'vihaan_photo_3' },
        { url: 'https://i.pravatar.cc/1418', public_id: 'vihaan_photo_4' },
        { url: 'https://i.pravatar.cc/1419', public_id: 'vihaan_photo_5' },
      ],
      interest: ['women'],
      profession: 'MBA Consultant',
      organization: 'KPMG',
      education: 'MBA',
      bio: 'Business thinker.',
      lookingFor: ['marriage'],
      preferredAge: { min: 25, max: 35 },
      preferredDistance: 20,
    },
    {
      firstName: 'Meher',
      lastName: 'Ahluwalia',
      emailId: 'meher@gmail.com',
      password: 'Password@123',
      dateOfBirth: '15/02/1999',
      city: 'Amritsar',
      gender: 'female',
      photoUrl: [
        { url: 'https://i.pravatar.cc/1420', public_id: 'meher_photo_1' },
        { url: 'https://i.pravatar.cc/1421', public_id: 'meher_photo_2' },
        { url: 'https://i.pravatar.cc/1422', public_id: 'meher_photo_3' },
        { url: 'https://i.pravatar.cc/1423', public_id: 'meher_photo_4' },
        { url: 'https://i.pravatar.cc/1424', public_id: 'meher_photo_5' },
      ],
      interest: ['men'],
      profession: 'Makeup Artist',
      organization: 'Beauty Studio',
      education: 'Diploma',
      bio: 'Enhancing beauty everyday.',
      lookingFor: ['relationship'],
      preferredAge: { min: 22, max: 29 },
      preferredDistance: 14,
    },
    {
      firstName: 'Aarush',
      lastName: 'Nair',
      emailId: 'aarush@gmail.com',
      password: 'Password@123',
      dateOfBirth: '27/08/1997',
      city: 'Kochi',
      gender: 'male',
      photoUrl: [
        { url: 'https://i.pravatar.cc/1425', public_id: 'aarush_photo_1' },
        { url: 'https://i.pravatar.cc/1426', public_id: 'aarush_photo_2' },
        { url: 'https://i.pravatar.cc/1427', public_id: 'aarush_photo_3' },
        { url: 'https://i.pravatar.cc/1428', public_id: 'aarush_photo_4' },
        { url: 'https://i.pravatar.cc/1429', public_id: 'aarush_photo_5' },
      ],
      interest: ['women'],
      profession: 'Marine Engineer',
      organization: 'Shipping Corp',
      education: 'B.Tech Marine',
      bio: 'Oceans are my second home.',
      lookingFor: ['friendship'],
      preferredAge: { min: 25, max: 35 },
      preferredDistance: 25,
    },
    {
      firstName: 'Ishita',
      lastName: 'Bindra',
      emailId: 'ishita@gmail.com',
      password: 'Password@123',
      dateOfBirth: '11/05/1999',
      city: 'Delhi',
      gender: 'female',
      photoUrl: [
        { url: 'https://i.pravatar.cc/1430', public_id: 'ishita_photo_1' },
        { url: 'https://i.pravatar.cc/1431', public_id: 'ishita_photo_2' },
        { url: 'https://i.pravatar.cc/1432', public_id: 'ishita_photo_3' },
        { url: 'https://i.pravatar.cc/1433', public_id: 'ishita_photo_4' },
        { url: 'https://i.pravatar.cc/1434', public_id: 'ishita_photo_5' },
      ],
      interest: ['men'],
      profession: 'Lawyer',
      organization: 'High Court',
      education: 'LLB',
      bio: 'Fighting for justice.',
      lookingFor: ['friendship', 'relationship'],
      preferredAge: { min: 23, max: 29 },
      preferredDistance: 14,
    },
    {
      firstName: 'Devina',
      lastName: 'Merchant',
      emailId: 'devina@gmail.com',
      password: 'Password@123',
      dateOfBirth: '13/08/1998',
      city: 'Surat',
      gender: 'female',
      photoUrl: [
        { url: 'https://i.pravatar.cc/1435', public_id: 'devina_photo_1' },
        { url: 'https://i.pravatar.cc/1436', public_id: 'devina_photo_2' },
        { url: 'https://i.pravatar.cc/1437', public_id: 'devina_photo_3' },
        { url: 'https://i.pravatar.cc/1438', public_id: 'devina_photo_4' },
        { url: 'https://i.pravatar.cc/1439', public_id: 'devina_photo_5' },
      ],
      interest: ['men'],
      profession: 'Chartered Accountant',
      organization: 'Deloitte',
      education: 'CA',
      bio: 'Numbers & precision.',
      lookingFor: ['relationship'],
      preferredAge: { min: 24, max: 30 },
      preferredDistance: 12,
    },
    {
      firstName: 'Athul',
      lastName: 'Suresh',
      emailId: 'athul@gmail.com',
      password: 'Password@123',
      dateOfBirth: '21/11/1996',
      city: 'Trivandrum',
      gender: 'male',
      photoUrl: [
        { url: 'https://i.pravatar.cc/1440', public_id: 'athul_photo_1' },
        { url: 'https://i.pravatar.cc/1441', public_id: 'athul_photo_2' },
        { url: 'https://i.pravatar.cc/1442', public_id: 'athul_photo_3' },
        { url: 'https://i.pravatar.cc/1443', public_id: 'athul_photo_4' },
        { url: 'https://i.pravatar.cc/1444', public_id: 'athul_photo_5' },
      ],
      interest: ['women'],
      profession: 'Civil Engineer',
      organization: 'L&T',
      education: 'B.Tech',
      bio: 'Helping build tomorrow.',
      lookingFor: ['friendship'],
      preferredAge: { min: 25, max: 35 },
      preferredDistance: 20,
    },
  ];

  for (const user of dummyUsers) {
    const exists = await UserModel.findOne({ emailId: user.emailId });

    if (exists) {
      console.log(`❌ Skipped (already exists): ${user.emailId}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await UserModel.create({
      ...user,
      password: hashedPassword,
    });

    // console.log(`✅ Inserted: ${user.emailId}`);
  }

  console.log(`🎉 Dummy seeding complete total user: ${dummyUsers?.length}`);
  process.exit();
}

seedUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
