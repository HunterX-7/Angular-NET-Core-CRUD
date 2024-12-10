import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit(): void {
    // user loading logic
    this.loadUsers();
  }

  loadUsers(): void {
    // user loading logic
    this.isLoading = true;
    // user service and load users
    this.isLoading = false;
  }

  onDeleteUser(userId: number): void {
    // delete functionality
  }

  onEditUser(userId: number): void {
    // edit functionality
  }
}