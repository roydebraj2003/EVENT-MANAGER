import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with Indian Rupee (INR) data and Admin SaaS records...');

  // Clean existing data in reverse order of foreign keys
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.event.deleteMany();
  await prisma.freelancerService.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.education.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.category.deleteMany();
  await prisma.freelancerProfile.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Categories
  const catCatering = await prisma.category.create({
    data: {
      name: 'Catering & Food Services',
      iconUrl: 'UtensilsCrossed',
      subCategories: {
        create: [
          { name: 'Traditional Indian Wedding Feast', iconUrl: 'Utensils' },
          { name: 'Private Gourmet Chef', iconUrl: 'ChefHat' },
          { name: 'Cocktail & Mocktail Bar', iconUrl: 'Wine' },
          { name: 'Mithai & Dessert Counters', iconUrl: 'Cake' },
        ],
      },
    },
  });

  const catDecor = await prisma.category.create({
    data: {
      name: 'Decoration & Theme Styling',
      iconUrl: 'Sparkles',
      subCategories: {
        create: [
          { name: 'Mandap & Stage Setup', iconUrl: 'Flower2' },
          { name: 'Haldi & Sangeet Floral Decor', iconUrl: 'PartyPopper' },
          { name: 'Fairy Lighting & Mood Ambience', iconUrl: 'Lamp' },
          { name: 'Modern Theme & Backdrop Design', iconUrl: 'Palette' },
        ],
      },
    },
  });

  const catMakeup = await prisma.category.create({
    data: {
      name: 'Makeup, Hair & Styling',
      iconUrl: 'Smile',
      subCategories: {
        create: [
          { name: 'Bridal HD & Airbrush Makeup', iconUrl: 'Heart' },
          { name: 'Sangeet & Party Glam', iconUrl: 'Sparkle' },
          { name: 'Bridal Mehndi & Henna Art', iconUrl: 'Brush' },
        ],
      },
    },
  });

  const catCleaning = await prisma.category.create({
    data: {
      name: 'Cleaning & Venue Prep',
      iconUrl: 'Brush',
      subCategories: {
        create: [
          { name: 'Post-Wedding Venue Deep Clean', iconUrl: 'Sparkles' },
          { name: 'Banquet Hall Sanitization', iconUrl: 'ShieldCheck' },
          { name: 'Event Waste & Disposal Management', iconUrl: 'Trash2' },
        ],
      },
    },
  });

  const catPhoto = await prisma.category.create({
    data: {
      name: 'Photography & Videography',
      iconUrl: 'Camera',
      subCategories: {
        create: [
          { name: 'Pre-Wedding & Wedding Shoots', iconUrl: 'Camera' },
          { name: 'Cinematic Teasers & Drone Coverage', iconUrl: 'Video' },
        ],
      },
    },
  });

  const catEntertainment = await prisma.category.create({
    data: {
      name: 'Music, DJ & Entertainment',
      iconUrl: 'Music',
      subCategories: {
        create: [
          { name: 'Bollywood DJ & Sound Rig', iconUrl: 'Disc' },
          { name: 'Live Acoustic & Sufi Troupe', iconUrl: 'Mic2' },
          { name: 'Anchor & Emcee Host', iconUrl: 'Megaphone' },
        ],
      },
    },
  });

  // 2. Create Users
  // Admin User
  const adminUser = await prisma.user.create({
    data: {
      fullName: 'Rajesh Sharma',
      email: 'admin@occasionhub.com',
      passwordHash: 'hashed_admin_password',
      phone: '+91 98765 43210',
      role: 'ADMIN',
      location: 'Mumbai, Maharashtra',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    },
  });

  // Client Users
  const clientUser1 = await prisma.user.create({
    data: {
      fullName: 'Pooja Agarwal',
      email: 'pooja.agarwal@example.com',
      passwordHash: 'hashed_password_123',
      phone: '+91 98234 56789',
      role: 'CLIENT',
      location: 'South Mumbai, Mumbai',
      profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      clientProfile: { create: {} },
    },
    include: { clientProfile: true },
  });

  const clientUser2 = await prisma.user.create({
    data: {
      fullName: 'Vikram Singhania',
      email: 'vikram.singhania@corp.in',
      passwordHash: 'hashed_password_123',
      phone: '+91 98111 22334',
      role: 'CLIENT',
      location: 'Bengaluru, Karnataka',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      clientProfile: { create: {} },
    },
    include: { clientProfile: true },
  });

  // Solo Specialists (Individuals)
  const soloChefUser = await prisma.user.create({
    data: {
      fullName: 'Chef Sanjeev Roy',
      email: 'chef.sanjeev@example.com',
      passwordHash: 'hashed_password_123',
      phone: '+91 98333 44556',
      role: 'FREELANCER',
      location: 'Bandra, Mumbai',
      profilePicture: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&auto=format&fit=crop&q=80',
      freelancerProfile: {
        create: {
          bio: 'Five-star trained royal banquet chef specializing in Awadhi, Mughlai, and modern fusion sit-down dinners for bespoke anniversaries and milestones.',
          experienceYears: 10,
          hourlyRate: 2500.00,
          providerType: 'INDIVIDUAL',
          teamSize: 1,
          rating: 4.9,
          totalReviews: 28,
          isVerified: true,
        },
      },
    },
    include: { freelancerProfile: true },
  });

  const soloMakeupUser = await prisma.user.create({
    data: {
      fullName: 'Ananya Mehra',
      email: 'ananya.mehra@example.com',
      passwordHash: 'hashed_password_123',
      phone: '+91 98444 55667',
      role: 'FREELANCER',
      location: 'Delhi NCR, New Delhi',
      profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      freelancerProfile: {
        create: {
          bio: 'Celebrity and bridal makeup artist specializing in HD and Airbrush bridal looks, traditional Sangeet glam, and timeless aesthetics.',
          experienceYears: 7,
          hourlyRate: 1800.00,
          providerType: 'INDIVIDUAL',
          teamSize: 1,
          rating: 5.0,
          totalReviews: 36,
          isVerified: true,
        },
      },
    },
    include: { freelancerProfile: true },
  });

  const soloDecorUser = await prisma.user.create({
    data: {
      fullName: 'Rohit Verma',
      email: 'rohit.verma.decor@example.com',
      passwordHash: 'hashed_password_123',
      phone: '+91 98555 66778',
      role: 'FREELANCER',
      location: 'Jaipur, Rajasthan',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      freelancerProfile: {
        create: {
          bio: 'Boutique floral artist creating heritage marigold & rose mandaps, fairytale aisle backdrops, and intimate destination wedding setups.',
          experienceYears: 6,
          hourlyRate: 1500.00,
          providerType: 'INDIVIDUAL',
          teamSize: 1,
          rating: 4.8,
          totalReviews: 22,
          isVerified: true,
        },
      },
    },
    include: { freelancerProfile: true },
  });

  const soloCleanerUser = await prisma.user.create({
    data: {
      fullName: 'Sunita Devi',
      email: 'sunita.cleaning@example.com',
      passwordHash: 'hashed_password_123',
      phone: '+91 98666 77889',
      role: 'FREELANCER',
      location: 'Andheri, Mumbai',
      profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      freelancerProfile: {
        create: {
          bio: 'Punctual and meticulous professional specializing in pre-event deep dusting, sanitization, and speedy post-reception hall clearing.',
          experienceYears: 8,
          hourlyRate: 800.00,
          providerType: 'INDIVIDUAL',
          teamSize: 1,
          rating: 4.9,
          totalReviews: 31,
          isVerified: true,
        },
      },
    },
    include: { freelancerProfile: true },
  });

  // Group / Agency Providers
  const groupCateringUser = await prisma.user.create({
    data: {
      fullName: 'Shahi Dawat Banquet Caterers',
      email: 'contact@shahidawat.in',
      passwordHash: 'hashed_password_123',
      phone: '+91 98777 88990',
      role: 'FREELANCER',
      location: 'Mumbai, Maharashtra',
      profilePicture: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&auto=format&fit=crop&q=80',
      freelancerProfile: {
        create: {
          bio: 'Premier 8-person luxury catering brigade with master halwais, live chaat stalls, continental counters, and professional captains for 100 to 1,000 guests.',
          experienceYears: 15,
          hourlyRate: 6500.00,
          providerType: 'GROUP',
          teamSize: 8,
          rating: 4.95,
          totalReviews: 64,
          isVerified: true,
        },
      },
    },
    include: { freelancerProfile: true },
  });

  const groupCleaningUser = await prisma.user.create({
    data: {
      fullName: 'Swachh Events Venue Crew',
      email: 'ops@swachhevents.in',
      passwordHash: 'hashed_password_123',
      phone: '+91 98888 99001',
      role: 'FREELANCER',
      location: 'Mumbai & Thane',
      profilePicture: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80',
      freelancerProfile: {
        create: {
          bio: 'Trained commercial venue cleaning squad of 5 attendants with industrial vacuums, steam sanitizers, and waste segregators for lawn & hall weddings.',
          experienceYears: 9,
          hourlyRate: 3500.00,
          providerType: 'GROUP',
          teamSize: 5,
          rating: 4.88,
          totalReviews: 48,
          isVerified: true,
        },
      },
    },
    include: { freelancerProfile: true },
  });

  const groupDecorUser = await prisma.user.create({
    data: {
      fullName: 'Utsav Grand Stage & Decor Crew',
      email: 'contact@utsavdecor.in',
      passwordHash: 'hashed_password_123',
      phone: '+91 98999 00112',
      role: 'FREELANCER',
      location: 'Delhi & Jaipur',
      profilePicture: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80',
      freelancerProfile: {
        create: {
          bio: 'Large-scale 6-member wedding decor production agency. We craft 40-foot floral mandaps, crystal chandeliers, truss lighting, and royal entryway tunnels.',
          experienceYears: 12,
          hourlyRate: 5000.00,
          providerType: 'GROUP',
          teamSize: 6,
          rating: 4.92,
          totalReviews: 42,
          isVerified: true,
        },
      },
    },
    include: { freelancerProfile: true },
  });

  // An Unverified Talent Profile (for Admin verification review)
  const unverifiedUser = await prisma.user.create({
    data: {
      fullName: 'Aarav Sound & Beats',
      email: 'aarav.sound@example.com',
      passwordHash: 'hashed_password_123',
      phone: '+91 98000 11223',
      role: 'FREELANCER',
      location: 'Bengaluru, Karnataka',
      profilePicture: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
      freelancerProfile: {
        create: {
          bio: 'Independent live DJ and dhol player team for Sangeet nights and cocktail parties. Looking for official marketplace verification.',
          experienceYears: 4,
          hourlyRate: 2000.00,
          providerType: 'GROUP',
          teamSize: 3,
          rating: 4.6,
          totalReviews: 8,
          isVerified: false, // Pending admin approval
        },
      },
    },
    include: { freelancerProfile: true },
  });

  // 3. Add Services (in INR)
  // Solo Chef Services
  await prisma.freelancerService.createMany({
    data: [
      {
        freelancerId: soloChefUser.freelancerProfile!.id,
        categoryId: catCatering.id,
        price: 28000.00,
        description: 'Bespoke 5-course Awadhi & Mughlai Royal Plated Dinner for intimate gathering (up to 15 guests).',
      },
      {
        freelancerId: soloChefUser.freelancerProfile!.id,
        categoryId: catCatering.id,
        price: 45000.00,
        description: 'Live Gourmet Tawa & Kebab Tasting Bar with artisanal breads and accompaniment spread.',
      },
    ],
  });

  // Solo Makeup Services
  await prisma.freelancerService.createMany({
    data: [
      {
        freelancerId: soloMakeupUser.freelancerProfile!.id,
        categoryId: catMakeup.id,
        price: 22000.00,
        description: 'Bridal HD Makeup & Hair Styling package with premium lashes, draping, and touch-up kit.',
      },
      {
        freelancerId: soloMakeupUser.freelancerProfile!.id,
        categoryId: catMakeup.id,
        price: 12000.00,
        description: 'Engagement & Sangeet Evening Glam look with false lashes and hair accessories.',
      },
    ],
  });

  // Solo Decor Services
  await prisma.freelancerService.createMany({
    data: [
      {
        freelancerId: soloDecorUser.freelancerProfile!.id,
        categoryId: catDecor.id,
        price: 35000.00,
        description: 'Traditional Marigold & Tuberose Haldi floral photo backdrop with brass urlis and cushions.',
      },
      {
        freelancerId: soloDecorUser.freelancerProfile!.id,
        categoryId: catDecor.id,
        price: 20000.00,
        description: 'Table centerpiece and stage floral runner package for 10 dining tables.',
      },
    ],
  });

  // Solo Cleaner Services
  await prisma.freelancerService.createMany({
    data: [
      {
        freelancerId: soloCleanerUser.freelancerProfile!.id,
        categoryId: catCleaning.id,
        price: 6000.00,
        description: 'Pre-event residential deep scrubbing, brass polishing, and room prep (up to 5 hours).',
      },
      {
        freelancerId: soloCleanerUser.freelancerProfile!.id,
        categoryId: catCleaning.id,
        price: 8500.00,
        description: 'Post-event overnight sweep, dish sanitizing, and trash clearance for banquet halls.',
      },
    ],
  });

  // Group Catering Services
  await prisma.freelancerService.createMany({
    data: [
      {
        freelancerId: groupCateringUser.freelancerProfile!.id,
        categoryId: catCatering.id,
        price: 165000.00,
        description: 'Grand Wedding Buffet for up to 200 guests: 6 appetizers, 8 main courses, live chaat counter, and 4 artisanal desserts with complete captain service.',
      },
      {
        freelancerId: groupCateringUser.freelancerProfile!.id,
        categoryId: catCatering.id,
        price: 85000.00,
        description: 'Cocktail & Sangeet Evening Spread: Live pasta station, slider bar, dim sum station, and bartender team for 100 guests.',
      },
    ],
  });

  // Group Cleaning Services
  await prisma.freelancerService.createMany({
    data: [
      {
        freelancerId: groupCleaningUser.freelancerProfile!.id,
        categoryId: catCleaning.id,
        price: 25000.00,
        description: '5-Person Express Wedding Lawn Cleanup Squad (restoring lawns within 3 hours post-event).',
      },
      {
        freelancerId: groupCleaningUser.freelancerProfile!.id,
        categoryId: catCleaning.id,
        price: 38000.00,
        description: 'Full-day Venue Hygiene Attendants (regular restroom sanitization, continuous trash disposal, spill management).',
      },
    ],
  });

  // Group Decor Services
  await prisma.freelancerService.createMany({
    data: [
      {
        freelancerId: groupDecorUser.freelancerProfile!.id,
        categoryId: catDecor.id,
        price: 145000.00,
        description: 'Royal Palace Mandap & Grand Entrance Tunnel: 4-pillar floral dome, chandelier ceiling, and grand mirror carpet.',
      },
      {
        freelancerId: groupDecorUser.freelancerProfile!.id,
        categoryId: catDecor.id,
        price: 75000.00,
        description: 'Neon & Floral Sangeet Stage with LED wall integration and customized couple monogram.',
      },
    ],
  });

  // Unverified Group Service
  await prisma.freelancerService.create({
    data: {
      freelancerId: unverifiedUser.freelancerProfile!.id,
      categoryId: catEntertainment.id,
      price: 35000.00,
      description: 'High-energy DJ setup with 2 Punjab Dhol players and smoke machines for Sangeet nights.',
    },
  });

  // 4. Portfolio Items
  await prisma.portfolioItem.createMany({
    data: [
      {
        freelancerId: soloChefUser.freelancerProfile!.id,
        title: 'Kakori Kebabs & Shahi Tukda Platter',
        mediaUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        description: 'Plated course created for a 25th wedding anniversary celebration in Alibaug.',
      },
      {
        freelancerId: soloMakeupUser.freelancerProfile!.id,
        title: 'Regal Rajputani Bridal Glam',
        mediaUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80',
        description: 'Warm gold eyeshadow with matte red lip and traditional matha patti setting.',
      },
      {
        freelancerId: soloDecorUser.freelancerProfile!.id,
        title: 'Marigold Canopy for Haldi Ceremony',
        mediaUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
        description: 'Sun-drenched yellow marigold curtains with brass urlis filled with fresh petals.',
      },
      {
        freelancerId: groupCateringUser.freelancerProfile!.id,
        title: '500-Guest Royal Palace Feast',
        mediaUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80',
        description: 'Full buffet spread with copper chafing dishes and live jalebi counter.',
      },
      {
        freelancerId: groupDecorUser.freelancerProfile!.id,
        title: 'Enchanted Garden Reception Stage',
        mediaUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&auto=format&fit=crop&q=80',
        description: 'Suspended wisteria trails with warm fairy lights and gold geometric frames.',
      },
    ],
  });

  // 5. Sample Events & Job Postings (in INR)
  const weddingEvent = await prisma.event.create({
    data: {
      clientId: clientUser1.clientProfile!.id,
      title: 'Pooja & Rohan Grand Wedding & Sangeet',
      eventType: 'Wedding',
      eventDate: new Date('2026-11-20'),
      venue: 'Taj Lands End, Bandra',
      city: 'Mumbai, Maharashtra',
      budget: 450000.00,
      status: 'OPEN',
      jobPostings: {
        create: [
          {
            categoryId: catCatering.id,
            description: 'Looking for a premier 8-person catering crew for 150 guests. Authentic North Indian & Continental menu required.',
            budget: 165000.00,
            deadline: new Date('2026-11-01'),
            status: 'OPEN',
          },
          {
            categoryId: catDecor.id,
            description: 'Need floral mandap and stage setup with traditional bells and marigolds.',
            budget: 90000.00,
            deadline: new Date('2026-11-05'),
            status: 'OPEN',
          },
          {
            categoryId: catCleaning.id,
            description: 'Post-reception night cleaning crew needed to restore the lawn within 3 hours.',
            budget: 25000.00,
            deadline: new Date('2026-11-10'),
            status: 'OPEN',
          },
        ],
      },
    },
    include: { jobPostings: true },
  });

  const galaEvent = await prisma.event.create({
    data: {
      clientId: clientUser2.clientProfile!.id,
      title: 'TechNexus Annual Founder Gala & Awards',
      eventType: 'Corporate Gala',
      eventDate: new Date('2026-12-05'),
      venue: 'The Leela Palace',
      city: 'Bengaluru, Karnataka',
      budget: 600000.00,
      status: 'OPEN',
      jobPostings: {
        create: [
          {
            categoryId: catCatering.id,
            description: 'Premium cocktail hour appetizers and live counters for 120 VIP tech executives.',
            budget: 120000.00,
            deadline: new Date('2026-11-15'),
            status: 'OPEN',
          },
          {
            categoryId: catDecor.id,
            description: 'Futuristic stage setup with LED panels and elegant ambient lighting.',
            budget: 80000.00,
            deadline: new Date('2026-11-15'),
            status: 'OPEN',
          },
        ],
      },
    },
    include: { jobPostings: true },
  });

  // 6. Confirmed Proposal & Booking with Escrow Payment (in INR)
  const cateringJob = weddingEvent.jobPostings.find(j => j.categoryId === catCatering.id)!;
  const proposal1 = await prisma.proposal.create({
    data: {
      jobId: cateringJob.id,
      freelancerId: groupCateringUser.freelancerProfile!.id,
      bidAmount: 165000.00,
      message: 'Namaste Pooja! Our 8-person crew at Shahi Dawat would be honoured to cater your wedding. We handle full live counters, uniform captains, and spotless post-dinner clearing.',
      status: 'ACCEPTED',
    },
  });

  const decorJob = weddingEvent.jobPostings.find(j => j.categoryId === catDecor.id)!;
  await prisma.proposal.create({
    data: {
      jobId: decorJob.id,
      freelancerId: soloDecorUser.freelancerProfile!.id,
      bidAmount: 75000.00,
      message: 'Hi Pooja, I specialize in heritage floral mandaps with authentic Rajnigandha and Marigold fragrance. I would love to craft your dream stage.',
      status: 'PENDING',
    },
  });

  // Create Confirmed Booking with 30% Escrow Deposit (₹49,500)
  const booking1 = await prisma.booking.create({
    data: {
      proposalId: proposal1.id,
      eventId: weddingEvent.id,
      freelancerId: groupCateringUser.freelancerProfile!.id,
      clientId: clientUser1.clientProfile!.id,
      totalAmount: 165000.00,
      status: 'CONFIRMED',
      payments: {
        create: {
          amount: 49500.00, // 30% deposit in INR
          paymentType: 'DEPOSIT',
          paymentMethod: 'UPI (Google Pay)',
          paymentStatus: 'COMPLETED',
          transactionId: 'PAY_INR_UPI_998127391',
        },
      },
    },
  });

  // Create Conversation with isolated proposal thread
  const conv1 = await prisma.conversation.create({
    data: {
      proposalId: proposal1.id,
      messages: {
        create: [
          {
            senderId: groupCateringUser.id,
            message: 'Namaste Pooja! Thank you for accepting our proposal. Could you confirm if Jain meal counters are needed for any guests?',
          },
          {
            senderId: clientUser1.id,
            message: 'Yes Shahi Dawat team! We will have approximately 25 guests who need pure Jain food. Please arrange a dedicated live counter.',
          },
          {
            senderId: groupCateringUser.id,
            message: 'Understood! A dedicated Jain station with separate prep and cutlery will be stationed seamlessly.',
          },
        ],
      },
    },
  });

  // 7. Completed Booking & Review for Solo Makeup Artist (in INR)
  const pastEvent = await prisma.event.create({
    data: {
      clientId: clientUser1.clientProfile!.id,
      title: 'Pooja Agarwal Sangeet Night',
      eventType: 'Sangeet Ceremony',
      eventDate: new Date('2026-09-10'),
      venue: 'St. Regis Banquet',
      city: 'Mumbai, Maharashtra',
      budget: 50000.00,
      status: 'COMPLETED',
    },
  });

  const dummyJob = await prisma.jobPosting.create({
    data: {
      eventId: pastEvent.id,
      categoryId: catMakeup.id,
      description: 'Bridal Sangeet glam makeup and hair styling with accessories.',
      budget: 18000.00,
      deadline: new Date('2026-09-05'),
      status: 'FILLED',
    },
  });

  const pastProposal = await prisma.proposal.create({
    data: {
      jobId: dummyJob.id,
      freelancerId: soloMakeupUser.freelancerProfile!.id,
      bidAmount: 18000.00,
      message: 'I would be delighted to style you for your Sangeet night!',
      status: 'ACCEPTED',
    },
  });

  const pastBooking = await prisma.booking.create({
    data: {
      proposalId: pastProposal.id,
      eventId: pastEvent.id,
      freelancerId: soloMakeupUser.freelancerProfile!.id,
      clientId: clientUser1.clientProfile!.id,
      totalAmount: 18000.00,
      status: 'COMPLETED',
      payments: {
        create: [
          {
            amount: 5400.00, // 30% advance
            paymentType: 'DEPOSIT',
            paymentMethod: 'UPI (PhonePe)',
            paymentStatus: 'COMPLETED',
            transactionId: 'PAY_INR_UPI_5400_DEP',
          },
          {
            amount: 12600.00, // 70% final escrow release
            paymentType: 'FINAL',
            paymentMethod: 'UPI (PhonePe)',
            paymentStatus: 'COMPLETED',
            transactionId: 'PAY_INR_UPI_12600_FIN',
          },
        ],
      },
      reviews: {
        create: {
          reviewerId: clientUser1.id,
          revieweeId: soloMakeupUser.id,
          reviewType: 'CLIENT_TO_FREELANCER',
          rating: 5,
          comment: 'Ananya was fabulous! The makeup stayed glowing and fresh through 6 hours of dancing. Highly recommend her to every bride!',
        },
      },
    },
  });

  // 8. Sample Complaint / Dispute (for Admin Dashboard)
  const disputeEvent = await prisma.event.create({
    data: {
      clientId: clientUser2.clientProfile!.id,
      title: 'Vikram Anniversary Dinner Party',
      eventType: 'Anniversary Dinner',
      eventDate: new Date('2026-10-01'),
      venue: 'Private Penthouse Indiranagar',
      city: 'Bengaluru, Karnataka',
      budget: 30000.00,
      status: 'IN_PROGRESS',
    },
  });

  const disputeJob = await prisma.jobPosting.create({
    data: {
      eventId: disputeEvent.id,
      categoryId: catCleaning.id,
      description: 'Post-dinner venue clearing service.',
      budget: 8500.00,
      deadline: new Date('2026-10-01'),
      status: 'FILLED',
    },
  });

  const disputeProposal = await prisma.proposal.create({
    data: {
      jobId: disputeJob.id,
      freelancerId: soloCleanerUser.freelancerProfile!.id,
      bidAmount: 8500.00,
      message: 'Will handle the complete post-dinner cleaning.',
      status: 'ACCEPTED',
    },
  });

  const disputeBooking = await prisma.booking.create({
    data: {
      proposalId: disputeProposal.id,
      eventId: disputeEvent.id,
      freelancerId: soloCleanerUser.freelancerProfile!.id,
      clientId: clientUser2.clientProfile!.id,
      totalAmount: 8500.00,
      status: 'CONFIRMED',
      payments: {
        create: {
          amount: 2550.00,
          paymentType: 'DEPOSIT',
          paymentMethod: 'Card (RuPay)',
          paymentStatus: 'COMPLETED',
          transactionId: 'PAY_INR_RUPAY_2550',
        },
      },
    },
  });

  // File sample dispute
  await prisma.dispute.create({
    data: {
      bookingId: disputeBooking.id,
      raisedById: clientUser2.id,
      reason: 'The cleaner was 2 hours delayed and did not complete the kitchen clearing before leaving. Requesting a partial refund of the advance deposit.',
      status: 'OPEN',
    },
  });

  console.log('Seeding successfully completed with Indian Rupee data and Admin records!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
