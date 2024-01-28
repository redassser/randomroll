import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: "set",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './set.component.html',
  styleUrl: './app.component.css'
})
export class set {
  title: string = "new";
  func: string = "1d"+Math.floor(Math.random()*6+1); // might change to another struct later
  @Output() newLookEvent = new EventEmitter<set>();
  setLook() {
    this.newLookEvent.emit(this);
  }
}
