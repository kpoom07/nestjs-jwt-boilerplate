import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';

@Controller({
  path: '/',
})
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @Get('health')
  @HealthCheck()
  getHealth() {
    return this.health.check([]);
  }

  @Get('live')
  @HealthCheck()
  getLive() {
    return this.health.check([]);
  }

  @Get('ready')
  @HealthCheck()
  getReady() {
    return this.health.check([]);
  }
}
