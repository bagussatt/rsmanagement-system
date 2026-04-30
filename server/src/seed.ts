import { PrismaClient, Role } from '@prisma/client';
import { HashService } from './common/hash.service';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

const main = async () => {
  console.log('🌱 Starting database seeding...');

  // Hash passwords
  const hashService = new HashService();
  const defaultPassword = await hashService.hashPassword('password123');

  // 1. Create Users
  console.log('📝 Creating users...');

  // Admin
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: defaultPassword,
      name: 'System Administrator',
      role: Role.ADMIN,
      phone: '081234567890',
    },
  });

  // Doctors
  const drAhmad = await prisma.user.upsert({
    where: { username: 'dr.ahmad' },
    update: {},
    create: {
      username: 'dr.ahmad',
      password: defaultPassword,
      name: 'Dr. Ahmad Santoso',
      role: Role.DOKTER,
      specialization: 'Penyakit Dalam',
      sip: 'SIP123456',
      phone: '081234567891',
    },
  });

  const drSiti = await prisma.user.upsert({
    where: { username: 'dr.siti' },
    update: {},
    create: {
      username: 'dr.siti',
      password: defaultPassword,
      name: 'Dr. Siti Aminah',
      role: Role.DOKTER,
      specialization: 'Anak',
      sip: 'SIP123457',
      phone: '081234567892',
    },
  });

  const drBudi = await prisma.user.upsert({
    where: { username: 'dr.budi' },
    update: {},
    create: {
      username: 'dr.budi',
      password: defaultPassword,
      name: 'Dr. Budi Pratama',
      role: Role.DOKTER,
      specialization: 'Bedah',
      sip: 'SIP123458',
      phone: '081234567893',
    },
  });

  // Nurse
  const nurseRina = await prisma.user.upsert({
    where: { username: 'perawat.rina' },
    update: {},
    create: {
      username: 'perawat.rina',
      password: defaultPassword,
      name: 'Rina Marlina',
      role: Role.PERAWAT,
      phone: '081234567894',
    },
  });

  // Midwife
  const bidanDewi = await prisma.user.upsert({
    where: { username: 'bidan.dewi' },
    update: {},
    create: {
      username: 'bidan.dewi',
      password: defaultPassword,
      name: 'Bidan Dewi Sartika',
      role: Role.BIDAN,
      sip: 'SIB123459',
      phone: '081234567895',
    },
  });

  // Nutritionist
  const nutritionistFitri = await prisma.user.upsert({
    where: { username: 'ahli_gizi.fitri' },
    update: {},
    create: {
      username: 'ahli_gizi.fitri',
      password: defaultPassword,
      name: 'Fitri Handayani',
      role: Role.AHLI_GIZI,
      phone: '081234567896',
    },
  });

  // Pharmacist
  const pharmacistAndi = await prisma.user.upsert({
    where: { username: 'apoteker.andi' },
    update: {},
    create: {
      username: 'apoteker.andi',
      password: defaultPassword,
      name: 'Andi Wijaya',
      role: Role.APOTEKER,
      sip: 'SIA123460',
      phone: '081234567897',
    },
  });

  // Physiotherapist
  const physioYanto = await prisma.user.upsert({
    where: { username: 'fisioterapis.yanto' },
    update: {},
    create: {
      username: 'fisioterapis.yanto',
      password: defaultPassword,
      name: 'Yanto Kusuma',
      role: Role.FISIOTERAPIS,
      phone: '081234567898',
    },
  });

  console.log(`✅ Created 9 users`);

  // 2. Create Patients
  console.log('👥 Creating patients...');

  const patient1 = await prisma.patient.upsert({
    where: { medicalRecordNumber: 'MRN001' },
    update: {},
    create: {
      medicalRecordNumber: 'MRN001',
      name: 'Bambang Sutrisno',
      birthDate: new Date('1975-05-15'),
      gender: 'Laki-laki',
      address: 'Jl. Merdeka No. 123, Jakarta',
      phone: '085678901234',
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { medicalRecordNumber: 'MRN002' },
    update: {},
    create: {
      medicalRecordNumber: 'MRN002',
      name: 'Sri Wahyuni',
      birthDate: new Date('1980-08-22'),
      gender: 'Perempuan',
      address: 'Jl. Sudirman No. 45, Jakarta',
      phone: '085678901235',
    },
  });

  const patient3 = await prisma.patient.upsert({
    where: { medicalRecordNumber: 'MRN003' },
    update: {},
    create: {
      medicalRecordNumber: 'MRN003',
      name: 'Agus Setiawan',
      birthDate: new Date('1965-12-10'),
      gender: 'Laki-laki',
      address: 'Jl. Gatot Subroto No. 78, Jakarta',
      phone: '085678901236',
    },
  });

  const patient4 = await prisma.patient.upsert({
    where: { medicalRecordNumber: 'MRN004' },
    update: {},
    create: {
      medicalRecordNumber: 'MRN004',
      name: 'Dewi Lestari',
      birthDate: new Date('1990-03-25'),
      gender: 'Perempuan',
      address: 'Jl. Thamrin No. 12, Jakarta',
      phone: '085678901237',
    },
  });

  const patient5 = await prisma.patient.upsert({
    where: { medicalRecordNumber: 'MRN005' },
    update: {},
    create: {
      medicalRecordNumber: 'MRN005',
      name: 'Eko Prasetyo',
      birthDate: new Date('1988-07-08'),
      gender: 'Laki-laki',
      address: 'Jl. Pancoran No. 56, Jakarta',
      phone: '085678901238',
    },
  });

  console.log(`✅ Created 5 patients`);

  // 3. Create Visits
  console.log('🏥 Creating visits...');

  const visit1 = await prisma.visit.upsert({
    where: { id: 'visit1' },
    update: {},
    create: {
      id: 'visit1',
      patientId: patient1.id,
      checkInAt: new Date('2024-01-15T08:00:00Z'),
      status: 'SELESAI',
    },
  });

  const visit2 = await prisma.visit.upsert({
    where: { id: 'visit2' },
    update: {},
    create: {
      id: 'visit2',
      patientId: patient2.id,
      checkInAt: new Date('2024-01-16T09:30:00Z'),
      status: 'SELESAI',
    },
  });

  const visit3 = await prisma.visit.upsert({
    where: { id: 'visit3' },
    update: {},
    create: {
      id: 'visit3',
      patientId: patient3.id,
      checkInAt: new Date('2024-01-17T10:00:00Z'),
      status: 'RAWAT_INAP',
    },
  });

  const visit4 = await prisma.visit.upsert({
    where: { id: 'visit4' },
    update: {},
    create: {
      id: 'visit4',
      patientId: patient4.id,
      checkInAt: new Date('2024-01-18T14:00:00Z'),
      status: 'RAWAT_JALAN',
    },
  });

  const visit5 = await prisma.visit.upsert({
    where: { id: 'visit5' },
    update: {},
    create: {
      id: 'visit5',
      patientId: patient5.id,
      checkInAt: new Date('2024-01-19T11:00:00Z'),
      status: 'SELESAI',
    },
  });

  console.log(`✅ Created 5 visits`);

  // 4. Create CPPT Entries
  console.log('📋 Creating CPPT entries...');

  await prisma.cppt.upsert({
    where: { id: 'cppt1' },
    update: {},
    create: {
      id: 'cppt1',
      visitId: visit1.id,
      patientId: patient1.id,
      authorId: drAhmad.id,
      subjective: 'Pasien mengeluh sakit kepala sejak 3 hari yang lalu, disertai pusing dan mual',
      objective: 'TD: 130/80 mmHg, N: 82x/menit, T: 37.2°C, Kesadaran: compos mentis',
      assessment: 'Hipertensi esensial',
      plan: '1. Obat antihipertensi\n2. Diet rendah garam\n3. Kontrol 1 minggu',
      instruction: 'Istirahat cukup, hindari stres',
      isVerified: true,
      verifiedById: drSiti.id,
      verifiedAt: new Date('2024-01-15T09:00:00Z'),
    },
  });

  await prisma.cppt.upsert({
    where: { id: 'cppt2' },
    update: {},
    create: {
      id: 'cppt2',
      visitId: visit2.id,
      patientId: patient2.id,
      authorId: drSiti.id,
      subjective: 'Anak demam sejak 2 hari, batuk pilek, nafsu makan menurun',
      objective: 'TD: 100/70 mmHg, N: 100x/menit, T: 38.5°C, BB: 18 kg',
      assessment: 'ISPA (Infeksi Saluran Pernapasan Akut)',
      plan: '1. Paracetamol sirup\n2. Antibiotik\n3. Kompres air hangat',
      instruction: 'Berikan cairan cukup, monitor suhu tubuh',
      isVerified: true,
      verifiedById: drAhmad.id,
      verifiedAt: new Date('2024-01-16T10:00:00Z'),
    },
  });

  await prisma.cppt.upsert({
    where: { id: 'cppt3' },
    update: {},
    create: {
      id: 'cppt3',
      visitId: visit3.id,
      patientId: patient3.id,
      authorId: drBudi.id,
      subjective: 'Pasien sesak napas sejak 1 minggu, bengkak pada tungkai',
      objective: 'TD: 150/90 mmHg, N: 88x/menit, T: 36.8°C, Edema tungkai +',
      assessment: 'Gagal jantung kongestif',
      plan: '1. Diuretik\n2. Digitalis\n3. Restriksi cairan\n4. Rawat inap',
      instruction: 'Pantau intake-output, timbang berat badan harian',
      isVerified: false,
    },
  });

  await prisma.cppt.upsert({
    where: { id: 'cppt4' },
    update: {},
    create: {
      id: 'cppt4',
      visitId: visit4.id,
      patientId: patient4.id,
      authorId: drAhmad.id,
      subjective: 'Sakit perut bagian bawah sejak 3 hari, haid tidak teratur',
      objective: 'TD: 110/70 mmHg, N: 76x/menit, T: 36.5°C, abdomen tegang',
      assessment: 'PCO (Polycystic Ovary Syndrome)',
      plan: '1. USG abdomen\n2. Konsul ke kandungan\n3. Terapi hormonal',
      instruction: 'Pantau siklus haid, diet seimbang',
      isVerified: false,
    },
  });

  await prisma.cppt.upsert({
    where: { id: 'cppt5' },
    update: {},
    create: {
      id: 'cppt5',
      visitId: visit5.id,
      patientId: patient5.id,
      authorId: drSiti.id,
      subjective: 'Nyeri sendi lutut kanan saat berjalan, kaki sering terkilir',
      objective: 'TD: 120/80 mmHg, N: 72x/menit, T: 36.7°C, lutut kanan bengkak',
      assessment: 'Sprain sendi lutut grade 2',
      plan: '1. Fisioterapi\n2. NSAID\n3. Kanggor air hangat\n4. Istirahat',
      instruction: 'Kompres dingin 24 jam pertama, hindari berat badan',
      isVerified: true,
      verifiedById: physioYanto.id,
      verifiedAt: new Date('2024-01-19T12:00:00Z'),
    },
  });

  console.log(`✅ Created 5 CPPT entries`);

  // 5. Create Medical Resumes
  console.log('📄 Creating medical resumes...');

  await prisma.medicalResume.upsert({
    where: { id: 'resume1' },
    update: {},
    create: {
      id: 'resume1',
      patientId: patient3.id,
      authorId: drBudi.id,
      diagnosis: 'Gagal jantung kongestif NYHA III',
      mainComplaint: 'Sesak napas berat sejak 1 minggu, edema tungkai +',
      treatmentPlan: 'Furosemide 40mg 2x sehari, Spironolakton 25mg 1x sehari, Bisoprolol 5mg 1x sehari, ACE Inhibitor. Rencana katerisasi jantung 24 jam.',
      recommendations: '1. Poliklinik jantung 1 minggu\n2. Laboratorium fungsi ginjal 3 hari\n3. Echo follow-up 1 bulan\n4. Lanjut obat jantung, kontrol rutin',
      notes: 'EKG: Ritme sinus, LVH. Echo: EF 35%, dilatasi seluruh ruang. Laboratorium: BNP 450 pg/mL, Kreatinin 1.8 mg/dL. Dengan terapi optimal, prognosis quoad vitam baik, quoad restitution ad integram dubia.',
    },
  });

  await prisma.medicalResume.upsert({
    where: { id: 'resume2' },
    update: {},
    create: {
      id: 'resume2',
      patientId: patient5.id,
      authorId: drSiti.id,
      diagnosis: 'Sprain ligamen anterior cruciate lutut kanan grade 2',
      mainComplaint: 'Cedera lutut kanan berulang, terkilir saat bermain futsal',
      treatmentPlan: 'Konservatif dengan fisioterapi intensif. Ibuprofen 400mg 3x sehari, Vitamin D 1000 IU 1x sehari.',
      recommendations: '1. Fisioterapi 3x seminggu selama 4 minggu\n2. Kontrol MRI 6 minggu\n3. Evaluasi kembali berolahraga setelah 3 bulan\n4. Lanjut NSAID 5 hari',
      notes: 'MRI lutut: Robekan ligamen anterior cruciate grade 2, meniskus medial intact. LGS -. Prognosis baik dengan fisioterapi adekuat, dapat kembali beraktivitas normal dalam 6-8 minggu.',
    },
  });

  console.log(`✅ Created 2 medical resumes`);

  console.log('');
  console.log('🎉 Database seeding completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - Users: 9 (1 Admin, 3 Doctors, 1 Nurse, 1 Midwife, 1 Nutritionist, 1 Pharmacist, 1 Physiotherapist)`);
  console.log(`   - Patients: 5`);
  console.log(`   - Visits: 5`);
  console.log(`   - CPPT Entries: 5`);
  console.log(`   - Medical Resumes: 2`);
  console.log('');
  console.log('🔑 Login Credentials:');
  console.log(`   Username: admin, Password: password123`);
  console.log(`   Username: dr.ahmad, Password: password123`);
  console.log(`   Username: dr.siti, Password: password123`);
  console.log('');
};

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
