/**
 * api.ts
 *
 * This file contains all methods required to access the Hybread API
 */

import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { environment } from './environments/environment';

export class HybreadAPI {
  _http: AxiosInstance;

  constructor(token?: string) {
    const axiosConfig: AxiosRequestConfig = {};

    axiosConfig.baseURL = environment.baseURL;

    if (token) {
      axiosConfig.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    this._http = Axios.create(axiosConfig);
  }

  /**
   * Registers a new account with the server
   * @param args an object containing a username and password
   */
  public registerAccount(args: IRegisterAccountArgs): Promise<IUser> {
    return this._http
      .post('/users', args)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  /**
   * Returns an authentication token for a user
   * @param args an object containing a username and password
   */
  public login(args: ILoginArgs): Promise<ILoginResponse> {
    return this._http
      .post('/login', args)
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  /**
   * Checks if a given username is in use or not already
   * @param username string
   */
  public checkUsernameAvailability(
    username: string
  ): Promise<IUsernameAvailability> {
    return this._http
      .get('/username-available', {
        params: {
          username: encodeURIComponent(username),
        },
      })
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  /**
   * Extracts the response data from an axios response
   * @param response axios api response
   */
  private handleSuccess(response: AxiosResponse): any {
    return response.data;
  }

  /**
   * Handles an axios error
   * @param err axios error
   */
  private handleError(err: any) {
    if (err.response) {
      console.error('API ERR', err.response.data);
    }

    return Promise.reject(err);
  }
}

interface IRegisterAccountArgs {
  username: string;
  password: string;
}

interface ILoginArgs {
  username: string;
  password: string;
}

interface ILoginResponse {
  token: string;
}

interface IUser {
  id: number;
  username: string;
}

interface IUsernameAvailability {
  username: string;
  available: boolean;
}
