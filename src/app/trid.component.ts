import { CommonModule } from '@angular/common';
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
    contructor(res: number) {
        this.content = res.toString();
    }
}