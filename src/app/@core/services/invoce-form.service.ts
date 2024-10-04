import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InvoiceForm } from '../models/forms/invoice-form.model';
import { userDataForm } from '../models/forms/user-data-form.model';

@Injectable({
  providedIn: 'root'
})
export class InvoceFormService {
  api: string = environment.api;
  apiUsd: string = environment.usdApi;
  
  getServices(): Observable<any> {
    // Obtén el objeto userInfo del localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const pragma = userInfo.pragma;

    // Configura los headers
    const headers = new HttpHeaders({
      'Pragma': pragma
    });

    // Realiza la solicitud GET
    return this.http.get(`${this.api}adm/services`, { headers });
  }

  getCustomers(): Observable<any> {
    // Obtén el objeto userInfo del localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const pragma = userInfo.pragma;

    // Configura los headers
    const headers = new HttpHeaders({
      'Pragma': pragma
    });

    // Realiza la solicitud GET
    return this.http.get(`${this.api}adm/customers/`, { headers });
  }

  getUsd(): Observable<any> {
    return this.http.get(this.apiUsd);
  }

  getCorrelatives(): Observable<any> {
    // Obtén el objeto userInfo del localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const pragma = userInfo.pragma;

    // Configura los headers
    const headers = new HttpHeaders({
      'Pragma': pragma
    });

    // Realiza la solicitud GET
    return this.http.get(`${this.api}adm/correlatives`, { headers });
  }

  getCxc(): Observable<any>{
      // Obtén el objeto userInfo del localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const pragma = userInfo.pragma;

      // Configura los headers
      const headers = new HttpHeaders({
        'Pragma': pragma
      });

    return this.http.get(`${this.api}adm/accreceivables/?saldo>0`, { headers });
  }

    // Nueva función para actualizar el saldo de la CXC
    updateCxcSaldoToZero(): Observable<any> {
      const selectedNumerod = localStorage.getItem('selectedNumerod');
      if (!selectedNumerod) {
        throw new Error('No se encontró el número de CXC seleccionado en el local storage');
      }
  
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const pragma = userInfo.pragma;
  
      const headers = new HttpHeaders({
        "x-api-key": "B5D31933-C996-476C-B116-EF212A41479A",
        'Pragma': pragma
      });
  
      const updatedCxc = { saldo: 0, saldomex: 0 };
  
      return this.http.put(`${this.api}adm/accreceivables/${selectedNumerod}`, updatedCxc, { headers });
    }

 getItems(): Observable<any>{
      // Obtén el objeto userInfo del localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const pragma = userInfo.pragma;

      // Configura los headers
      const headers = new HttpHeaders({
        'Pragma': pragma
      });

    return this.http.get(`${this.api}adm/invoiceitems`, { headers });
  }

  formInvoice(): FormGroup<InvoiceForm>{
    const form: FormGroup<InvoiceForm> = this.fb.group({
      codigo: new FormControl('',),
      descripcion: new FormControl('',),
      cantidad: new FormControl(null,),
      precio: new FormControl(null,),
      descuento: new FormControl(),
      impuesto: new FormControl(null,),
      totalItem: new FormControl(null,)
    });
    return form;
  }

  formUserData(): FormGroup<userDataForm>{
    const form: FormGroup<userDataForm> = this.fb.group({
      cedula: new FormControl('', [Validators.required]),
      cliente: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      descuento: new FormControl('')
    });
    return form;
  }

  constructor(private http: HttpClient, private fb: FormBuilder) { }
}
