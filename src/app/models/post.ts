export interface Category {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  category: Category; // objet compelt 
}

// type de création
export type CategoryCreateInput = Omit<Category, 'id'>;
export type PostCreateInput = { title: string; content: string; categoryId: string; };