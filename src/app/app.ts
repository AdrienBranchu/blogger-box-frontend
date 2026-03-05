import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from './services/post';
import { CategoryService } from './services/category';
import { Post, Category } from './models/post';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  posts: Post[] = [];
  categories: Category[] = [];

  newCategoryName: string = '';
  newPost = { title: '', content: '', categoryId: '' };

  constructor(
    private postService: PostService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.postService.getAll().subscribe(data => this.posts = data);
    this.categoryService.getAll().subscribe(data => this.categories = data);
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;
    this.categoryService.create({ name: this.newCategoryName }).subscribe(() => {
      this.newCategoryName = '';
      this.refreshData();
    });
  }

  addPost() {
    if (!this.newPost.title || !this.newPost.categoryId) return;
    this.postService.create(this.newPost).subscribe(() => {
      this.newPost = { title: '', content: '', categoryId: '' };
      this.refreshData();
    });
  }

  deletePost(id: string) {
    if (confirm("Es-tu sûr de vouloir supprimer cet article pour toujours ? 🗑️")) {
      this.postService.delete(id).subscribe(() => {
        this.refreshData(); 
      });
    }
  }
}