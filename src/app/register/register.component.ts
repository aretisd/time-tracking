import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatabaseService } from '../database.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  regisForm = this.fb.group({
    uid: ['', Validators.required],
    tagid: ['', Validators.required],
});
compFromSQL: any = [];

  maps: Observable<any[]>;

  constructor(private fb: FormBuilder, private db: AngularFireDatabase, private databaseService: DatabaseService) {}

  ngOnInit() {
    this.databaseService.getCompDetail().subscribe(action => {
      this.compFromSQL = action;
      console.log(this.compFromSQL.recordset[0]);
    });
  }

  onSubmit() {
    console.log(this.regisForm.value);
    const map = this.db.list('/map');
    map.set(this.regisForm.value.tagid,
      {
        uid: this.regisForm.value.uid,
      });
    for (let j = 0; j <= this.compFromSQL.recordset.length; j++) {
      if (this.compFromSQL.recordset[j].RCode === this.regisForm.value.uid) {
        console.log('Correct USER ID');
        const nameSur = this.compFromSQL.recordset[j].Prefix + ' '
        + this.compFromSQL.recordset[j].Name + ' ' + this.compFromSQL.recordset[j].SurName;
        let gen = '';
        if (this.compFromSQL.recordset[j].Gender === 'M') {
          gen = 'ชาย';
        } else {
          gen = 'หญิง';
        }
        let groupComp = '';
        if (this.compFromSQL.recordset[j].Gender === 'M' && this.compFromSQL.recordset[j].Age <= 11) {
          groupComp = 'm1';
        } else if (this.compFromSQL.recordset[j].Gender === 'M' && this.compFromSQL.recordset[j].Age > 11) {
          groupComp = 'm2';
        } else if (this.compFromSQL.recordset[j].Gender === 'F' && this.compFromSQL.recordset[j].Age <= 11) {
          groupComp = 'f1';
        } else if (this.compFromSQL.recordset[j].Gender === 'F' && this.compFromSQL.recordset[j].Age > 11) {
          groupComp = 'f2';
        }
        this.db.list('comp').update(this.regisForm.value.uid, {
          start: 0,
          end: 0,
          finish: 0,
          name: nameSur,
          age: this.compFromSQL.recordset[j].Age,
          gender: gen,
          group: groupComp
        });
        window.location.reload();
      } else {
        console.log('USER ID NOT FOUND!');
      }
    }
  }

}
