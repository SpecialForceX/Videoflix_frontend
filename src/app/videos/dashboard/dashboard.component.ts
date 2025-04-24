import { Component, OnInit, AfterViewChecked, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { VideoService } from '../video.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import videojs from 'video.js';
import 'videojs-http-source-selector';
import 'videojs-contrib-quality-levels';
import { RouterModule } from '@angular/router';



declare module 'video.js' {
  interface QualityLevel {
    id?: string;
    label?: string;
    width?: number;
    height?: number;
    bitrate?: number;
    enabled: boolean;
  }

  interface QualityLevelsList extends Array<QualityLevel> {
    on: (event: string, callback: () => void) => void;
  }

  interface VideoJsPlayer {
    qualityLevels?: () => QualityLevelsList;
    httpSourceSelector(options?: { default?: string }): void;
  }
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DashboardComponent implements OnInit, AfterViewChecked {
  videos: any[] = [];
  newestVideos: any[] = [];
  groupedVideos: { [genre: string]: any[] } = {};
  heroVideo: any = null;

  optimizationMessageVisible: boolean = true;

  apiUrl = environment.apiUrl;
  mediaUrl = environment.mediaUrl;

  @ViewChild('sliderRef') sliderRef!: ElementRef;
  @ViewChildren('genreSlider') genreSliders!: QueryList<ElementRef>;

  private slidersInitialized = false;

  constructor(private videoService: VideoService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.videoService.getAllVideos().subscribe((data) => {
      this.videos = data;
      this.groupVideosByGenre();
      this.newestVideos = [...this.videos]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);
    });
  }

  groupVideosByGenre() {
    this.groupedVideos = {};
    this.videos.forEach((video, index) => {
      if (index === 0) this.heroVideo = video;
      const genre = video.genre.name || 'Uncategorized';
      if (!this.groupedVideos[genre]) this.groupedVideos[genre] = [];
      this.groupedVideos[genre].push(video);
    });
  }

  ngAfterViewChecked(): void {
    if (!this.slidersInitialized && this.sliderRef && this.genreSliders?.length > 0) {
      this.slidersInitialized = true;
      this.initDragScroll(this.sliderRef.nativeElement);
      this.genreSliders.forEach((sliderEl) => this.initDragScroll(sliderEl.nativeElement));
    }
  }

  private initDragScroll(slider: HTMLElement): void {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  setHeroVideo(video: any): void {
    this.heroVideo = video;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectedVideo: any = null;
  showPlayer: boolean = false;

  openPlayer(): void {

    this.selectedVideo = this.heroVideo;
    this.showPlayer = true;

    this.optimizationMessageVisible = true;
    setTimeout(() => {
      this.optimizationMessageVisible = false;
    }, 4000);

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      const videoElement = document.getElementById('videoplayer') as HTMLVideoElement;

      if (videoElement) {
        const player = videojs(videoElement, {
          controls: true,
          autoplay: true,
          preload: 'auto'
        });

        (window as any).player = player;

        const baseName = this.selectedVideo.video_file.split('/').pop()?.replace('.mp4', '');
        const hlsPath = `${this.mediaUrl}/media/videos/hls/${baseName}/master.m3u8`;

        player.src({
          src: hlsPath,
          type: 'application/x-mpegURL'
        });

        player.ready(() => {
          (player as any).httpSourceSelector({ default: 'auto' });

          const qualityLevels = (player as any).qualityLevels?.();
          if (qualityLevels) {
            let lastHeight = -1;

            setInterval(() => {
              const active = Array.from(qualityLevels as any[]).find((q: any) => q.enabled) as { height?: number };
              if (active?.height && active.height !== lastHeight) {
                lastHeight = active.height;
                this.toastr.info(`Switched to ${active.height}p quality`, 'Video Quality', {
                  timeOut: 3000,
                });
              }
            }, 500);

          }
        });

        const levels = player.qualityLevels?.();

        if (levels) {
          const levelsArray = Array.from(levels);

          const active = levelsArray.find((q) => q.enabled);
          if (active?.height) {
            console.log(`🎥 Aktive Qualität: ${active.height}p`);
          }

          let lastHeight = -1;

          setInterval(() => {
            const current = levelsArray.find((q) => q.enabled);
            if (current?.height && current.height !== lastHeight) {
              lastHeight = current.height;
              this.toastr.info(`Switched to ${current.height}p quality`, 'Video Quality', {
                timeOut: 3000,
              });
            }
          }, 1000);
        }


      }
    }, 0);
  }

  closePlayer(): void {
    this.showPlayer = false;
    document.body.style.overflow = 'auto';
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/videoflix/login';
  }
  
}




