import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

var reg = /\s*(?<dice>\d*d\d+)|(?<number>\d+)|(?<operator>\+)/g;
interface token {
  type: "dice" | "name" | "string" | "number" | "operator",
  value: string
}
class sym {
  lbp: number;
  id: string
  constructor(id: string, lbp: number) {
    this.id = id;
    this.lbp = lbp;
  }
  nud() {
    console.error("undefined");
  }
  led(left: any) {
    console.error("missing op");
  }
}
interface symobj { [key: string]: sym; }
const symbols: symobj = {};
function symbol(id: string, bp: number = 0): sym {
  var s: sym = symbols[id];
  if (s) {
    if (bp >= s.lbp) {
      s.lbp = bp;
    }
  } else symbols[id] = new sym(id, bp);
  return s;
}
symbol(":");
symbol(";");
symbol(",");
symbol(")");
symbol("]");
symbol("}");
symbol("else");
symbol("(end)");
symbol("(name)");

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
  token: token;
  @Output() newLookEvent = new EventEmitter<set>();
  setLook() {
    this.newLookEvent.emit(this);
  }
  tokenize() {
    let matches = this.func.matchAll(reg);
    this.tokens = [];
    for (const match of matches!) {
      this.tokens.push({ type: Object.keys(match.groups!).find(key=> match.groups![key] ) as token["type"], value: match[0] });
    }
  }
  result() {
    this.tokenize();
    console.log(this.tokens);
  }
}
