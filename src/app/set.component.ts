import { Component, EventEmitter, Injectable, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

var reg = /\s*(?<dice>\d*d\d+)|(?<number>\d+)|(?<operator>\+)/g;
interface token {
  type: "dice" | "name" | "string" | "number" | "operator",
  value: string,
  id: string,
  symbol?: sym
}
class sym {
  lbp: number
  id: string
  first?: () => void
  second?: () => void
  arity?: "name" | "literal" | "operator" | "binary" | "unary"
  constructor(id: string, lbp: number) {
    this.id = id;
    this.lbp = lbp;
  }
  nud(): void {
    return console.error("undefined");
  }
  led(left: () => void): void {
    return console.error("missing op");
  }
}
interface symobj { [key: string]: sym; }
const symbols: symobj = {};

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
    var h = this;
    this.symbol(":");
    this.symbol(";");
    this.symbol(",");
    this.symbol(")");
    this.symbol("]");
    this.symbol("}");
    this.symbol("else");
    this.symbol("(end)");
    this.symbol("(name)");
    this.infix("+", 50);
    this.infix("-", 50);
    this.infix("*", 60);
    this.infix("/", 60);
    this.prefix("(", function () {
      var e = h.expression(0);
      h.advance(")");
      return e;
    })
  }
  @Output() newLookEvent = new EventEmitter<set>();
  setLook() {
    this.newLookEvent.emit(this);
  }
  tokenize() {
    let matches = this.func.matchAll(reg);
    this.tokens = [];
    for (const match of matches!) {
      this.tokens.push({ type: Object.keys(match.groups!).find(key=> match.groups![key] ) as token["type"], value: match[0], id: match[0] });
    }
  }
  result() {
    this.tokenize();
    console.log(this.tokens);
  }
  symbol(id: string, bp: number = 0): sym {
    var s: sym = symbols[id];
    if (s) {
      if (bp >= s.lbp) {
        s.lbp = bp;
      }
    } else symbols[id] = new sym(id, bp);
    return s;
  }
  advance(id?: string): token {
    var t: token;
    if (id && this.token.id != id) console.error(`Expected ${id}`);
    if (this.token_index > this.tokens.length) {
      this.token.symbol = symbols["(end)"];
    }
    t = this.tokens[this.token_index];
    switch (t.type) {
      case "name":
        t.symbol = variables.find(); // could just be o = symbols[value] // varialbes not yet implemented, will include things like n 
        break;
      case "operator":
        t.symbol = symbols[t.type];
        if (!t.symbol) console.error("Unknown operator");
        break;
      case "string":
      case "number":
        t.symbol!.arity = "literal";
        t.symbol = symbols["(literal)"];
        break;
      default:
        console.error("Unexpected token");
        break;
    }
    return t;
  }
  expression(rbp: number): () => void{
    var t: token = this.token;
    var left: () => void;
    this.advance();
    left = t.symbol!.nud;
    while (rbp < this.token.symbol!.lbp) {
      t = this.token;
      this.advance();
      left = () => t.symbol!.led(left);
    }
    return left;
  }
  infix(id: string, bp: number, led? : () => void): sym {
    var s = this.symbol(id, bp);
    var h = this;
    s.led = led! || function (this: sym, left: () => void) {
      this.first = left;
      this.second = h.expression(bp);
      this.arity = "binary";
      return this;
    };
    return s;
  }
  prefix(id: string, nud: () => void) {
    var s = this.symbol(id);
    var h = this;
    s.nud = nud || function (this: sym) {
      this.first = h.expression(70);
      this.arity = "unary";
      return this;
    };
    return s;
  }
}
