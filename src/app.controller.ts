import { Controller, Get, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('greet')
  getGreetings(): string {
    return this.appService.getHello();
  }

  @Get('connectAs/:type')
  connectAs(@Param('type') type: string): Observable<RTCPeerConnection> {
    return this.appService.initiateConnectionAs(type);
  }
}
