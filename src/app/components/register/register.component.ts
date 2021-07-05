import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WebcamDialogComponent } from '../webcam-dialog/webcam-dialog.component';
import { take } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BackendService } from 'src/app/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private backend: BackendService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: '',
      email: '',
      image: null,
      password: ''
    });
  }

  ngOnInit(): void {}

  public get image() {
    return this.registerForm.get('image');
  }

  submit() {
    console.log(this.registerForm.value);
    this.backend.register(this.registerForm.value)
      .subscribe(data => {
        console.log(data);
        this.router.navigateByUrl('/login')
      });
  }

  takePhoto() {
    this.dialog
      .open(WebcamDialogComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe((data) => {
        if (data.image) {
          this.registerForm.patchValue({ image: data.image });
        }
      });
  }
}
