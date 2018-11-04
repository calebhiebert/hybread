import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HybreadAPI } from 'src/api';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username = new FormControl('', [
    Validators.minLength(3),
    Validators.maxLength(32),
  ]);

  password = new FormControl('');

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  register() {
    this.router.navigate(['register']);
  }

  public async submit() {
    const api = new HybreadAPI();

    if (!this.username.invalid && !this.password.invalid) {
      console.log({
        u: this.username.value,
        p: this.password.value,
      });

      try {
        const loginResult = await api.login({
          username: this.username.value,
          password: this.password.value,
        });

        this.auth.saveToken(loginResult.token);

        this.router.navigate(['game']);
      } catch (err) {
        // Something went wrong with our login
      }
    } else {
      console.warn('Username or password fields are invalid');
    }
  }
}
