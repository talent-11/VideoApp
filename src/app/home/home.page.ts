import { Component, ViewChild, ElementRef } from '@angular/core';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';

const RECORD_TIME = 3;

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
    private file: File
  ) {}

  onClickCapture() {
    // this.replyURL = 'assets/videos/1.mov'
    // let video = this.myVideo.nativeElement;
    // video.src = 'assets/videos/1.mov';
    // video.play();

    let options: CaptureVideoOptions = { limit: 1, duration: RECORD_TIME }
    this.mediaCapture.captureVideo(options)
      .then(
        (data: MediaFile[]) => {
          console.log("zzz captured", JSON.stringify(data));
          let capturedFile = data[0];
          // this.replyURL = capturedFile['localURL'];
          let fileName = capturedFile.name;
          let dir = capturedFile['localURL'].split('/');
          dir.pop();
          let fromDirectory = dir.join('/');      
          var toDirectory = this.file.dataDirectory;
          this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
            console.log("zzz file copy result", JSON.stringify(res))
            // this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
            const path = this.file.dataDirectory + fileName;
            this.file.checkFile(this.file.dataDirectory , fileName).then(r => {
              console.log("zzz check file", JSON.stringify(r))
              console.log("zzz path", path);
              const url = path.replace(/^file:\/\//, '');
              this.replyURL = path;
              let video = this.myVideo.nativeElement;
              video.src = path;
              video.play();
              console.log("zzz url", url);
            });
          },err => {
            console.log('err: ', err);
          });
        },
        (err: CaptureError) => console.error(err)
      );
    }
}
