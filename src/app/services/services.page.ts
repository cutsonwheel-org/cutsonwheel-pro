import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { ServicesService } from './services.service';
import { Services } from './services';
import { DetailComponent } from './detail/detail.component';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit, OnDestroy {

  public services$: Observable<Services[]>;
  public isLoading: boolean;

  private authSub: Subscription;

  constructor(
    private servicesService: ServicesService,
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private modalController: ModalController
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.authSub = this.authService.getUserState()
      .subscribe( user => {
        this.services$ = this.servicesService.getByUserId(user.uid);
        if (this.services$) {
          this.isLoading = false;
        }
      }
    );
  }

  onDelete(serviceId: string) {
    this.loadingCtrl
      .create({
        message: 'Deleting...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.servicesService.delete(serviceId).then(() => {
          loadingEl.dismiss();
        });
      });
  }

  onOpenForm(serviceId?: string) {
    this.modalController.create({
      component: FormComponent,
      componentProps: {
        id: serviceId
      }
    }).then((modalEl) => {
      modalEl.present();
    });
  }

  onViewDetail(serviceId: string) {
    this.modalController.create({
      component: DetailComponent,
      componentProps: {
        id: serviceId
      }
    }).then((modalEl) => {
      modalEl.present();
    });
  }

  segmentChanged(ev: CustomEvent) {
    // this.isFiltered = (ev.detail.value === 'all') ? false : true;
    // this.loadNews(this.isFiltered);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
