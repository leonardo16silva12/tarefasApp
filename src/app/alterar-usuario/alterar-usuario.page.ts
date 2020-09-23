import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../models/Usuario';
import { CpfValidator } from '../validators/cpf-validator';

@Component({
  selector: 'app-alterar-usuario',
  templateUrl: './alterar-usuario.page.html',
  styleUrls: ['./alterar-usuario.page.scss'],
})
export class AlterarUsuarioPage implements OnInit {

  public formAlterar: FormGroup

  public mensagens_validacao = {
    nome: [
      { tipo: 'required', mensagem: 'O campo Nome é obrigatório' },
      { tipo: 'minlength', mensagem: 'O nome ter pelo menos 3 caracteres' }
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O campo CPF é obrigatório' },
      { tipo: 'minlength', mensagem: 'O CPF deve ter pelo menos 11 caracteres' },
      { tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 caracteres' },
      { tipo: 'invalido', mensagem: 'CPF inválido' }
    ],
    nascimento: [
      { tipo: 'required', mensagem: 'O campo Data de Nascimento é obrigatório' },
    ],
    genero: [
      { tipo: 'required', mensagem: 'O campo Gênero é obrigatório' },
    ],
    celular: [
      { tipo: 'required', mensagem: 'O campo Celular é obrigatório' },
      { tipo: 'maxlength', mensagem: 'O campo Celular deve ter no máximo 16 caracteres' }
    ],
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório' },
      { tipo: 'email', mensagem: 'E-mail inválido' },
    ]
  };

  private usuario: Usuario;
  private manterLogadoTemp: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    public alertController: AlertController,
  ) {

    this.formAlterar = formBuilder.group({

      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), CpfValidator.cpfValido])],
      nascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.required, Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });

    this.preencherFormulario();

  }

  ngOnInit() {
  }

  public async preencherFormulario() {
    this.usuario = await this.usuariosService.buscarUsuarioLogado();
    this.manterLogadoTemp = this.usuario.manterLogado;
    delete this.usuario.manterLogado;

    this.formAlterar.setValue(this.usuario);
    this.formAlterar.patchValue({ nascimento: this.usuario.nascimento.toISOString() });
  }

  public async salvar() {
    if (this.formAlterar.valid) {
      this.usuario.nome = this.formAlterar.value.nome;
      this.usuario.nascimento = new Date(this.formAlterar.value.nascimento);
      this.usuario.genero = this.formAlterar.value.genero;
      this.usuario.celular = this.formAlterar.value.celular;
      this.usuario.email = this.formAlterar.value.email;

      if(await this.usuariosService.alterar(this.usuario)) {
        this.usuario.manterLogado = this.manterLogadoTemp;
        this.usuariosService.salvarUsuarioLogado(this.usuario);
        this.exibirAlerta('Aviso', 'Usuário alterado com sucesso!');
        this.router.navigateByUrl('/settings');
      }
    } else {
      this.exibirAlerta('Aviso', 'Formulário Inválido <br/>Verifique os campos!');
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
