import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';
import { Theme } from './shared/enums/theme.enum';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'native-speaking-tour-guide';

  constructor(public th: ThemeService) {
    this.th.init();
  }

  useNextTheme(): void {
    const all = [Theme.Light, Theme.Dark, Theme.System];
    const currentIndex = all.indexOf(this.th.currentTheme);
    const next = all[(currentIndex + 1) % all.length];

    console.log(currentIndex, next);

    this.th.use(next);
  }
}
