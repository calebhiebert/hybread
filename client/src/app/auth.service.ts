import { Injectable } from '@angular/core';
import { HybreadAPI } from 'src/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token?: string;
  private _api: HybreadAPI;

  constructor() {
    this._api = new HybreadAPI();
  }

  /**
   * Returns a promise that resolves to true if the user is properly authenticated, false otherwise
   */
  public async checkAuth(): Promise<boolean> {
    try {
      const authStatus = await this._api.checkAuthenticationStatus();
      return authStatus.authenticated;
    } catch (err) {
      return false;
    }
  }
}
