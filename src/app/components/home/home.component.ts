import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { BackendService } from 'src/app/backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user:  any;

  constructor(private backend: BackendService) {
    this.backend.currentUser.subscribe(data => {
      this.user = data;
      console.log(this.user)
    });
  }

  ngOnInit(): void {}
}
