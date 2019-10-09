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
  @ViewChild('myvideo', { read: ElementRef, static: false }) myVideo: ElementRef;
  @ViewChild('myinput', { read: ElementRef, static: false }) myInput: ElementRef;
  captured = null;
  isApp;

  constructor(
    private mediaCapture: MediaCapture,
    private file: File,
  ) {
    this.isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'))
  }

  ionViewWillEnter() {
    let input: any = document.querySelector('input[type=file]');
    let _this = this;
    input.onchange = function () {
      if (input.files && input.files.length > 0) {
        let file = input.files[0];
        _this.replayVideo(file);
      }
    };
  }

  replayVideo(file) {
    this.captured = "yes";
    let video = this.myVideo.nativeElement;
    video.src = URL.createObjectURL(file);
    video.play();
  }

  onClickCapture() {
    this.isApp ? this.captureOnMobile() : this.captureOnBrowser()
  }

  captureOnMobile() {
    let options: CaptureVideoOptions = { limit: 1, duration: RECORD_TIME }
    this.mediaCapture.captureVideo(options).then(
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
            this.captured = "yes";
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

  captureOnBrowser() {
    this.myInput.nativeElement.click();
  }
}
