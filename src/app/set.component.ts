import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Expression } from '@angular/compiler';

var reg = /\s*(?<dice>\d*d\d+)|(?<number>\d+)|(?<operator>\+|\-|\*|\/\/|\/|\(|\))/g;
interface token {
  type: "dice" | "name" | "string" | "number" | "operator" | "end",
  value: string | number,
  id: string
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
  tokens: token[] = [];
  token!: token;
  token_index: number = 0;
  tokenlbp: { [key: string]: { lbp: number, nud?: () => number, led?: (left: number) => number } } = {
    "+": {
      lbp: 10,
      nud: () => this.expression(100),
      led: (left) => left + this.expression(10)
    },
    "-": {
      lbp: 10,
      nud: () => -this.expression(100),
      led: (left) => left - this.expression(10)
    },
    "*": {
      lbp: 20,
      led: (left) => left * this.expression(20)
    },
    "/": {
      lbp: 20,
      led: (left) => Math.floor(left / this.expression(10))
    },
    "//": {
      lbp: 20,
      led: (left) => left / this.expression(10)
    },
    "^": {
      lbp: 30,
      led: (left) => left ** this.expression(29)
    },
    "(": {
      lbp: 0,
      nud: () => {
        let expr = this.expression();
        this.match({
          type: "operator",
          value: ")", id: ")",
          lbp: 0
        })
        return expr;
      }
    },
    ")": {
      lbp: 0,
    },
    "end": {
      lbp: 0
    }
  }
  constructor() {

  }
  @Output() newLookEvent = new EventEmitter<set>();
  setLook(): void {
    this.newLookEvent.emit(this);
  }
  tokenize(): void {
    let matches = this.func.matchAll(reg);
    this.tokens = [];
    for (const match of matches!) {
      let type = Object.keys(match.groups!).find(key => match.groups![key]) as token["type"]
      if (type === "number")
        this.tokens.push({
          type: type,
          value: Number(match[0]), id: match[0],
          lbp: 0, nud: () => Number(match[0])
        });
      else if (type === "dice") {
        var rand = function (a: number, b: number, v: number): number {
          v += Math.floor(Math.random() * b + 1);
          return a === 1 ? v : rand(a - 1, b, v);
        }
        console.log(match[0].split('d'))
        let val = rand(Number(match[0].split('d')[0]), Number(match[0].split('d')[1]), 0)
        this.tokens.push({
          type: type,
          value: val, id: match[0],
          lbp: 0, nud: () => val
        });
      } else
        this.tokens.push({
          type: type,
          value: match[0], id: match[0],
          ...this.tokenlbp[match[0]]
        });
    }
    this.tokens.push({
      type: "end",
      value: "end", id: "end",
      ...this.tokenlbp["end"]
    });
  }
  parse(): number {
    this.tokenize();
    this.token_index = 0;
    this.token = this.tokens[this.token_index];
    return this.expression();
  }
  expression(rbp: number = 0): number {
    var t: token = this.token;
    this.token_index++;
    this.token = this.tokens[this.token_index];
    var left = t.nud!();
    while (rbp < this.token.lbp) {
      t = this.token;
      this.token_index++;
      this.token = this.tokens[this.token_index];
      left = t.led!(left!);
    }
    return left;
  }
  match(tok: token) {
    if (tok && !(tok == this.token))
      console.error("Expected " + tok.value);
    this.token_index++;
    this.token = this.tokens[this.token_index];
  }
}
