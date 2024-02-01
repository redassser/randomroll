import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

var reg = /\s*(?<dice>\d*d\d+)|(?<number>\d+)|(?<operator>\+|\-|\*|\/\/|\/|\(|\))/g;
interface token {
  value: string | number,
  lbp: number,
  nud?: () => number,
  led?: (left: number) => number
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
  private tokens: token[] = [];
  private token!: token;
  token_index: number = 0;
  working_val: number = 0;
  readonly token_list: { [key: string]: token } = {
    "+": {
      value: "+",
      lbp: 10,
      nud: () => this.expression(100),
      led: (left) => left + this.expression(10)
    },
    "-": {
      value: "-",
      lbp: 10,
      nud: () => -this.expression(100),
      led: (left) => left - this.expression(10)
    },
    "*": {
      value: "*",
      lbp: 20,
      led: (left) => left * this.expression(20)
    },
    "/": {
      value: "/",
      lbp: 20,
      led: (left) => Math.floor(left / this.expression(10))
    },
    "//": {
      value: "//",
      lbp: 20,
      led: (left) => left / this.expression(10)
    },
    "^": {
      value: "^",
      lbp: 30,
      led: (left) => left ** this.expression(29)
    },
    "(": {
      value: "(",
      lbp: 0,
      nud: () => {
        let expr = this.expression();
        this.match({
          value: ")",
          lbp: 0
        })
        return expr;
      }
    },
    ")": {
      value: ")",
      lbp: 0,
    },
    "number": {
      value: this.working_val,
      lbp: 0, nud: () => this.working_val
    },
    "end": {
      value: "end",
      lbp: 0
    }
  }
  @Output() newLookEvent = new EventEmitter<set>();
  setLook(): void {
    this.newLookEvent.emit(this);
  }
  parse(): number {
    this.tokenize();
    this.token_index = 0;
    this.token = this.tokens[this.token_index];
    return this.expression();
  }
  private tokenize(): void {
    let matches = this.func.matchAll(reg);
    this.tokens = [];
    for (const match of matches!) {
      let type = Object.keys(match.groups!).find(key => match.groups![key]);
      switch(type) {
        case "number": 
          this.working_val = Number(match[0]);
          this.tokens.push(this.token_list["number"]);
          break;
        case "dice":
          this.working_val = this.rand(Number(match[0].split('d')[0]), Number(match[0].split('d')[1]), 0)
          this.tokens.push(this.token_list["number"]);
          break;
        default:
          this.tokens.push(this.token_list[match[0]]);
          break;
      }
    }
    this.tokens.push(this.token_list["end"]);
  }
  private expression(rbp: number = 0): number {
    var t: token = this.token;
    this.next();
    var left = t.nud!();
    while (rbp < this.token.lbp) {
      t = this.token;
      this.next();
      left = t.led!(left!);
    }
    return left;
  }
  private match(tok: token) {
    if (tok && !(tok == this.token))
      console.error("Expected " + tok.value);
    this.next();
  }
  private next() {
    this.token_index++;
    this.token = this.tokens[this.token_index];
  }
  private rand (a: number, b: number, v: number): number {
    v += Math.floor(Math.random() * b + 1);
    return a === 1 ? v : this.rand(a - 1, b, v);
  }
}
