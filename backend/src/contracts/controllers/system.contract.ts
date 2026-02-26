import { Controller, Get, Route, Tags } from 'tsoa';
import { DbStatusResponse, MenuItem } from '../models';

@Route('api')
@Tags('System')
export class SystemContractController extends Controller {
  @Get('menu')
  public async getMenu(): Promise<MenuItem[]> {
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }

  @Get('db-status')
  public async getDbStatus(): Promise<DbStatusResponse> {
    throw new Error('Contract-only controller. Route handled by Express controllers.');
  }
}
