import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HybreadAPI } from 'src/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username = new FormControl('', [
    Validators.minLength(3),
    Validators.maxLength(32),
  ]);

  password = new FormControl('');

  constructor(private router: Router) {}

  ngOnInit() {}

  public async submit() {
    const api = new HybreadAPI();

    if (!this.username.invalid && !this.password.invalid) {
      try {
        const registerResult = await api.registerAccount({
          username: this.username.value,
          password: this.password.value,
        });

        console.log(registerResult);

        this.router.navigate(['login']);
      } catch (err) {
        // Something went wrong with our registration
      }
    } else {
      console.warn('Username or password fields are invalid');
    }
  }
}
