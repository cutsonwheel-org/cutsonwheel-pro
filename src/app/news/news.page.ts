import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular';
import { NewsService } from './news.service';
import { DetailComponent } from './detail/detail.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  latestNews = [];
  isLoading: boolean;
  isFiltered: boolean;

  constructor(
    private newsService: NewsService,
    private toastCtrl: ToastController,
    private modalController: ModalController
  ) {
    this.isLoading = true;
    this.isFiltered = false;
  }

  ngOnInit() {
    this.loadNews(this.isFiltered);
  }

  loadNews(isFiltered: boolean, event?) {
    this.newsService.getAll(isFiltered).subscribe((news) => {
      this.isLoading = false;
      // this is an options
      this.latestNews = news;

      if (event) {
        event.target.complete();
      }
    });
  }

  loadMore(event) {
    const length = 0;
    this.loadNews(this.isFiltered, event);
    if (length < this.latestNews.length) {
      this.toastCtrl.create({
        message: 'All news loaded!',
        duration: 2000
      }).then(toast => toast.present());
      event.target.disabled = true;
    }
  }

  onViewDetail(newsId: string) {
    const data = {
      id: newsId,
      isRead: true
    };
    this.newsService.update(data).then((res) => {
      console.log(res);
      this.modalController.create({
        component: DetailComponent,
        componentProps: {
          id: newsId
        }
      }).then((modalEl) => {
        modalEl.present();
      });
    });
  }

  segmentChanged(ev: CustomEvent) {
    this.isFiltered = (ev.detail.value === 'all') ? false : true;
    this.loadNews(this.isFiltered);
  }
}
