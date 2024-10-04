import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentoElectronicoForm } from '../models/forms/invoice-thefactory-form.model';

@Injectable({
  providedIn: 'root'
})
export class TheFactoryService {
  api: string = environment.apiTheFactory;

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  // getToken(): Observable<any> {
  //   // Define el cuerpo de la solicitud
  //   const body = {
  //     usuario: 'seqrhfvjvrhn_tfhka',
  //     clave: ',MkOoSs.VcVk'
  //   };
  
  //   // Verifica si el token está almacenado en el localStorage
  //   const storedUserInfo = localStorage.getItem('userInfo');
  //   let token = storedUserInfo ? JSON.parse(storedUserInfo).token : null;
  
  //   // Configura los encabezados, incluyendo los de CORS y Bearer Token
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': token ? `Bearer ${token}` : '',
  //     // Los encabezados CORS generalmente no se configuran en el cliente
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  //     'Access-Control-Allow-Methods': '*'
  //   });
  
  //   // Realiza la petición POST con el cuerpo y los encabezados
  //   return this.http.post<any>(`${this.api}api/Autenticacion/`, body, { observe: 'response', headers })
  //     .pipe(
  //       tap(response => {
  //         // Guarda el token en el localStorage desde la respuesta
  //         const newToken = response.body && response.body.token ? response.body.token : null;
  //         console.log('Token obtenido:', newToken);
  //         if (newToken) {
  //           const userInfo = { token: `Bearer ${newToken}` };
  //           localStorage.setItem('userInfo', JSON.stringify(userInfo));
  //         }
  //       }),
  //       catchError(error => {
  //         console.error('Error en la autenticación', error); // Manejo de errores
  //         return throwError(() => new Error('Error en la autenticación'));
  //       })
  //     );
  // }
  
  private apiUrl = 'https://demoemision.thefactoryhka.com.ve/api/';

  getToken(): Observable<any> {
    // Intenta obtener el token desde localStorage
    const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
  
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '', // Si hay token, úsalo
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    });
  
    // Comprueba si el token es válido haciendo una solicitud a un recurso protegido
    return this.http.post<any>(`${this.apiUrl}ProtectedResource`, {}, { headers })
      .pipe(
        catchError(error => {
          if (error.status === 401) {
            // Si no está autorizado, intenta obtener un nuevo token
            return this.authenticate().pipe(
              switchMap(newToken => {
                // Almacena el nuevo token
                localStorage.setItem('userInfo', JSON.stringify({ token: newToken }));
                const newHeaders = headers.set('Authorization', `Bearer ${newToken}`);
                // Reintenta la solicitud original con el nuevo token
                return this.http.post<any>(`${this.apiUrl}ProtectedResource`, {}, { headers: newHeaders });
              })
            );
          }
          return throwError(() => new Error('Error fetching protected resource'));
        })
      );
  }
  
  // api2 = environment.apiTheFactory + 'api/Autenticacion/';

  // authenticate(): Observable<string> {
  //   const body = {
  //     usuario: 'seqrhfvjvrhn_tfhka', // Tus credenciales
  //     clave: ',MkOoSs.VcVk'
  //   };

  //   // const headers = new HttpHeaders({
  //   //   'Content-Type': 'application/json'
  //   // });

  //   return this.http.post<any>(`${this.api2}`, body)
  //     .pipe(
  //       map(response => {
  //         return response.token; // Retorna el token de la respuesta
  //       }),
  //       catchError(error => {
  //         console.error('Error authenticating', error);
  //         return throwError(() => new Error('Error authenticating'));
  //       })
  //     );
  // }

  api2 = '/api/Autenticacion/';

authenticate(): Observable<string> {
  const body = {
    usuario: 'seqrhfvjvrhn_tfhka',
    clave: ',MkOoSs.VcVk'
  };

  return this.http.post<any>(`${this.api2}`, body)
    .pipe(
      map(response => {
        localStorage.setItem('tokenTheFactory', response.token);
        return "token: " + response.token; // Retorna el token de la respuesta
      }),
      catchError(error => {
        console.error('Error authenticating', error);
        return throwError(() => new Error('Error authenticating'));
      })
    );
}

