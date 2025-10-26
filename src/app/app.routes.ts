import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list';
import { PostCreateComponent } from './components/post-create/post-create';
import { PostEditComponent } from './components/post-edit/post-edit';
import { PostDetailComponent } from './components/post-detail/post-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: 'posts', component: PostListComponent },
  { path: 'create', component: PostCreateComponent },
  { path: 'edit/:id', component: PostEditComponent },
  { path: 'detail/:id', component: PostDetailComponent }
];