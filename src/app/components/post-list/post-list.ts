import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css'
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  loading = true;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe(data => {
      // Carica post dall'API
      this.posts = data;
      
      // Aggiungi i post locali creati
      const localPosts = JSON.parse(sessionStorage.getItem('localPosts') || '[]');
      this.posts = [...localPosts, ...this.posts];
      
      // Applica le modifiche salvate
      const updatedPosts = JSON.parse(sessionStorage.getItem('updatedPosts') || '{}');
      this.posts = this.posts.map(post => {
        if (updatedPosts[post.id]) {
          return { ...post, ...updatedPosts[post.id] };
        }
        return post;
      });
      
      // Rimuovi post eliminati
      const deletedIds = JSON.parse(sessionStorage.getItem('deletedPosts') || '[]');
      this.posts = this.posts.filter(p => !deletedIds.includes(p.id));
      
      this.loading = false;
    });
  }

  deletePost(id: number) {
    if (confirm('Eliminare questo post?')) {
      this.postService.deletePost(id).subscribe(() => {
        // Salva l'ID in sessionStorage
        const deletedIds = JSON.parse(sessionStorage.getItem('deletedPosts') || '[]');
        deletedIds.push(id);
        sessionStorage.setItem('deletedPosts', JSON.stringify(deletedIds));
        
        // Rimuovi dalla lista locale
        const localPosts = JSON.parse(sessionStorage.getItem('localPosts') || '[]');
        const updatedLocalPosts = localPosts.filter((p: any) => p.id !== id);
        sessionStorage.setItem('localPosts', JSON.stringify(updatedLocalPosts));
        
        // Rimuovi dalla lista visualizzata
        this.posts = this.posts.filter(p => p.id !== id);
        alert('Post eliminato!');
      });
    }
  }
}