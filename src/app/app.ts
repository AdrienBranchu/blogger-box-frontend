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

  searchQuery: string = ''; 
  showAdminPanel: boolean = false; 
  
  toastMessage: string | null = null;
  toastType: 'success' | 'danger' = 'success';

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

  // Nettoyeur de texte pour les catégories
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
  }

  showToast(message: string, type: 'success' | 'danger' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = null, 3000);
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;
    this.categoryService.create({ name: this.newCategoryName }).subscribe(() => {
      this.newCategoryName = '';
      this.refreshData();
      this.showToast('Catégorie ajoutée avec succès !', 'success');
    });
  }

  addPost() {
    if (!this.newPost.title || !this.newPost.categoryId) return;
    this.postService.create(this.newPost).subscribe(() => {
      this.newPost = { title: '', content: '', categoryId: '' };
      this.refreshData();
      this.showAdminPanel = false;
      this.showToast('Article publié en ligne ! 🚀', 'success');
    });
  }

  deletePost(id: string) {
    if (confirm("Es-tu sûr de vouloir supprimer cet article pour toujours ? 🗑️")) {
      this.postService.delete(id).subscribe(() => {
        this.refreshData();
        this.showToast('Article supprimé.', 'danger');
      });
    }
  }
}