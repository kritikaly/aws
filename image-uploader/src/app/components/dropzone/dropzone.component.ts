import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent implements OnInit {

  uploadResponse = {status: '', message: 0};
  error: string;
  isHovering: boolean;

  constructor(private matDialog: MatDialog) { }

  ngOnInit(): void {}


  handleFileInput(message: any) {
    console.log(message, 'message after dropped off file');
    if (message == "ok") {
      this.matDialog.closeAll();
    } else {
      console.log(message, 'error came through');
    }
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  handleTextInput(text: DataTransferItemList) {
    console.log(text);
  }

}
