import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { NewsService } from '../news.service';
import { News } from '../news';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @Input() id: string;

  data: News;
  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.newsService.getOne(this.navParams.get('id')).subscribe((res) => {
      this.data = res;
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
