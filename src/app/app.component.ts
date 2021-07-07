import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'photos-app';

  public trigger: Subject<void> = new Subject<void>();

  public images: WebcamImage[] = [];
  public loading = false;
  public result: any = null;
  public showOverlay = false;
  public match = false;

  constructor(private http: HttpClient) {
  }

  onFileChange(event: WebcamImage) {
    if (this.images.length == 2) return;
    console.log(event);
    this.images.push(event);
  }

  public get triggerObservable() {
    return this.trigger.asObservable();
  }

  capture() {
    this.trigger.next();
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

  async compareFaces() {
    const params = [
      new Blob([this.getBinary(this.images[0].imageAsBase64)], {
        type: 'image/png',
      }),
      new Blob([this.getBinary(this.images[1].imageAsBase64)], {
        type: 'image/png',
      }),
    ];

    const formData = new FormData();
    formData.append('images[]', params[0]);
    formData.append('images[]', params[1]);

    console.log(params);

    this.loading = true;
    this.http.post('/compare', formData).subscribe(
      (response: any) => {
        this.showOverlay = true;

        console.log(response);
        this.result = response;
        if (response.FaceMatches[0].Similarity > 70) {
          this.match = true;
        } else {
          this.match = false;
        }
        this.loading = false;
      },
      (err) => {
        console.log(err);
        this.showOverlay = true
        this.loading = false;
        this.match = false;
        return;
      },
    );
  }
}
