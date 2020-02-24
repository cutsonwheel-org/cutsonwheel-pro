import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  slideOpts: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.slideOpts = {
      initialSlide: 0,
      speed: 400
    };
  }

  onSkip() {
    this.router.navigateByUrl('/auth');
  }
}
