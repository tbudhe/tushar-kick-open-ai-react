import { Controller, Get, Route, SuccessResponse, Tags } from 'tsoa';
import { HeartbeatResponse, HealthResponse } from '../models';

@Route()
@Tags('Health')
export class HealthContractController extends Controller {
  @Get('health')
  @SuccessResponse('200', 'OK')
  public async getHealth(): Promise<string> {
    return 'OK';
  }

  @Get('heartbeat')
  public async getHeartbeat(): Promise<HeartbeatResponse> {
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }

  @Get('api/health')
  public async getApiHealth(): Promise<HealthResponse> {
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }
}
