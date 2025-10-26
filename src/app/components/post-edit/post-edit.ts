import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-edit.html',
  styleUrl: './post-edit.css'
})
export class PostEditComponent implements OnInit {
  postId: number = 0;
  formData = {
    title: '',
    body: '',
    userId: 1
  };
  loading = true;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost();
  }

  loadPost() {
    // Prima controlla se è un post locale
    const localPosts = JSON.parse(sessionStorage.getItem('localPosts') || '[]');
    const localPost = localPosts.find((p: any) => p.id === this.postId);
    
    if (localPost) {
      this.formData = {
        title: localPost.title,
        body: localPost.body,
        userId: localPost.userId
      };
      this.loading = false;
    } else {
      // Altrimenti carica dall'API
      this.postService.getPosts().subscribe(posts => {
        const post = posts.find(p => p.id === this.postId);
        if (post) {
          // Controlla se ci sono modifiche salvate
          const updatedPosts = JSON.parse(sessionStorage.getItem('updatedPosts') || '{}');
          const updatedData = updatedPosts[this.postId];
          
          this.formData = {
            title: updatedData?.title || post.title,
            body: updatedData?.body || post.body,
            userId: updatedData?.userId || post.userId
          };
        }
        this.loading = false;
      });
    }
  }

  updatePost() {
    if (!this.formData.title || !this.formData.body) {
      alert('Compila tutti i campi');
      return;
    }

    this.postService.updatePost(this.postId, this.formData).subscribe(() => {
      // Controlla se è un post locale
      const localPosts = JSON.parse(sessionStorage.getItem('localPosts') || '[]');
      const localIndex = localPosts.findIndex((p: any) => p.id === this.postId);
      
      if (localIndex !== -1) {
        // Aggiorna il post locale
        localPosts[localIndex] = {
          ...localPosts[localIndex],
          title: this.formData.title,
          body: this.formData.body,
          userId: this.formData.userId
        };
        sessionStorage.setItem('localPosts', JSON.stringify(localPosts));
      } else {
        // Salva le modifiche per i post dall'API
        const updatedPosts = JSON.parse(sessionStorage.getItem('updatedPosts') || '{}');
        updatedPosts[this.postId] = {
          title: this.formData.title,
          body: this.formData.body,
          userId: this.formData.userId
        };
        sessionStorage.setItem('updatedPosts', JSON.stringify(updatedPosts));
      }
      
      alert('Post aggiornato con successo!');
      this.router.navigate(['/posts']);
    });
  }

  cancel() {
    this.router.navigate(['/posts']);
  }
}