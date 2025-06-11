// import { NestFactory } from '@nestjs/core';
// import { AppModule } from 'src/app.module';
// import { SocialLinkType } from 'src/businesses/entities/social-link.entity';
// import { Profession, Business } from 'src/businesses/entities/user.entity';

// import { Repository } from 'typeorm';

// async function bootstrap() {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   const userRepo = app.get<Repository<Business>>('UserRepository');

//   // Build a new user
//   const newUser = userRepo.create({
//     email: 'test@example.com',
//     business_name: 'Your Barbershop',
//     password: 'SecurePass!23',
//     profession: Profession.BARBERSHOP,
//     booking_confirmation: {
//       auto_confirmed: true,
//       require_confirmation: false,
//     },
//     business_email: 'test@business-email.com',
//     phone_number: '+1234567890',
//     about: 'I am a barbershop which offers a wide range of services.',
//     social_links: [
//       {
//         type: SocialLinkType.FACEBOOK,
//         link: 'https://www.facebook.com/your-barbershop',
//       },
//       {
//         type: SocialLinkType.X,
//         link: 'https://www.instagram.com/your-barbershop',
//       },
//     ],
//     services: [
//       {
//         name: 'Haircut',
//         description: 'A haircut for men and women',
//         price: 20,
//         photo_url:
//           'https://imgs.search.brave.com/sOPDPAJkjzlMAQbeDeo7-4d8VySFfqi0tOM34Fnh3W8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aXN0b2NrcGhvdG8u/Y29tL3Jlc291cmNl/cy9pbWFnZXMvUGhv/dG9GVExQL05hdHVy/ZUxhbmRzY2FwZXMt/NTE5NzYwOTg0Lmpw/Zw',
//         duration_unit: 'Minutes',
//         duration_value: 30,
//       },
//       {
//         name: 'Beard Trim',
//         description: 'A beard trim for men',
//         price: 15,
//         photo_url:
//           'https://imgs.search.brave.com/sOPDPAJkjzlMAQbeDeo7-4d8VySFfqi0tOM34Fnh3W8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/aXN0b2NrcGhvdG8u/Y29tL3Jlc291cmNl/cy9pbWFnZXMvUGhv/dG9GVExQL05hdHVy/ZUxhbmRzY2FwZXMt/NTE5NzYwOTg0Lmpw/Zw',
//         duration_unit: 'Minutes',
//         duration_value: 30,
//       },
//       {
//         name: 'Shaving',
//         description: 'A shaving for men',
//         price: 10,
//         photo_url: '',
//         duration_unit: 'Hours',
//         duration_value: 2,
//       },
//     ],
//     logo: 'https://imgs.search.brave.com/PjE33tVn9FgNIvLyiXIda3Iuc-QnbB3f_cexAHHWsHU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/YS1kcm9wLW9mLXBp/bmstYW5kLXllbGxv/dy1wYWludC1pbi13/YXRlci5qcGc_d2lk/dGg9MTAwMCZmb3Jt/YXQ9cGpwZyZleGlm/PTAmaXB0Yz0w',
//     terms_and_conditions: 'terms_and_conditions of a barbershop.',
//     locations: [
//       {
//         address: '123 Main St',
//         location_name: 'Main Office',
//         service_availabilities: [],
//       },
//     ],
//   });

//   // Save it to DB
//   await userRepo.save(newUser);

//   await app.close();
// }

// bootstrap();
