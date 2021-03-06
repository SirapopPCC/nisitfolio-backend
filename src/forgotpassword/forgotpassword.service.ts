import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import EmailService from '../email/email.service';
import { UsersService } from '../users/users.service';
import SendLinkDto from './sendlink.dto';
import { ObjectId } from 'mongodb';
import { MailerService } from '@nestjs-modules/mailer';
 
@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private mailerService: MailerService,
  ) {}
 
  public sendForgotMailLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_FORGOT_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_FORGOT_TOKEN_EXPIRATION_TIME}s` 
    });
 
    const url = `${process.env.Forgot_PASSWORD_URL}/${token}`;
    
    const text = `กรุณาคลิ๊กที่ลิ้งค์ด้านล่างเพื่อ reset password ของคุณ \n ${url}`;
 
    return this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password Link ',
      template: 'src/email/templates/forgot.hbs', 
      context: { 
        url,
      },
      
    })
  }

  public async ResetPassword(email: string,password: string) {
    const user = await this.usersService.getByEmail(email);
    if (user.isEmailConfirmed) {
      return await this.usersService.resetPassword(email,password);
    }
    throw new BadRequestException('Email not confirmed');
  }
 
  public async decodeForgotToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_FORGOT_TOKEN_SECRET,
      });
 
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async resendForgotMailLink(sendlinkdto: SendLinkDto) {
    const user = await this.usersService.getByEmail(sendlinkdto.email);
    if(!user)
      throw new BadRequestException('No User with this Emails');
    else
      await this.sendForgotMailLink(sendlinkdto.email);
  }
}