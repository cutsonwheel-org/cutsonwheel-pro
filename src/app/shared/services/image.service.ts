import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  upload(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authService.getIdToken().pipe(
      switchMap(token => {
        return this.http.post<{imageUrl: string, imagePath: string}>(
          'https://us-central1-cutsonwheel-233209.cloudfunctions.net/storeImage',
          uploadData,
          {
            headers: { Authorization: 'Bearer ' + token }
          }
        );
      })
    );
  }
}
