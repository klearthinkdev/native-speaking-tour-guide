import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MessageDisplay } from '../../enums/message-display.enum';
import { MessageOrder } from '../../enums/message-order.enum';
import { RLang } from '../../enums/r-lang.enum';
import { ColorPairFCs } from '../color-pair.component/color-pair.models';

type UserInfo = {
  code: string;
  nickname: string;
  rlangs: Array<RLang>;
};

export type ChatSettings = {
  autoScroll: boolean;
  display: MessageDisplay;
  fontSize: number;
  order: MessageOrder;
  timestamp: boolean;
  tranHexColors: Array<[string, string]>;
  trxnHexColors: [string, string];
} & UserInfo;

export type ChatSettingsFCs = {
  display: FormControl<MessageDisplay>;
  order: FormControl<MessageOrder>;
  fontSize: FormControl<number>;
  trxnHexColorPair: FormGroup<ColorPairFCs>;
  tranHexColorPairs: FormArray<FormGroup<ColorPairFCs>>;
  timestamp: FormControl<boolean>;
  autoScroll: FormControl<boolean>;
};
