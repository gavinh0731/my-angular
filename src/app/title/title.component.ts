import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent implements OnInit {
  constructor() { }

  @Input()
  title?: string;

  @Output() addList = new EventEmitter()

  addBtnFun() {
    // console.log(this.inpValue);
    this.addList.emit('Vue');
  }

  ngOnChanges() {
    console.log(this.title);
    console.log("1. ngOnChanges");
  }
  ngOnInit() {
    console.log("2. ngOnInit");
  }
  ngDoCheck() {
    console.log("3. ngDoCheck");
  }
  ngAfterContentInit() {
    console.log("4. ngAfterContentInit");
  }
  ngAfterContentChecked() {
    console.log("5. ngAfterContentChecked");
  }
  ngAfterViewInit() {
    console.log("6. ngAfterViewInit");
  }
  ngAfterViewChecked() {
    console.log("7. ngAfterViewChecked");
  }
  ngOnDestroy() {
    console.log("8. ngOnDestroy");
  }
}
