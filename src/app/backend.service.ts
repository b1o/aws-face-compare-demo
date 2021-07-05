import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RegisterDTO {
  username: string;
  email: string;
  image: any;
  password: string;
}

export interface EmailPasswordDTO {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  public register(data: RegisterDTO) {
    const formData = new FormData();
    formData.append(
      'image',
      new Blob([this.getBinary(data.image.imageAsBase64)], {
        type: 'image/png',
      })
    );
    formData.append('email', data.email);
    formData.append('username', data.username);
    formData.append('password', data.password);
    return this.http.post(`${environment.backend}register`, formData);
  }

  public emailPassword(data: EmailPasswordDTO) {
    return this.http.post(`${environment.backend}login`, data);
  }

  public compare(email: string, image: WebcamImage) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append(
      'image',
      new Blob([this.getBinary(image.imageAsBase64)], { type: 'image/png' })
    );

    return this.http.post(`${environment.backend}face-check`, formData);
  }

  getBinary(base64Image: string) {
    var binaryImg = atob(base64Image);
    var length = binaryImg.length;
    var ab = new ArrayBuffer(length);
    var ua = new Uint8Array(ab);
    for (var i = 0; i < length; i++) {
      ua[i] = binaryImg.charCodeAt(i);
    }

    return ab;
  }
}
