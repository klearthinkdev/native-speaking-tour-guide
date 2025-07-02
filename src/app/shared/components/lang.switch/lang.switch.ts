import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Lang, LANG_OPTION_LIST } from '../../enums/lang.enum';

@Component({
  selector: 'app-lang-switch',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, TranslateModule],
  templateUrl: './lang.switch.html',
  styleUrl: './lang.switch.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitch {
  readonly langOptionList = LANG_OPTION_LIST;

  constructor(public tr: TranslateService) {}

  onSelectLang(lang: Lang): void {
    this.tr.use(lang);
  }
}
