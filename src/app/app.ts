import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from './services/post';
import { Post } from './models/post';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAll().subscribe({
      next: (data) => {
        this.posts = data;
        console.log('Articles chargés :', this.posts);
      },
      error: (err) => console.error('Erreur lors du chargement', err)
    });
  }
}