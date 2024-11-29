import { InputForm } from '../../interface/input';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Curso } from 'src/app/redux/models/curso.mode';
import { User } from 'src/app/redux/models/usuario.model';
import { ReduxServiceService } from 'src/app/services/reduxService/redux-service.service';
import { Injectable } from '@angular/core'
import * as form from './form/form';

@Component({
  selector: 'app-add-user-page',
  templateUrl: './add-user-page.page.html',
  styleUrls: ['./add-user-page.page.scss'],
})

@Injectable()
export class AddUserPagePage implements OnInit {

  public cursos$: Observable<Curso[]>;
  public total: string = '0';
  public formulario: Array<InputForm>;
  public valoresFormulario: any;
  public idsCursos: number[] = []

  constructor(
    @Inject(Router) private router: Router,  
    private redux: ReduxServiceService, 
    public alertController: AlertController
  ) { 
      this.formulario = form.formulario
  }

  receberValoresDoFormulario(value: any) {
    this.valoresFormulario = value
  }

  ngOnInit() {
    this.cursos$ = this.redux.getCursos();
  }

  async presentAlert(headerAlert: string, subTitulo: string, messageAlert: string) {
    const alert = await this.alertController.create({
      header: headerAlert,
      subHeader: subTitulo,
      message: messageAlert,
      buttons: ['OK']
    });

    await alert.present();
  }

  idIncremental() {

    let id = 0;

    const listaDeUsuarios = this.redux.retornarUsuarioConvertido();

    listaDeUsuarios.map(value => {
      if(id < value.id){
        id = value.id;
      }
    });

    return id += 1;
  }

  adicionarUsuario() {
    if(!this.valoresFormulario){
      this.presentAlert("Atenção","Campos não podem ser nulos!", "aa")
      return;
    }

    let estaVazia: boolean = true;

    for(let title of this.formulario){
      if(!this.valoresFormulario[title.titulo]){
        this.presentAlert("Atenção",`Campo ${title.titulo} não pode ser vazio!`, "")
        estaVazia = false
        break
      }
    }

    if(this.idsCursos.length == 0) {
      this.presentAlert("Atenção", "Você deve selecionar pelo menos um curso!", "")
      return
    }

    if(!estaVazia){
      return
    }

    let img = '';
    this.redux.getImg().subscribe(value => img = value);

    const usuario: User = {
      avatarImg: img,
      dataDeNascimento: this.valoresFormulario['Ano'],
      email: this.valoresFormulario['Email'],
      id: this.idIncremental(),
      name: this.valoresFormulario['Nome'],
      cursos: this.idsCursos
    }

    this.redux.adicionarUsuario(usuario);
    this.redux.adicionarImg('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAADdCAMAAACc/C7aAAAAaVBMVEXDw8MAAADGxsaXl5fJycnMzMxSUlKRkZF1dXV5eXnCwsIFBQWlpaV+fn66urqurq5dXV1sbGxMTEyKiopXV1czMzOcnJwaGhqoqKiEhIQlJSUrKysODg5mZmZHR0ezs7M7OzsVFRU5OTmFwHepAAAC+klEQVR4nO3bi1KjMBSAYXIarIbea2uttVXf/yE36Q0qobrITHP0/2Z2Zt2xDP+GQEDMMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANQ56dCtY+JcZge9zgzsrXvipGc61EtzLO29KbpKLMx9mkPpI83H410XFiblyGFufy7Ph0lHPnSya/aByFuqRv7sSqchUvwV83k4EHFtt6QhcrwOl4GXZdv9VBApq3CdK/w1c9nykNUQ+XK6pG/abin5SFmWy5Z+u6FMP7K6unttt6cKIqflSE4a9tQd/zRtKflI6ZeRw6Y9deFS2ryl5COzUXkzMWoIcZm45bixUkGkfd6PormyyBMZPxkzaVouKIjM7PAwjtPm/XRP4Rse8/hgaoh0djzdbl9XeePJxc7CUBdmHi/REOkPx3Bb2DTlnOwP6L34vNQReZ3szqffRXRa/oJIcetzpJnksS2pj3T5pPrIqmfr6wL9kbZvynWf/8uuPi21Rzrxa4WijCzMW/0j6iKdV/lSZPH5Ges0V3+4flqi+uV77Ql07QmCtkg7GlcumM4uI0/ZC+UjGe67FpVl+qhWGGw/f0pRpIS99aeWjTtV2rdopBleTktNkZkMwvmzMHf20BCaY42FWV3MXFWR2eZY8ezvpY/N8aF8UhuZz84jtV+Iu/d4YfiGu+oHFUX6e43i1LDODs1FfCT9P8+lXN7piZRxNWOS23nTOB7syvsRPZHZ+qKhv2uckMfBLqelmsjLew1/anlpOlbLwT5vSUeks/2rQVG9U5eSyLC0+f+3JE53XToiRT6+OjhjPjRFunz6dVHM9DAtVURG7zW+ZbAfSw2R0mpCHvi1vFMRabctC/1/zdaKisjTTwnaRIYfhCmIdHbQunF/Rl5J8pEizfca37Pxkzr5yNnXHdfNJPGRHNrRvP9D81HqkbnNO5D2W5K//X1XFyK7kuyby3/iHXTp8rcJVmk2/onfCwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALi1f4DsKck70eEzAAAAAElFTkSuQmCC')
    this.presentAlert('Sucesso', 'usuário adicionado', `Usuário ${usuario.name} adicionado com sucesso!`);
    this.valoresFormulario = null
    this.router.navigate(['']);
  }

  totalAPagar(cursosId: number[]) {
    this.idsCursos = cursosId;
    let totalAPagar = 0;

    for(const item of cursosId) {
      const cursos = this.redux.retornarCursoConvertido().find(value => value.id === item);
      if(cursos){
        totalAPagar += cursos.preco;
      }
    }

    this.total = totalAPagar.toFixed(2).replace('.', ',');
  }
}
