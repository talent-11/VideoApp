import { Component } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  replyURL = null;

  constructor(
    private mediaCapture: MediaCapture
  ) {}

  onClickCapture() {
    let options: CaptureVideoOptions = { limit: 1, duration: 10 }
    this.mediaCapture.captureVideo(options)
      .then(
        (data: MediaFile[]) => {
          console.log("zzz", JSON.stringify(data));
          // this.replyURL = data[0].fullPath;
        },
        (err: CaptureError) => console.error(err)
      );
    }
}
