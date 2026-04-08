import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

type TeamRole = 'owner' | 'doctor' | 'nurse' | 'lab_tech' | 'front_desk';
type MemberStatus = 'active' | 'invited' | 'inactive';

interface TeamMember {
  _id: string;
  name: string;
  phone: string;
  role: TeamRole;
  specialization: string;
  qualification: string;
  registrationNo: string;
  joinedDate: string;
  status: MemberStatus;
  permissions: {
    viewPatients: boolean;
    editPatients: boolean;
    viewBilling: boolean;
    editBilling: boolean;
    viewPrescriptions: boolean;
    editPrescriptions: boolean;
    manageTeam: boolean;
  };
}

interface InviteForm {
  phone: string;
  role: string;
  qualification: string;
  registrationNo: string;
  specialization: string;
}

interface EditForm {
  role: string;
  permissions: {
    viewPatients: boolean;
    editPatients: boolean;
    viewBilling: boolean;
    editBilling: boolean;
    viewPrescriptions: boolean;
    editPrescriptions: boolean;
    manageTeam: boolean;
  };
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, SelectModule, TagModule, CardModule],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamComponent {
  members = signal<TeamMember[]>(MOCK_MEMBERS);

  showInviteDialog = signal(false);
  showEditDialog = signal(false);
  editingMember = signal<TeamMember | null>(null);

  inviteForm: InviteForm = this.getEmptyInviteForm();
  editForm: EditForm = this.getEmptyEditForm();

  roleOptions = [
    { label: 'Doctor', value: 'doctor' },
    { label: 'Nurse', value: 'nurse' },
    { label: 'Lab Technician', value: 'lab_tech' },
    { label: 'Front Desk', value: 'front_desk' },
  ];

  doctorCount = computed(() => this.members().filter(m => m.role === 'doctor' || m.role === 'owner').length);
  nurseCount = computed(() => this.members().filter(m => m.role === 'nurse').length);
  labTechCount = computed(() => this.members().filter(m => m.role === 'lab_tech').length);
  frontDeskCount = computed(() => this.members().filter(m => m.role === 'front_desk').length);

  getRoleSeverity(role: TeamRole): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (role) {
      case 'owner': return 'info';
      case 'doctor': return 'success';
      case 'nurse': return 'warn';
      case 'lab_tech': return 'secondary';
      case 'front_desk': return 'contrast';
      default: return 'secondary';
    }
  }

  getRoleLabel(role: TeamRole): string {
    switch (role) {
      case 'owner': return 'Owner';
      case 'doctor': return 'Doctor';
      case 'nurse': return 'Nurse';
      case 'lab_tech': return 'Lab Tech';
      case 'front_desk': return 'Front Desk';
      default: return role;
    }
  }

  getStatusSeverity(status: MemberStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'active': return 'success';
      case 'invited': return 'warn';
      case 'inactive': return 'secondary';
      default: return 'secondary';
    }
  }

  getStatusLabel(status: MemberStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  openInviteDialog(): void {
    this.inviteForm = this.getEmptyInviteForm();
    this.showInviteDialog.set(true);
  }

  closeInviteDialog(): void {
    this.showInviteDialog.set(false);
  }

  sendInvite(): void {
    const newMember: TeamMember = {
      _id: 'mem_' + Date.now(),
      name: 'Invited User',
      phone: this.inviteForm.phone,
      role: this.inviteForm.role as TeamRole,
      specialization: this.inviteForm.specialization,
      qualification: this.inviteForm.qualification,
      registrationNo: this.inviteForm.registrationNo,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'invited',
      permissions: this.getDefaultPermissions(this.inviteForm.role as TeamRole),
    };
    this.members.update(list => [...list, newMember]);
    this.closeInviteDialog();
  }

  openEditDialog(member: TeamMember): void {
    this.editingMember.set(member);
    this.editForm = {
      role: member.role,
      permissions: { ...member.permissions },
    };
    this.showEditDialog.set(true);
  }

  closeEditDialog(): void {
    this.showEditDialog.set(false);
    this.editingMember.set(null);
  }

  saveEdit(): void {
    const editing = this.editingMember();
    if (!editing) return;

    this.members.update(list => list.map(m =>
      m._id === editing._id
        ? { ...m, role: this.editForm.role as TeamRole, permissions: { ...this.editForm.permissions } }
        : m
    ));
    this.closeEditDialog();
  }

  removeMember(member: TeamMember): void {
    this.members.update(list => list.filter(m => m._id !== member._id));
  }

  private getEmptyInviteForm(): InviteForm {
    return { phone: '', role: '', qualification: '', registrationNo: '', specialization: '' };
  }

  private getEmptyEditForm(): EditForm {
    return {
      role: '',
      permissions: {
        viewPatients: true,
        editPatients: false,
        viewBilling: false,
        editBilling: false,
        viewPrescriptions: true,
        editPrescriptions: false,
        manageTeam: false,
      },
    };
  }

  private getDefaultPermissions(role: TeamRole): TeamMember['permissions'] {
    switch (role) {
      case 'doctor':
        return { viewPatients: true, editPatients: true, viewBilling: true, editBilling: true, viewPrescriptions: true, editPrescriptions: true, manageTeam: false };
      case 'nurse':
        return { viewPatients: true, editPatients: true, viewBilling: false, editBilling: false, viewPrescriptions: true, editPrescriptions: false, manageTeam: false };
      case 'lab_tech':
        return { viewPatients: true, editPatients: false, viewBilling: false, editBilling: false, viewPrescriptions: true, editPrescriptions: false, manageTeam: false };
      case 'front_desk':
        return { viewPatients: true, editPatients: true, viewBilling: true, editBilling: false, viewPrescriptions: false, editPrescriptions: false, manageTeam: false };
      default:
        return { viewPatients: true, editPatients: false, viewBilling: false, editBilling: false, viewPrescriptions: false, editPrescriptions: false, manageTeam: false };
    }
  }
}