updateForm(customer: any, totalBs: number, selectedOption: string, descrip: string): FormGroup<DocumentoElectronicoForm> {
  const formValues = {
    documentoElectronico: {
      encabezado: {
        identificacionDocumento: {
          tipoDocumento: '01',
          numeroDocumento: '123456',
          tipoProveedor: null,
          tipoTransaccion: '01',
          numeroPlanillaImportacion: null,
          numeroExpedienteImportacion: null,
          serieFacturaAfectada: null,
          numeroFacturaAfectada: null,
          fechaFacturaAfectada: null,
          montoFacturaAfectada: null,
          comentarioFacturaAfectada: null,
          regimenEspTributacion: null,
          fechaEmision: '2024-02-16 12:00:00.000',
          fechaVencimiento: '2024-02-16 12:00:00.000',
          horaEmision: '10:00:00 am',
          anulado: false,
          tipoDePago: '',
          serie: 'B',
          sucursal: '00000',
          tipoDeVenta: 'BS',
          moneda: 'VEF'
        },
        vendedor: null,
        comprador: {
          tipoIdentificacion: 'V',
          numeroIdentificacion: customer.id3 || '',
          razonSocial: customer.descrip || '',
          direccion: customer.direc1 || '',
          ubigeo: null,
          pais: 'VE',
          notificar: null,
          telefono: [customer.telef || ''],
          correo: ['comprador@example.com'],
          otrosEnvios: null
        },
        sujetoRetenido: null,
        totales: {
          nroItems: '10',
          montoGravadoTotal: 100,
          montoExentoTotal: 0,
          subtotal: 100,
          totalAPagar: 116.0,
          totalIVA: 16.0,
          montoTotalConIVA: 116.0,
          montoEnLetras: null,
          totalDescuento: '0.00',
          listaDescBonificacion: [
            {
              descDescuento: '',
              montoDescuento: '0.00'
            }
          ],
          impuestosSubtotal: [
            {
              codigoTotalImp: 'E',
              alicuotaImp: '00.00',
              baseImponibleImp: '000',
              valorTotalImp: '00.00'
            },
            {
              codigoTotalImp: 'IGTF',
              alicuotaImp: '3.00',
              baseImponibleImp: '100.00',
              valorTotalImp: '3.00'
            },
            {
              codigoTotalImp: 'G',
              alicuotaImp: '16.00',
              baseImponibleImp: 100,
              valorTotalImp: 16.0
            }
          ],
          formasPago: [
            {
              descripcion: descrip || 'Efectivo',
              fecha: '2024-02-06 12:00:00.000',
              forma: selectedOption || '-EFE-',
              monto: totalBs,
              moneda: 'VEF',
              tipoCambio: null
            }
          ]
        },
        totalesRetencion: null
      },
      detallesItems: [
        {
          numeroLinea: '1',
          codigoCIIU: 'CIIU',
          codigoPLU: 'PLU123',
          indicadorBienoServicio: 'B',
          descripcion: 'PUNTO SAINT',
          cantidad: '1',
          unidadMedida: 'U',
          precioUnitario: '100.0',
          precioUnitarioDescuento: '0.00',
          montoBonificacion: '0.00',
          descripcionBonificacion: 'N/A',
          descuentoMonto: '0.00',
          precioItem: '100.0',
          codigoImpuesto: 'E',
          tasaIVA: '16',
          valorIVA: '16.0',
          valorTotalItem: '116.0',
          infoAdicionalItem: null,
          listaItemOTI: [
            {
              tasaOTI: '0',
              codigoOTI: 'OTI',
              valorOTI: '0.00'
            }
          ]
        }
      ],
      detallesRetencion: null,
      viajes: null,
      infoAdicional: [
        {
          campo: 'campo1',
          valor: 'valor1'
        }
      ],
      guiaDespacho: null
    }
  };

  return this.fb.group(formValues) as unknown as FormGroup<DocumentoElectronicoForm>;
}


generateInvoice(body: any): Observable<any> {
  const headers = new HttpHeaders({
    'authorization': `Bearer ${localStorage.getItem('tokenTheFactory')}`
  });

  return this.http.post<any>(`${this.api}api/GenerarFactura/`, body, { headers });
}

updateFormAndGenerateInvoice(customer: any, totalBs: number, selectedOption: string, descrip: string): Observable<any> {
  const form = this.updateForm(customer, totalBs, selectedOption, descrip);
  const body = form.value.documentoElectronico;
  return this.generateInvoice(body);
}
  
}
