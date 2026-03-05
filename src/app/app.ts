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
  
  // Utilisé pour le formulaire d'article (création ou modification)
  currentPost = { title: '', content: '', categoryId: '' };
  editingPostId: string | null = null;

  searchQuery: string = ''; 
  showAdminPanel: boolean = false; 

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

  formatCategory(name: string): string {
    if (!name) return 'Sans catégorie';
    try {
      const parsed = JSON.parse(name);
      return parsed.name || name;
    } catch {
      return name;
    }
  }

  get filteredPosts(): Post[] {
    if (!this.searchQuery) return this.posts;
    const search = this.searchQuery.toLowerCase();
    return this.posts.filter(post => 
      post.title.toLowerCase().includes(search) || 
      post.content.toLowerCase().includes(search) ||
      (post.category && this.formatCategory(post.category.name).toLowerCase().includes(search))
    );
  }

  toggleAdminPanel() {
    this.showAdminPanel = !this.showAdminPanel;
    if (!this.showAdminPanel) {
      this.resetForm();
    }
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;
    this.categoryService.create({ name: this.newCategoryName }).subscribe(() => {
      this.newCategoryName = '';
      this.refreshData();
    });
  }

  savePost() {
    if (!this.currentPost.title || !this.currentPost.categoryId) return;

    if (this.editingPostId) {
      this.postService.update(this.editingPostId, this.currentPost).subscribe(() => {
        this.resetForm();
        this.refreshData();
        this.showAdminPanel = false;
      });
    } else {
      this.postService.create(this.currentPost).subscribe(() => {
        this.resetForm();
        this.refreshData();
        this.showAdminPanel = false;
      });
    }
  }

  editPost(post: Post) {
    this.editingPostId = post.id;
    this.currentPost = {
      title: post.title,
      content: post.content,
      categoryId: post.category ? post.category.id : ''
    };
    this.showAdminPanel = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deletePost(id: string) {
    if (confirm("Confirmer la suppression ?")) {
      this.postService.delete(id).subscribe(() => {
        this.refreshData();
      });
    }
  }

  resetForm() {
    this.currentPost = { title: '', content: '', categoryId: '' };
    this.editingPostId = null;
  }
}