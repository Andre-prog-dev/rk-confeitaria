import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFooter,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonFooter,
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonLabel,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class CarrinhoPage implements OnInit {
  carrinho: any[] = [];
  total: number = 0;
  formaPagamento: string = 'pix';
  rotaAtiva: string = '';

  mostrarResumo: boolean = false;
  numeroPedido: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.rotaAtiva = event.url;
      }
    });
  }

  ngOnInit() {
    this.carregarCarrinho();
  }

  carregarCarrinho() {
    this.carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrinho.reduce((acc, item) => acc + item.preco, 0);
  }

  removerItem(index: number) {
    this.carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
    this.calcularTotal();
  }

  navegar(rota: string) {
    this.router.navigate([rota]);
  }

  async finalizarCompra() {
    if (this.carrinho.length === 0) {
      const toast = await this.toastController.create({
        message: 'Seu carrinho está vazio!',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      toast.present();
      return;
    }

    this.numeroPedido = 'RK' + Math.floor(Math.random() * 90000 + 10000);
this.mostrarResumo = true;

// 🎊 Cria confetes animados
for (let i = 0; i < 15; i++) {
  const confetti = document.createElement('div');
  confetti.classList.add('confetti');
  document.body.appendChild(confetti);

  // Remove após animação
  setTimeout(() => confetti.remove(), 3000);
}


    localStorage.removeItem('carrinho');
    this.carrinho = [];
    this.total = 0;
  }

  voltarMenu() {
    this.mostrarResumo = false;
    this.router.navigate(['/menu']);
  }
}
