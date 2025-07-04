import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '../../../layouts/footer.component/footer.component';

@Component({
  selector: 'app-meeting',
  imports: [FooterComponent],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetingComponent {
  // TODO: get code in route param, then entryChatroom to get chatroom id
  /**
   * TODO
   *
   * 1. 檢核會議室代碼 roomCode 規則 (待確認後端程式)，非法則提示錯誤訊息，並返回首頁
   * 2. 若 localStorage 存在會議代碼，讀取 localStorage 中的對話紀錄
   * 3. 連線成功，加入會議室後，儲存會議代碼於 localStorage
   * 4. 正常結束連線，離開會議室時，清除 localStorage 中的會議代碼和對話紀錄
   */
}
