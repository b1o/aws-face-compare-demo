import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { BackendService } from 'src/app/backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild(MatStepper)
  stepper: MatStepper | null = null;

  public loginForm: FormGroup;
  public loading = false;

  public trigger = new Subject<void>();
  public passwordValidated = false;

  constructor(
    private backend: BackendService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: '',
      password: '',
    });
  }

  ngOnInit(): void {}

  public get triggerObservable() {
    return this.trigger.asObservable();
  }

  faceCheck() {
    this.trigger.next();
  }

  onImage(image: WebcamImage) {
    this.backend
      .compare(this.loginForm.get('email')?.value, image)
      .subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          this.backend.currentUser.next(data.result);
          this.router.navigateByUrl('/');
          this.snackBar.open(
            `Face recognition was successful with confidence of: ${Math.round(data.similarity)}%`,
            'OK'
          );
        } else {
          this.snackBar.open(data.message, 'OK');
          this.router.navigateByUrl('/');
        }
      });
  }

  emailPasswordCheck() {
    this.loading = true;
    // console.log(this.stepper?.next());
    this.backend.emailPassword(this.loginForm.value).subscribe(
      (data) => {
        console.log(data);
        this.passwordValidated = true;
        this.cd.detectChanges();
        this.stepper?.next();
        this.loading = false;
      },
      (err) => (this.loading = false)
    );
  }
}
