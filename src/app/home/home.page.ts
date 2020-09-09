import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../models/Usuario';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private router: Router,
    private usuarioService: UsuariosService,
    private toastController: ToastController,
    private alertController: AlertController,

  ) {}



  async signOut(usuarioLogado: Usuario) {

    const usuario = await this.usuarioService.logout(usuarioLogado);

    if(usuario){
      this.router.navigateByUrl('/login');
      this.presentToast();
    } else{
      return false;
    }

  }

  async presentToast() {
    const toast = await this.toastController.create({
      cssClass: 'colorToast',
      message: 'Logout efetuado com sucesso!',
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      cssClass: 'colorAlert',
      header: titulo,
      message: mensagem,
      buttons: ['OK'],
    });
    await alert.present();
}
}
