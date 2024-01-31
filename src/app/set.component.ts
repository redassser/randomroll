import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

var reg = /\s*(?<dice>\d*d\d+)|(?<number>\d+)|(?<operator>\+)/g;
interface token {
  type: "dice" | "name" | "string" | "number" | "operator",
  value: string,
  id: string
  lbp: number,
  nud: () => void,
  led: () => void
}
const tokenlbp: { [key: string]: { nud: () => void, led: () => void } } = {
  "+": {

  },
  "-": 10,
  "*": 20,
  "/": 20
}

@Component({
  selector: "set",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './set.component.html',
  styleUrl: './app.component.css'
})
export class set {
  title: string = "new";
  func: string = "1d" + Math.floor(Math.random() * 6 + 1); // might change to another struct later
  tokens: token[] = [];
  token!: token;
  token_index: number = 0;
  constructor() {

  }
  @Output() newLookEvent = new EventEmitter<set>();
  setLook() {
    this.newLookEvent.emit(this);
  }
  tokenize() {
    let matches = this.func.matchAll(reg);
    this.tokens = [];
    for (const match of matches!) {
      this.tokens.push({ 
        type: Object.keys(match.groups!).find(key=> match.groups![key] ) as token["type"],
        value: match[0], id: match[0], 
        lbp: tokenlbp[match[0]] 
      });
    }
  }
  result() {
    this.tokenize();
    console.log(this.tokens);
  }
}