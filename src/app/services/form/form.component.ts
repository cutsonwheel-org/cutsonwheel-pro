import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, LoadingController } from '@ionic/angular';
import { Services } from '../services';
import { ServicesService } from '../services.service';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryComponent } from './category/category.component';
import { ImageService } from 'src/app/shared/services/image.service';
import { switchMap } from 'rxjs/operators';
import { Image } from 'src/app/shared/classes/image';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() id: string;
  data: Services;

  form: FormGroup;
  user: firebase.User;
  image: Image;
  duration: string;

  objects: any[];

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private servicesService: ServicesService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.authService.getUserState().subscribe((user) => {
      this.user = user;
    });

    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(250)]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(1000)]
      }),
      availability: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      category: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      duration: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      charges: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(2), Validators.maxLength(6)]
      }),
      image: new FormControl(null)
    });

    this.servicesService.getOne(this.navParams.get('id')).subscribe((res) => {
      this.data = res;
    });
  }

  onPickedCategory() {
    this.modalCtrl.create({
        component: CategoryComponent
      }).then(modalEl => {
        modalEl.onDidDismiss().then(modalData => {
          if (!modalData.data) {
            return;
          }
          this.form.patchValue({ category: modalData.data.selectedCategory });
        });
        modalEl.present();
      });
  }

  onDurationSelected(ev) {
    const selectedDuration = (ev.detail.value !== 60) ? ev.detail.value + ' min' : '1 hour';
    this.duration = selectedDuration;
    this.form.patchValue({ duration: selectedDuration });
  }

  onAvailabilitySelected(ev) {
    this.form.patchValue({ availability: ev.detail.value });
  }

  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating offer...'
      })
      .then(loadingEl => {
        loadingEl.present();

        this.imageService
          .upload(this.form.get('image').value)
          .pipe(
            switchMap(uploadRes => {
              const service  = {
                title: this.form.value.title,
                description: this.form.value.description,
                imageUrl: uploadRes.imageUrl,
                availability: this.form.value.availability,
                category: this.form.value.category,
                duration: this.form.value.duration,
                charges: +this.form.value.charges,
                userId: this.user.uid
              };
              return this.servicesService.insert(service);
            })
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.dismiss();
          });
      });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = this.image.base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
