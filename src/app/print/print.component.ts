import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseService } from '../database.service';
import { map } from 'rxjs/operators';
import { Tag } from '../start/tag';
import { Comp } from '../result/comp';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  printForm = this.fb.group({
    tagid: ['', Validators.required]
  });
  startTime: any;
  endTime: any;
  printIsTrue: boolean;
  comp: any;
  groupFin: any;

  constructor(private fb: FormBuilder, private db: AngularFireDatabase, private databaseService: DatabaseService) { }

  ngOnInit() {
    this.printIsTrue = false;
  }


  onSubmit() {
    // console.log(this.printForm.value.tagid);
    this.db.object<Tag>('map/' + this.printForm.value.tagid).snapshotChanges().subscribe(action => {
      const uid = action.payload.val().uid;
      console.log(uid);
      this.databaseService.getFinComp().snapshotChanges().pipe(map(
        changes => changes.map ( c =>
          ({ key: c.payload.key, ...c.payload.val() }))
      )).subscribe(comp => {
        comp.forEach(actions => {
          console.log(actions);
          if (actions.key === uid) {
            this.comp = Array.of(actions);
            this.startTime = actions.start;
            this.endTime = actions.end;
            if (actions.group === 'm1') {
              this.groupFin = 'ชาย 7-11 ปี';
            } else if (actions.group === 'm2') {
              this.groupFin = 'ชาย 12-15 ปี';
            } else if ( actions.group === 'f1') {
              this.groupFin = 'หญิง 7-11 ปี';
            } else if (actions.group === 'f2') {
              this.groupFin = 'หญิง 12-15 ปี';
            }
            console.log(this.comp);
            this.printIsTrue = true;
            // window.print();
          }
        });
        // console.log(comp.keys);
      });
      // console.log(uid);
    });
  }
}
