import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css'
})
export class PostDetailComponent implements OnInit {
  postId: number = 0;
  post: any = null;
  comments: any[] = [];
  loading = true;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost();
    this.loadComments();
  }

  loadPost() {
    // Prima controlla se è un post locale
    const localPosts = JSON.parse(sessionStorage.getItem('localPosts') || '[]');
    const localPost = localPosts.find((p: any) => p.id === this.postId);
    
    if (localPost) {
      this.post = localPost;
      this.loading = false;
    } else {
      // Altrimenti carica dall'API
      this.postService.getPosts().subscribe(posts => {
        this.post = posts.find(p => p.id === this.postId);
        
        // Applica eventuali modifiche salvate
        if (this.post) {
          const updatedPosts = JSON.parse(sessionStorage.getItem('updatedPosts') || '{}');
          if (updatedPosts[this.postId]) {
            this.post = { ...this.post, ...updatedPosts[this.postId] };
          }
        }
        
        this.loading = false;
      });
    }
  }

  loadComments() {
    this.postService.getComments(this.postId).subscribe(data => {
      this.comments = data;
    });
  }

  goBack() {
    this.router.navigate(['/posts']);
  }
}