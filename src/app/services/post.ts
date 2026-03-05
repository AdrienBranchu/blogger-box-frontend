import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PostCreateInput } from '../models/post';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  private postsUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  create(post: PostCreateInput): Observable<Post> {
    return this.http.post<Post>(this.postsUrl, post);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.postsUrl}/${id}`);
  }
}