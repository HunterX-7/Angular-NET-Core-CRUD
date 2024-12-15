import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.interface';
import { UpdateUser } from '../../../core/models/update-user.interface';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class EditUserModalComponent {
  @Input() user!: User;
  @Input() isAdmin = false;
  @Output() save = new EventEmitter<UpdateUser>();
  @Output() cancel = new EventEmitter<void>();

  editForm: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['']
    });
  }

  ngOnInit(): void {
    this.editForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      role: this.user.role
    });
    if (!this.isAdmin) {
      this.editForm.get('role')?.disable();
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      const updates: UpdateUser = {};
      if (formValue.firstName !== this.user.firstName) updates.firstName = formValue.firstName;
      if (formValue.lastName !== this.user.lastName) updates.lastName = formValue.lastName;
      if (formValue.email !== this.user.email) updates.email = formValue.email;
      if (formValue.password) updates.password = formValue.password;
      if (this.isAdmin && formValue.role !== this.user.role) updates.role = formValue.role;

      this.save.emit(updates);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}