const MOCK_MEMBERS: TeamMember[] = [
  {
    _id: 'mem_001',
    name: 'Dr. Meera Sharma',
    phone: '9876500001',
    role: 'owner',
    specialization: 'General Physician',
    qualification: 'MBBS, MD (General Medicine)',
    registrationNo: 'KMC-2015-12345',
    joinedDate: '2025-06-01',
    status: 'active',
    permissions: { viewPatients: true, editPatients: true, viewBilling: true, editBilling: true, viewPrescriptions: true, editPrescriptions: true, manageTeam: true },
  },
  {
    _id: 'mem_002',
    name: 'Dr. Arjun Mehta',
    phone: '9876500002',
    role: 'doctor',
    specialization: 'Dermatologist',
    qualification: 'MBBS, MD (Dermatology)',
    registrationNo: 'KMC-2017-54321',
    joinedDate: '2025-09-15',
    status: 'active',
    permissions: { viewPatients: true, editPatients: true, viewBilling: true, editBilling: true, viewPrescriptions: true, editPrescriptions: true, manageTeam: false },
  },
  {
    _id: 'mem_003',
    name: 'Anita Desai',
    phone: '9876500003',
    role: 'nurse',
    specialization: 'General Nursing',
    qualification: 'B.Sc Nursing',
    registrationNo: 'KNC-2019-67890',
    joinedDate: '2025-10-01',
    status: 'active',
    permissions: { viewPatients: true, editPatients: true, viewBilling: false, editBilling: false, viewPrescriptions: true, editPrescriptions: false, manageTeam: false },
  },
  {
    _id: 'mem_004',
    name: 'Rahul Verma',
    phone: '9876500004',
    role: 'lab_tech',
    specialization: 'Clinical Pathology',
    qualification: 'DMLT',
    registrationNo: 'KPLT-2020-11234',
    joinedDate: '2025-11-20',
    status: 'active',
    permissions: { viewPatients: true, editPatients: false, viewBilling: false, editBilling: false, viewPrescriptions: true, editPrescriptions: false, manageTeam: false },
  },
  {
    _id: 'mem_005',
    name: 'Kavitha R.',
    phone: '9876500005',
    role: 'front_desk',
    specialization: '',
    qualification: '',
    registrationNo: '',
    joinedDate: '2025-12-01',
    status: 'active',
    permissions: { viewPatients: true, editPatients: true, viewBilling: true, editBilling: false, viewPrescriptions: false, editPrescriptions: false, manageTeam: false },
  },
  {
    _id: 'mem_006',
    name: 'Suresh B.',
    phone: '9876500006',
    role: 'front_desk',
    specialization: '',
    qualification: '',
    registrationNo: '',
    joinedDate: '2026-01-10',
    status: 'active',
    permissions: { viewPatients: true, editPatients: true, viewBilling: true, editBilling: false, viewPrescriptions: false, editPrescriptions: false, manageTeam: false },
  },
];
