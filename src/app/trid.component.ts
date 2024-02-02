import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
    selector: "trid",
    standalone: true,
    imports: [CommonModule, RouterOutlet],
    templateUrl: './trid.component.html',
    styleUrl: './app.component.css'
})
export class trid {
    content: string = ""
}
