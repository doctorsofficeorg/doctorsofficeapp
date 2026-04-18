import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TeamStore } from '../../../core/stores/team.store';

interface InviteForm {
  phone: string;
  role: string;
  qualification: string;
  registrationNo: string;
  specialization: string;
}

interface EditForm {
  role: string;
  qualification: string;
  specialization: string;
  registrationNo: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TagModule, CardModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  private teamStore = inject(TeamStore);

  members = this.teamStore.members;
  loading = this.teamStore.loading;
  doctorCount = this.teamStore.doctorCount;
  nurseCount = this.teamStore.nurseCount;
  labTechCount = this.teamStore.labTechCount;
  frontDeskCount = this.teamStore.frontDeskCount;

  showInviteDialog = signal(false);
  showEditDialog = signal(false);
  editingMember = signal<any>(null);

  inviteForm: InviteForm = this.getEmptyInviteForm();
  editForm: EditForm = this.getEmptyEditForm();

  roleOptions = [
    { label: 'Doctor', value: 'doctor' },
    { label: 'Nurse', value: 'nurse' },
    { label: 'Lab Technician', value: 'lab_tech' },
    { label: 'Front Desk', value: 'front_desk' },
  ];

  ngOnInit(): void {
    this.teamStore.loadMembers();
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (role) {
      case 'owner': return 'info';
      case 'doctor': return 'success';
      case 'nurse': return 'warn';
      case 'lab_tech': return 'secondary';
      case 'front_desk': return 'contrast';
      default: return 'secondary';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'owner': return 'Owner';
      case 'doctor': return 'Doctor';
      case 'nurse': return 'Nurse';
      case 'lab_tech': return 'Lab Tech';
      case 'front_desk': return 'Front Desk';
      default: return role;
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatPhone(phone: string): string {
    return phone.replace(/^\+91/, '');
  }

  openInviteDialog(): void {
    this.inviteForm = this.getEmptyInviteForm();
    this.showInviteDialog.set(true);
  }

  closeInviteDialog(): void {
    this.showInviteDialog.set(false);
  }

  async sendInvite(): Promise<void> {
    const success = await this.teamStore.inviteMember({
      phone: this.inviteForm.phone,
      role: this.inviteForm.role,
      qualification: this.inviteForm.qualification || undefined,
      specialization: this.inviteForm.specialization || undefined,
      registrationNumber: this.inviteForm.registrationNo || undefined,
    });
    if (success) {
      this.closeInviteDialog();
    }
  }

  openEditDialog(member: any): void {
    this.editingMember.set(member);
    this.editForm = {
      role: member.role,
      qualification: member.qualification ?? '',
      specialization: member.specialization ?? '',
      registrationNo: member.registrationNumber ?? '',
    };
    this.showEditDialog.set(true);
  }

  closeEditDialog(): void {
    this.showEditDialog.set(false);
    this.editingMember.set(null);
  }

  async saveEdit(): Promise<void> {
    const editing = this.editingMember();
    if (!editing) return;

    const success = await this.teamStore.updateMember(editing.id, {
      role: this.editForm.role,
      qualification: this.editForm.qualification || undefined,
      specialization: this.editForm.specialization || undefined,
      registrationNumber: this.editForm.registrationNo || undefined,
    });
    if (success) {
      this.closeEditDialog();
    }
  }

  async removeMember(member: any): Promise<void> {
    await this.teamStore.removeMember(member.id);
  }

  private getEmptyInviteForm(): InviteForm {
    return { phone: '', role: '', qualification: '', registrationNo: '', specialization: '' };
  }

  private getEmptyEditForm(): EditForm {
    return { role: '', qualification: '', specialization: '', registrationNo: '' };
  }
}
