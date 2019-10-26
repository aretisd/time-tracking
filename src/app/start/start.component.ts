import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag } from './tag';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { Comp } from '../result/comp';



@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  // startForm = this.fb.group({
  //   tagid: ['', Validators.required]
  // });
  startForm: FormGroup;
  tagid: FormArray;

  now: number;
  tags: Observable<Tag>;
  compFromSQL: any = [];

  constructor(
    private fb: FormBuilder,
    private db: AngularFireDatabase
    ) { }

  ngOnInit() {
    this.startForm = this.fb.group({
      tagid: this.fb.array([this.createTagid()])
    });
    // this.compFromSQL = this.http.get('http://103.233.194.55:8081/customer');
    // console.log(this.compFromSQL);
  }

  createTagid(): FormGroup {
    return this.fb.group({
      tagNum: ['', Validators.required]
    });
  }

  addTag(): void {
    this.tagid = this.startForm.get('tagid') as FormArray;
    this.tagid.push(this.createTagid());
  }

  onSubmit() {

    const count = this.tagid.length;
    for (let i = 0; i <= count; i++) {
      this.db.object<Tag>('map/' + this.tagid.at(i).value.tagNum).snapshotChanges().subscribe(action => {
        const uid = action.payload.val().uid;
        this.now = Date.now();
        this.db.object<Comp>('comp/' + uid).snapshotChanges().subscribe(start => {
          this.db.object('comp/' + uid).update({
            start: this.now
          });
          console.log('Update start time of ' + action.key + ' success');
          // if ( start.payload.val().start === 0) {
          //   this.db.object('comp/' + uid).update({
          //     start: this.now
          //   });
          //   console.log('Update start time of ' + action.key + ' success');
          // } else {
          //   console.log('Update tagID ' + action.key + ' failed');
          // }
        });
      });
    }
    window.location.reload();
  }
}
