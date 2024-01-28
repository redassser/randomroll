import { Component, ComponentRef, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { set } from './set.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgComponentOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  looking: string = "";
  lookingLock: boolean = false;
  @ViewChild("viewContainerRef", { read: ViewContainerRef }) vcr!: ViewContainerRef;
  ref!: ComponentRef<set>;
  addChild() {
    this.ref = this.vcr.createComponent(set);
    this.ref.instance.newLookEvent.subscribe(v => this.looking = v.func);
  }
  onKey(event: any) {
    console.log(event.target.value);
    this.ref.instance.func = event.target.value;
  }
}

