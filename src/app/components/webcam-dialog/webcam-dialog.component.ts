import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WebcamComponent, WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-webcam-dialog',
  templateUrl: './webcam-dialog.component.html',
  styleUrls: ['./webcam-dialog.component.scss'],
})
export class WebcamDialogComponent implements OnInit, AfterViewInit {
  public trigger: Subject<void> = new Subject<void>();
  public width = 720;
  public height = 480;

  webcamContainer: null | HTMLElement = null;

  constructor(private dialogRef: MatDialogRef<WebcamDialogComponent>) {}

  ngOnInit(): void {}

  public get triggerObservable() {
    return this.trigger.asObservable();
  }

  ngAfterViewInit() {
    this.webcamContainer = document.getElementById('cameraContainer');
    this.onResize()
  }

  onImage(image: WebcamImage) {
    console.log(image);
    this.dialogRef.close({ image });
  }

  onResize() {
    const box = this.webcamContainer?.getBoundingClientRect() as DOMRect;

    if (this.width <= 720 && this.width > 300) {
      this.width = box.width;
      this.height = box.height;
    }
    console.log(box.width);
  }

  snap() {
    this.trigger.next();
  }
}
