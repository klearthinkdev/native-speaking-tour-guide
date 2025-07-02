import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Theme, THEME_MENU_ITEM_LIST } from '../../enums/theme.enum';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-switch',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, TranslateModule],
  templateUrl: './theme.switch.html',
  styleUrl: './theme.switch.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitch {
  readonly themeMenuItemList = THEME_MENU_ITEM_LIST;

  constructor(public th: ThemeService) {}

  onSelectTheme(theme: Theme): void {
    this.th.use(theme);
  }
}
