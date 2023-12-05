import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(@Req() req: Request, @Res() res: Response) {
    return res.status(200).send({
      status: 'OK',
      queries: req.query,
    });
  }
}
