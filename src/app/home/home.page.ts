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

  async ionViewWillEnter(){
    const usuarioLogado = await this.usuarioService.buscarUsuarioLogado();
    if(!usuarioLogado){
      this.router.navigateByUrl('/login');
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


async exibirAlertLogout() {
  const alert = await this.alertController.create({
    cssClass: 'colorAlert',
    header: 'Logout',
    message: 'Tem certeza que deseja sair?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      }, {
        text: 'Ok',
        handler: () => {
          this.usuarioService.logout();
          this.router.navigateByUrl('/login'); 
        }
      }
    ]
  });

  await alert.present();
}

}
