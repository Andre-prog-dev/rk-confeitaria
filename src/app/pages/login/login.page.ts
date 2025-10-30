import { Component } from '@angular/core';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule // ✅ Necessário para routerLink funcionar no template
  ],
})
export class LoginPage {

  email: string = '';
  senha: string = '';
  mostrarSenha: boolean = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    const user = this.authService.getUsuarioLogado();
    if (user) {
      this.router.navigate(['/menu']);
    }
  }

  async login() {
    if (!this.email || !this.senha) {
      this.showToast('Preencha e-mail e senha!', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Entrando...',
      spinner: 'crescent'
    });
    await loading.present();

    const result = await this.authService.login(this.email, this.senha);
    await loading.dismiss();

    if (result.success) {
      this.showToast('Login realizado com sucesso!', 'success');
      this.router.navigate(['/menu']);
    } else {
      this.handleFirebaseErrors(result.message);
    }
  }

  handleFirebaseErrors(code: string) {
    let message = 'Erro ao fazer login.';

    switch (code) {
      case 'auth/invalid-login-credentials':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        message = 'E-mail ou senha incorretos!';
        break;
      case 'auth/too-many-requests':
        message = 'Muitas tentativas! Tente novamente mais tarde.';
        break;
      case 'auth/invalid-email':
        message = 'E-mail inválido!';
        break;
    }

    this.showToast(message, 'danger');
  }

  async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
      color
    });
    await toast.present();
  }
}
