import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  location: string;
  bio: string;
  website: string;
}

interface UserSettings {
  username: string;
  language: string;
  timezone: string;
  profileVisible: boolean;
  showEmail: boolean;
  allowMessages: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeout: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  activeTab: string = 'profile';
  profileForm!: FormGroup;
  saving: boolean = false;
  savingSettings: boolean = false;
  showSuccessToast: boolean = false;
  toastMessage: string = '';
  userAvatar: string | null = null;

  userProfile: UserProfile = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 1 23 45 67 89',
    jobTitle: 'Développeur Senior',
    company: 'Tech Solutions Inc.',
    location: 'Paris, France',
    bio: 'Développeur passionné avec plus de 8 ans d\'expérience en développement full-stack. J\'aime créer des solutions innovantes et encadrer les développeurs juniors.',
    website: 'https://jeandupont.dev'
  };

  settings: UserSettings = {
    username: 'jeandupont2024',
    language: 'fr',
    timezone: 'Europe/Paris',
    profileVisible: true,
    showEmail: false,
    allowMessages: true,
    emailNotifications: true,
    pushNotifications: true
  };

  security: SecuritySettings = {
    twoFactorEnabled: true,
    loginAlerts: true,
    sessionTimeout: '1hour'
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      firstName: [this.userProfile.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.userProfile.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      phone: [this.userProfile.phone],
      jobTitle: [this.userProfile.jobTitle],
      company: [this.userProfile.company],
      location: [this.userProfile.location],
      bio: [this.userProfile.bio, [Validators.maxLength(500)]],
      website: [this.userProfile.website, [Validators.pattern('https?://.+')]]
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onSaveProfile(): void {
    if (this.profileForm.valid) {
      this.saving = true;
      
      // Simulate API call
      setTimeout(() => {
        this.userProfile = { ...this.userProfile, ...this.profileForm.value };
        this.saving = false;
        this.showToast('Profil mis à jour avec succès !');
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.profileForm.reset();
    this.initializeForm();
    this.showToast('Formulaire réinitialisé');
  }

  uploadAvatar(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.userAvatar = e.target.result;
          this.showToast('Photo de profil mise à jour !');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  saveSettings(): void {
    this.savingSettings = true;
    
    // Simulate API call
    setTimeout(() => {
      this.savingSettings = false;
      this.showToast('Paramètres sauvegardés avec succès !');
    }, 1500);
  }

  resetSettings(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      this.settings = {
        username: 'jeandupont2024',
        language: 'fr',
        timezone: 'Europe/Paris',
        profileVisible: true,
        showEmail: false,
        allowMessages: true,
        emailNotifications: true,
        pushNotifications: true
      };
      this.showToast('Paramètres réinitialisés');
    }
  }

  changePassword(): void {
    // This would typically open a modal or navigate to a password change page
    const currentPassword = prompt('Entrez votre mot de passe actuel :');
    if (currentPassword) {
      const newPassword = prompt('Entrez votre nouveau mot de passe :');
      if (newPassword) {
        const confirmPassword = prompt('Confirmez votre nouveau mot de passe :');
        if (newPassword === confirmPassword) {
          this.showToast('Mot de passe modifié avec succès !');
        } else {
          alert('Les mots de passe ne correspondent pas. Veuillez réessayer.');
        }
      }
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    this.showSuccessToast = true;
    setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  hideToast(): void {
    this.showSuccessToast = false;
  }
}