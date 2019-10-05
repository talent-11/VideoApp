import { Component, ViewChild, ElementRef } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';

const RECORD_TIME = 10;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  replyURL = null;
  @ViewChild('myvideo', { read: ElementRef, static: false }) myVideo: ElementRef;

  constructor(
    private mediaCapture: MediaCapture,
    private file: File,
  ) {}

  onClickCapture() {
    let options: CaptureVideoOptions = { limit: 1, duration: RECORD_TIME }
    this.mediaCapture.captureVideo(options)
      .then(
        (data: MediaFile[]) => {
          console.log("zzz captured", JSON.stringify(data));

          const capturedFile = data[0];
          const fileName = capturedFile.name;
          let dir = capturedFile['localURL'].split('/');
          dir.pop();
          const fromDirectory = dir.join('/');
          const toDirectory = this.file.dataDirectory;
          this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
            console.log("zzz file copy result", JSON.stringify(res))

            this.file.readAsDataURL(this.file.dataDirectory, fileName).then((base64) => {
              console.log(base64)
              this.replyURL = "yes";
              let video = this.myVideo.nativeElement;
              video.src = base64;
              video.play();
            })
          },err => {
            console.log('err: ', err);
          });
        },
        (err: CaptureError) => console.error(err)
      );
    }
}
