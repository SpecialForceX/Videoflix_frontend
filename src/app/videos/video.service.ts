import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private baseUrl = 'http://localhost:8000/api/videos/';

  constructor(private http: HttpClient) {}

  getAllVideos(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}

