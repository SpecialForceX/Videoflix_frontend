import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class VideoService {
  private baseUrl = `${environment.apiUrl}api/videos/`;

  constructor(private http: HttpClient) {}

  getAllVideos(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}

