import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-create.html',
  styleUrl: './post-create.css'
})
export class PostCreateComponent {
  formData = {
    title: '',
    body: '',
    userId: 1
  };

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  createPost() {
  if (!this.formData.title || !this.formData.body) {
    alert('Compila tutti i campi');
    return;
  }

  this.postService.createPost(this.formData).subscribe((newPost) => {
    // Salva il nuovo post in sessionStorage
    const posts = JSON.parse(sessionStorage.getItem('localPosts') || '[]');
    
    // Trova l'ID più alto e aggiungi 1
    let maxId = 100; // Parte da 101
    posts.forEach((p: any) => {
      if (p.id > maxId) maxId = p.id;
    });
    
    const localPost = {
      id: maxId + 1, // ID incrementale (101, 102, 103...)
      title: this.formData.title,
      body: this.formData.body,
      userId: this.formData.userId
    };
    posts.unshift(localPost);
    sessionStorage.setItem('localPosts', JSON.stringify(posts));
    
    alert('Post creato con successo!');
    this.router.navigate(['/posts']);
  });
}

  cancel() {
    this.router.navigate(['/posts']);
  }
}