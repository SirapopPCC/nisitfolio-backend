import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgotpassword.service';
import { ForgotPasswordController } from './forgotpassword.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants'
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import EmailService from 'src/email/email.service';
import { join } from 'path';

@Module({
  imports: [
        MailerModule.forRoot({
          // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
          // or
          transport: {
            host: 'smtp.gmail.com',
            secure: false,
            auth: {
              user: 'nisitfoliocorp@gmail.com',
              pass: 'yhd1248ds',
            },
          },
          defaults: {
            from: '"Nisitfolio (No Reply)" <noreply@example.com>',
          },
          template: {
            dir: join("../email", 'templates'),
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        }),
      UsersModule,
      EmailModule,
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '30m' },
      })
    ],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService,EmailService],
  exports: [ForgotPasswordService,EmailService]
})
export class ForgotPasswordModule {}