import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.interface';
import { UserService } from '../../../core/services/user.service';
import { UpdateUser } from '../../../core/models/update-user.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditUserModalComponent } from '../../../shared/components/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, EditUserModalComponent]
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  searchTerm: string = '';
  showEditModal = false;
  selectedUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers(this.searchTerm).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  onDeleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
        },
        error: (err) => {
          this.error = err.message || 'Failed to delete user';
        }
      });
    }
  }

  onEditUser(user: User): void {
    this.selectedUser = user;
    this.showEditModal = true;
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.loadUsers();
  }

  onSaveEdit(updates: UpdateUser): void {
    if (!this.selectedUser) return;

    this.userService.updateUser(this.selectedUser.id, updates)
      .subscribe({
        next: (updatedUser) => {
          this.users = this.users.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          );
          this.showEditModal = false;
          this.selectedUser = null;
        },
        error: (err) => {
          this.error = err.message || 'Failed to update user';
        }
      });
  }

  onCancelEdit(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }
}