import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentReference
} from '@angular/fire/firestore';

import { News as useClass } from './news';

const collection = 'news';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(
    private angularFirestore: AngularFirestore
  ) {}

  private defaultCollection(): AngularFirestoreCollection<useClass> {
    return this.angularFirestore.collection<useClass>(collection);
  }

  private filterUnread() {
    return this.angularFirestore.collection<useClass>(
      collection,
      ref => ref
      .where('isRead', '==', false)
    );
  }

  private fetchData(col: AngularFirestoreCollection): Observable<any> {
    return col.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getAll(isRead: boolean): Observable<useClass[]> {
    const activeCollection = !isRead ? this.defaultCollection() : this.filterUnread();
    return this.fetchData(activeCollection);
  }

  getOne(id: string): Observable<useClass> {
    return this.defaultCollection().doc<useClass>(id).valueChanges().pipe(
      take(1),
      map(data => {
        data.id = id;
        return data;
      })
    );
  }

  insert(data: any): Promise<DocumentReference> {
    return this.defaultCollection().add(data);
  }

  update(data: any): Promise<void> {
    return this.defaultCollection().doc(data.id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.defaultCollection().doc(id).delete();
  }

}
