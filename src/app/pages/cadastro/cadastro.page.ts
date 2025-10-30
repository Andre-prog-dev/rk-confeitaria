import { Component } from '@angular/core';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class CadastroPage {

  nome = '';
  email = '';
  telefone = '';
  senha = '';
  confirmarSenha = '';

  mostrarSenha = false;
  mostrarConfirmar = false;

  carregando = false; // ✅ Para loading no botão

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  formatTelefone(event: any) {
    let valor = event.replace(/[^0-9]/g, '');

    if (valor.length > 11) valor = valor.substring(0, 11);

    if (valor.length > 6) {
      this.telefone = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
      this.telefone = valor.replace(/(\d{2})(\d+)/, '($1) $2');
    } else {
      this.telefone = valor;
    }
  }

  campoValido(campo: string) {
    return campo.trim().length > 0;
  }

  emailValido() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  senhaForte() {
    return this.senha.length >= 6;
  }

  senhasCoincidem() {
    return this.senha === this.confirmarSenha && this.senha !== '';
  }

  async cadastrar() {
    if (!this.campoValido(this.nome) || !this.emailValido() ||
        !this.campoValido(this.telefone) || !this.senhaForte() || !this.senhasCoincidem()) {
      return this.showToast('Preencha todos os campos corretamente!', 'warning');
    }

    this.carregando = true; // ✅ Loading ON

    // ✅ Agora passando nome e telefone corretamente
    const result = await this.authService.cadastro(
      this.email,
      this.senha,
      this.nome,
      this.telefone
    );

    this.carregando = false; // ✅ Loading OFF

    if (result.success) {
      this.showToast('Conta criada com sucesso! 🎉', 'success');
      this.router.navigate(['/menu']);
    } else {
      this.showToast('Erro ao cadastrar: ' + result.message, 'danger');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });
    toast.present();
  }
}
