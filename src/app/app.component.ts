import { Component, ComponentRef, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { set } from './set.component';

var globalindex: number = 0;
@Component({
  selector: 'indexnum',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<div class="index" id={{index}}>{{index}}</div>`,
  styleUrl: './app.component.css'
})
export class indexnum {
  index: number = globalindex;
  constructor() {
    globalindex++;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgComponentOutlet, indexnum, set],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  looking: string = "";
  lookingset!: set;
  lookingLock: boolean = false;
  refArray: ComponentRef<set>[] = [];
  @ViewChild("viewContainerRef2", { read: ViewContainerRef }) vcr2!: ViewContainerRef;
  @ViewChild("viewContainerRef", { read: ViewContainerRef }) vcr!: ViewContainerRef;
  ref!: ComponentRef<set>;
  addChild() {
    this.ref = this.vcr.createComponent(set);
    this.refArray.push(this.ref);
    this.ref.instance.newLookEvent.subscribe((v: set) => { this.setLooking(v) });
    return this.ref.instance;
  }
  setLooking(set: set) {
    this.looking = set.func;
    this.lookingset = set;
  }
  onKey(event: any) {
    console.log(event.target.value);
    this.lookingset.func = event.target.value;
  }
  Results() {
    this.vcr2.createComponent(indexnum);
    this.refArray.forEach(ref => {
      ref.instance.Result();
    });
  }
}

