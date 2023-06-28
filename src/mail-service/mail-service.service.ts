import { Injectable } from '@nestjs/common';
import * as mailgun from 'mailgun-js';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class MailerService {
  private mailgunClient: mailgun.Mailgun;

  constructor() {
    this.mailgunClient = mailgun({
      apiKey: process.env.MAILKEY,
      domain: process.env.DOMAIN,
    });
  }

  async sendMail(to: string, subject: string, data: object): Promise<any> {
    const template = fs.readFileSync(
      path.join(__dirname, '..', '..', 'mailtemplate/request.hbs'),
      'utf-8',
    );

    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate(data);
    // const html = ejs.render(template, data);

    const mail = {
      from: 'jas@sandboxeca74afc414a418992aee25947606a73.mailgun.org',
      to,
      subject,
      html,
    };
    try {
      await this.mailgunClient.messages().send(mail);
      return data;
    } catch (e) {
      return { message: e.message, statusCode: e.statusCode };
    }
  }
}
