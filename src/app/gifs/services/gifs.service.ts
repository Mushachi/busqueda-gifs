import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private servicioUrl: string = 'http://api.giphy.com/v1/gifs';
  private apiKey     : string = 'RDsKGaFZSifZRRvC9Ztl73h2Z0lo1SPG';
  private _historial : string[] = [];

  // Resultados tipo Gif
  public resultados: Gif[] = []

  get historial() {
    return [...this._historial];
  }

  constructor ( private http: HttpClient ) {

    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];
    // if( localStorage.getItem('historial') ){
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
    // }

    this.resultados = JSON.parse( localStorage.getItem('imagesUrl')! ) || [];

  }

  buscarGifs ( query: string ) {

    query = query.trim().toLocaleLowerCase();

    // Valida que no se repitan los valores buscados
    if( !this._historial.includes( query )) {
      this._historial.unshift( query ); // Se agrega al areglo
      this._historial = this._historial.splice(0,10); // Limita el arrego a 10 registros

      // LocalStorage
      localStorage.setItem( 'historial', JSON.stringify( this._historial ) );
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query );

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params })
    .subscribe( ( resp ) => {
          // console.log( resp.data)
          this.resultados = resp.data;
          localStorage.setItem( 'imagesUrl', JSON.stringify( this.resultados ) );
    });

    // this.http.get('http://api.giphy.com/v1/gifs/search?api_key=RDsKGaFZSifZRRvC9Ztl73h2Z0lo1SPG&q=dragon ball z&limit=10')
    //   .subscribe( ( resp: any ) => {
    //     console.log( resp.data)
    // });


    // console.log(this._historial);

  }

}
