import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config } from 'dotenv';
import * as Handlebars from 'handlebars';
import { join } from 'path';

Handlebars.registerHelper(
  'formatDateToDateAndTime',
  function (dateString: string) {
    const options = {
      dateStyle: 'medium',
      timeStyle: 'short',
    } as Intl.DateTimeFormatOptions;
    return new Date(dateString).toLocaleString('en-US', options);
  },
);

Handlebars.registerHelper(
  'eq',
  function (a: string | number, b: string | number) {
    return a === b;
  },
);

Handlebars.registerHelper(
  'googleCalendarDateFormat',
  function (date: string, time: string) {
    if (!date || !time) return '';

    // Convert date string (YYYY-MM-DD) to components
    const dateParts = date.split('-');
    if (dateParts.length !== 3) return '';

    // Convert time string (HH:MM) to components
    const timeParts = time.split(':');
    if (timeParts.length < 2) return '';

    // Format as YYYYMMDDTHHMMSS
    const year = dateParts[0];
    const month = dateParts[1].padStart(2, '0');
    const day = dateParts[2].padStart(2, '0');
    const hours = timeParts[0].padStart(2, '0');
    const minutes = timeParts[1].padStart(2, '0');

    return `${year}${month}${day}T${hours}${minutes}00`;
  },
);

// Helper to format date (longDay manth dayNumber yaerNumber) ex: Monday Apr 21 2025
Handlebars.registerHelper(
  'formatDateLongerDay',
  function (inputDate: string | Date) {
    const date = new Date(inputDate);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    return date.toLocaleDateString('en-US', options).replace(/,/g, '');
  },
);

// Helper to format time without seconds
Handlebars.registerHelper(
  'formatTimeWithoutSeconds',
  function (timeString: string) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  },
);

config();

export const mailerConfig: MailerOptions = {
  transport: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // SMTP username
      pass: process.env.SMTP_PASS, // SMTP password
    },
  },
  defaults: {
    from: process.env.NOREPLY_EMAIL,
  },
  template: {
    dir: join(__dirname, '..', 'common', 'templates'),
    adapter: new HandlebarsAdapter(), // Use Handlebars adapter
    options: {
      strict: true,
    },
  },
};
