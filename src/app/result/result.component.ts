import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../database.service';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Comp } from './comp';
import { AngularFireDatabase, AngularFireList} from '@angular/fire/database';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  now: number;
  comp: any;
  displayedColumns: string[] = ['uid', 'name', 'age', 'gender', 'usedtime'];
  dataSourceM1: MatTableDataSource<Comp>;
  dataSourceM2: MatTableDataSource<Comp>;
  dataSourceF1: MatTableDataSource<Comp>;
  dataSourceF2: MatTableDataSource<Comp>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private databaseService: DatabaseService, private db: AngularFireDatabase) { }

  ngOnInit() {
    this.finishComp();
    this.getCompM1List();
    this.getCompM2List();
    this.getCompF1List();
    this.getCompF2List();
  }

  getCompM1List() {
    this.databaseService.getCompListM1().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(comp => {
      this.comp = comp;
      this.dataSourceM1 = new MatTableDataSource(this.comp);
      this.dataSourceM1.sort = this.sort;
      this.dataSourceM1.paginator = this.paginator;
      // console.log(comp);
    });
  }

  getCompM2List() {
    this.databaseService.getCompListM2().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(comp => {
      this.comp = comp;
      this.dataSourceM2 = new MatTableDataSource(this.comp);
      this.dataSourceM2.sort = this.sort;
      this.dataSourceM2.paginator = this.paginator;
      // console.log(comp);
    });
  }

  getCompF1List() {
    this.databaseService.getCompListF1().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(comp => {
      this.comp = comp;
      this.dataSourceF1 = new MatTableDataSource(this.comp);
      this.dataSourceF1.sort = this.sort;
      this.dataSourceF1.paginator = this.paginator;
      console.log(this.comp);
    });
  }

  getCompF2List() {
    this.databaseService.getCompListF2().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(comp => {
      this.comp = comp;
      this.dataSourceF2 = new MatTableDataSource(this.comp);
      this.dataSourceF2.sort = this.sort;
      this.dataSourceF2.paginator = this.paginator;
      // console.log(comp);
    });
  }

  finishComp() {
    this.db.list<Comp>('comp', finish =>
    finish.orderByChild('finish')).snapshotChanges(['child_changed']).subscribe(actions => {
      actions.forEach(action => {
        if ((action.payload.val().end === 0) && (action.payload.val().finish !== 0) && (action.payload.val().start !== 0)) {
          this.now = Date.now();
          const start = action.payload.val().start;
          let diffMs = (this.now - start); // milliseconds
          const diffDays = Math.floor(diffMs / 1000 / 60 / 60 / 24); // days
          diffMs -= diffDays * 1000 * 60 * 60 * 24;
          const diffHrs = Math.floor(diffMs / 1000 / 60 / 60); // hours
          diffMs -= diffHrs * 1000 * 60 * 60;
          const diffMins = Math.floor(diffMs / 1000 / 60); // minutes
          diffMs -= diffMins * 1000 * 60;
          const dffSec = Math.floor(diffMs / 1000); // seconds
          const used = diffMins + ':'  + dffSec;

          console.log(used);
          // console.log(diffDays + ' days, ' + diffHrs + ' hours, ' + diffMins + ' minutes' + dffSec + ' secs');
          this.db.list('comp').update(action.key,
            {
              end: this.now,
              usedtime: this.now - start
            });
        }
        // console.log(action.key);
        // console.log(action.payload.val().end);
      });
    });
  }

}
