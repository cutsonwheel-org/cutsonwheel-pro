import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ServicesService } from '../services.service';
import { Services } from '../services';
import { Users } from 'src/app/shared/classes/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @Input() id: string;

  data: Services;
  user: Users;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private servicesService: ServicesService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.servicesService.getOne(this.navParams.get('id')).subscribe((res) => {
      this.data = res;
      // get assistant details
      this.getAssistantRole(res.userId);
    });
  }

  getAssistantRole(userId: string) {
    this.userService.getUser(userId)
      .subscribe((assistant) => {
        this.user = assistant;
      }
    );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
