import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { Comp } from './result/comp';
import { Tag } from './start/tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpResponse, HttpHeaders  } from '@angular/common/http';

const apiUrl = 'http://103.233.194.55:8081/customer/';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  compRef: AngularFireList<Comp> = null;
  // tagRef: AngularFireList<any> = null;
  finCompRef: AngularFireList<Comp>;

  constructor(private db: AngularFireDatabase, private http: HttpClient) { }

  // getTagID(tagid) {
  //   this.tagRef = this.db.object('map/' + tagid).snapshotChanges();
  //   return this.tagRef;
  // }

  getCompDetail() {
    return this.http.get('http://103.233.194.55:8081/customer');
  }

  getFinComp(): AngularFireList<Comp> {
    this.finCompRef = this.db.list('comp/', finish =>
    finish.orderByChild('finish').equalTo(1));
    return this.finCompRef;
  }

  // Query Gender: Male Age: 7-11
  getCompListM1(): AngularFireList<Comp> {
    this.compRef = this.db.list('comp', gender =>
    gender.orderByChild('group').equalTo('m1'));
    return this.compRef;
  }
   // Query Gender: Male Age: 12-15
    getCompListM2(): AngularFireList<Comp> {
      this.compRef = this.db.list('comp', gender =>
      gender.orderByChild('group').equalTo('m2'));
      return this.compRef;
   }

   // Query Gender: Female Age: 7-11
   getCompListF1(): AngularFireList<Comp> {
    this.compRef = this.db.list('comp', gender =>
    gender.orderByChild('group').equalTo('f1'));
    return this.compRef;
    }

    // Query Gender: Female Age: 12-15
   getCompListF2(): AngularFireList<Comp> {
    this.compRef = this.db.list('comp', gender =>
    gender.orderByChild('group').equalTo('f2'));
    return this.compRef;
 }
  // getFinishComp(): AngularFireList<Comp> {
  //   this.finCompRef = this.db.list('comp', finish =>
  //   finish.orderByChild('finish').startAt(1));
  //   return this.finCompRef;
  // }
}
