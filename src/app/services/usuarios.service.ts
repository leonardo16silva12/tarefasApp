import { Injectable } from '@angular/core';
import { ArmazenamentoService } from './armazenamento.service';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public listaUsuarios = [];

  constructor(
    private armazenamentoService : ArmazenamentoService,
    ) { }

    public async buscarTodos() {
      this.listaUsuarios = await this.armazenamentoService.pegarDados('usuarios');
    
      if(!this.listaUsuarios){
        this.listaUsuarios = [];
      }
    }

    public async salvar(usuario: Usuario) {
      await this.buscarTodos();

      if(!usuario) {
        return false;
      }

      if(!this.listaUsuarios) {
        this.listaUsuarios = [];
      }

      this.listaUsuarios.push(usuario);

      return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios);
    }

    public async login(email: string, senha: string) {
      let usuario: Usuario;

      await this.buscarTodos();

      const listTemp = this.listaUsuarios.filter(usuarioArmazenado => {
        return (usuarioArmazenado.email == email && usuarioArmazenado.senha == senha);
      }); // retorna um array;


      if(listTemp.length > 0) {
        usuario = listTemp.reduce(item => item);
      }

      return usuario;
    }

    public async logout() {
      return await this.armazenamentoService.excluirDados('usuarioLogado');
    }

    public salvarUsuarioLogado(usuario: Usuario) {
      delete usuario.senha;
      this.armazenamentoService.salvarDados('usuarioLogado', usuario);
    }

    public async buscarUsuarioLogado() {
      return await this.armazenamentoService.pegarDados('usuarioLogado');
    }

    public async alterar(usuario: Usuario) {
      if(!usuario){
        return false;
      }

      await this.buscarTodos();

      const index = this.listaUsuarios.findIndex(usuarioArmazenado => {
        return usuarioArmazenado.email == usuario.email;
      });

      const usuarioTemp = this.listaUsuarios[index] as Usuario;

      usuario.senha = usuarioTemp.senha;

      this.listaUsuarios[index] = usuario;

      return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios);
    }


}
