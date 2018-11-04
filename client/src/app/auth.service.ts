import { Injectable } from '@angular/core';
import { HybreadAPI } from 'src/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token?: string;
  private _api: HybreadAPI;

  constructor() {
    const token = localStorage.getItem('auth-token');

    if (token !== null) {
      this._api = new HybreadAPI(token);
    } else {
      this._api = new HybreadAPI();
    }
  }

  /**
   * Returns a promise that resolves to true if the user is properly authenticated, false otherwise
   */
  public async checkAuth(): Promise<boolean> {
    try {
      const authStatus = await this._api.checkAuthenticationStatus();

      console.log('AUTH CHECK', authStatus);

      return authStatus.authenticated;
    } catch (err) {
      return false;
    }
  }

  /**
   * Saves the token and resets the UI
   * @param token the authentication token
   */
  public saveToken(token: string): void {
    this._token = token;
    this._api = new HybreadAPI(token);
    localStorage.setItem('auth-token', token);
  }

  public getAPI(): HybreadAPI {
    return this._api;
  }
}
