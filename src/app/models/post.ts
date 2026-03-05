export interface Category {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  category: Category; //objet complet 
}