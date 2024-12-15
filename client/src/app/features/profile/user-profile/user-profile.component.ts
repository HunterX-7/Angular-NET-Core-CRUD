import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.interface';
import { UpdateUser } from '../../../core/models/update-user.interface';
import { CommonModule } from '@angular/common';
import { EditUserModalComponent } from '../../../shared/components/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, EditUserModalComponent]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error: string | null = null;
  showEditModal = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.loading = true;
      this.userService.getUserById(currentUser.id)
        .subscribe({
          next: (user) => {
            this.user = user;
            this.loading = false;
          },
          error: (error) => {
            this.error = error.message || 'Failed to load user profile';
            this.loading = false;
          }
        });
    }
  }

  onEdit(): void {
    this.showEditModal = true;
  }

  onSaveEdit(updates: UpdateUser): void {
    if (!this.user) return;

    this.userService.updateUser(this.user.id, updates)
      .subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.showEditModal = false;
        },
        error: (error) => {
          this.error = error.message || 'Failed to update profile';
        }
      });
  }

  onCancelEdit(): void {
    this.showEditModal = false;
  }
}