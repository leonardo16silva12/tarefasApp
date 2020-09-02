import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf-validator';
import { ComparacaoValidator } from '../validators/comparacao-validator';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public formRegister: FormGroup

  public mensagens_validacao = {
    nome: [
      { tipo: 'required', mensagem: 'O campo Nome é obrigatório' },
      { tipo: 'minlength', mensagem: 'O nome ter pelo menos 3 caracteres'}
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O campo CPF é obrigatório' },
      { tipo: 'minlength', mensagem: 'O CPF deve ter pelo menos 11 caracteres' },
      { tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 caracteres' },
      { tipo: 'invalido' , mensagem: 'CPF inválido' }
    ],
    nascimento: [
      { tipo: 'required', mensagem: 'O campo Data de Nascimento é obrigatório' },
    ],
    genero: [
      { tipo: 'required', mensagem: 'O campo Gênero é obrigatório' },
    ],
    celular: [
      { tipo: 'required', mensagem: 'O campo Celular é obrigatório' },
      { tipo: 'maxlength', mensagem: 'O campo Celular deve ter no máximo 16 caracteres'}
    ],
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório' },
      { tipo: 'email', mensagem: 'E-mail inválido' }
    ],
    senha: [
      { tipo: 'required', mensagem: 'O campo senha é obrigatório'},
      { tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres'}
    ],
    confirmar: [
      { tipo: 'required', mensagem: 'O campo confirmar a senha é obrigatório'},
      { tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres'},
      { tipo: 'comparacao', mensagem: 'As senhas devem ser iguais' }
    ],

  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    public alertController: AlertController,
    ) { 

      this.formRegister = formBuilder.group({

        nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), CpfValidator.cpfValido])],
        nascimento: ['', Validators.compose([Validators.required])],
        genero: ['', Validators.compose([Validators.required])],
        celular: ['', Validators.compose([Validators.required, Validators.maxLength(16)])],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        confirmar: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      }, {
        validator: ComparacaoValidator('senha', 'confirmar')
      });
  }

  async ngOnInit() {
    this.usuariosService.buscarTodos();
    console.log(this.usuariosService.listaUsuarios);
  }

  public async salvarFormulario() {
    if(this.formRegister.valid) {

      let usuario = new Usuario();
      usuario.nome = this.formRegister.value.nome;
      usuario.cpf = this.formRegister.value.cpf;
      usuario.nascimento = new Date(this.formRegister.value.nascimento);
      usuario.genero = this.formRegister.value.genero;
      usuario.celular = this.formRegister.value.celular;
      usuario.email = this.formRegister.value.email;
      usuario.senha = this.formRegister.value.senha;

      if(await this.usuariosService.salvar(usuario)) {
        this.exibirAlerta('Aviso', 'Registro concluído com sucesso!');
        this.router.navigateByUrl('/login')
      } else {
        this.exibirAlerta('Aviso', 'Erro ao processar o registro!');
      }

    } else {
      this.exibirAlerta('Aviso', 'Formulário Inválido <br/>Verifique os campos do seu formulário!');
    }
  }

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

}
